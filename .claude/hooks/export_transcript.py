#!/usr/bin/env python3
"""Export the Claude Code session transcript to journal/transcripts/ as Markdown.

Called by the Stop and SessionEnd hooks (JSON on stdin with transcript_path and
session_id), or by hand: python3 -I export_transcript.py <transcript.jsonl>

Keeps: the human's messages, Claude's text replies, one line per tool call,
token usage, and context compactions (the summary Claude wrote of the conversation,
which Claude Code then feeds back as a user turn: it is labelled as Claude's, never
as the human's). Drops: internal reasoning, raw tool output, screenshots, system
reminders. Masks API keys and similar secrets. Never fails the hook: exits 0.
"""
import json
import re
import sys
from datetime import datetime
from pathlib import Path

PROJECT = Path(__file__).resolve().parents[2]
OUT_DIR = PROJECT / "journal" / "transcripts"
LOG = Path(__file__).with_suffix(".log")
HOME = str(Path.home())

SECRET_PATTERNS = [
    re.compile(r"sk-ant-[A-Za-z0-9_\-]{8,}"),
    re.compile(r"sk-[A-Za-z0-9]{20,}"),
    re.compile(r"gh[pousr]_[A-Za-z0-9]{20,}"),
    re.compile(r"github_pat_[A-Za-z0-9_]{20,}"),
    re.compile(r"AKIA[0-9A-Z]{16}"),
    re.compile(r"xox[abprs]-[A-Za-z0-9\-]{10,}"),
    re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----"),
]
# System reminders and background-task notifications reach the model as user turns: they are not the human.
REMINDER = re.compile(r"<(system-reminder|task-notification)>[\s\S]*?</\1>")
COMMAND = re.compile(r"<command-name>([^<]*)</command-name>[\s\S]*?(?:<command-args>([^<]*)</command-args>)?")


def clean(text):
    text = REMINDER.sub("", text)
    for pat in SECRET_PATTERNS:
        text = pat.sub("[secret masqué]", text)
    return text.replace(str(PROJECT), ".").replace(HOME, "~").strip()


def local_time(ts):
    try:
        return datetime.fromisoformat(ts.replace("Z", "+00:00")).astimezone()
    except Exception:
        return None


def tool_label(name, inp):
    if name.startswith("mcp__"):
        parts = name.split("__")
        name = f"{parts[1].split('_')[-1]}.{parts[-1]}"
    inp = inp or {}
    if "description" in inp and isinstance(inp["description"], str):
        detail = inp["description"]
    else:
        detail = next(
            (inp[k] for k in ("file_path", "query", "url", "skill", "element", "target", "pattern", "command", "prompt")
             if isinstance(inp.get(k), str)),
            "",
        )
    detail = clean(detail.splitlines()[0] if detail else "")
    if len(detail) > 140:
        detail = detail[:137] + "…"
    return f"`{name}`" + (f" — {detail}" if detail else "")


def parse(path):
    events, usage, models, seen_requests = [], {"in": 0, "cache_write": 0, "cache_read": 0, "out": 0}, set(), set()
    first = last = None
    with open(path, encoding="utf-8") as f:
        for line in f:
            try:
                o = json.loads(line)
            except Exception:
                continue
            if o.get("isSidechain") or o.get("isMeta"):
                continue
            kind, msg = o.get("type"), o.get("message") or {}
            t = local_time(o["timestamp"]) if o.get("timestamp") else None
            if t:
                first = first or t
                last = t
            if kind == "system" and o.get("subtype") == "compact_boundary":
                meta = o.get("compactMetadata") or {}
                events.append(("compact", t, (meta.get("preTokens"), meta.get("postTokens"))))
                continue
            if kind == "user":
                content = msg.get("content")
                if isinstance(content, list):
                    if any(b.get("type") == "tool_result" for b in content):
                        continue
                    bits = []
                    for b in content:
                        if b.get("type") == "text":
                            bits.append(b.get("text", ""))
                        elif b.get("type") == "image":
                            bits.append("[image jointe]")
                    content = "\n".join(bits)
                if not isinstance(content, str) or "<local-command-stdout>" in content:
                    continue
                if o.get("isCompactSummary"):
                    events.append(("summary", t, clean(content)))
                    continue
                m = COMMAND.search(content)
                text = f"Commande `{m.group(1).strip()}` {(m.group(2) or '').strip()}".strip() if m else clean(content)
                if text:
                    events.append(("human", t, text))
            elif kind == "assistant":
                if msg.get("model") and not msg["model"].startswith("<"):
                    models.add(msg["model"])
                rid = o.get("requestId")
                u = msg.get("usage")
                if u and rid not in seen_requests:
                    seen_requests.add(rid)
                    usage["in"] += u.get("input_tokens", 0)
                    usage["cache_write"] += u.get("cache_creation_input_tokens", 0)
                    usage["cache_read"] += u.get("cache_read_input_tokens", 0)
                    usage["out"] += u.get("output_tokens", 0)
                for b in msg.get("content") or []:
                    if b.get("type") == "text" and b.get("text", "").strip():
                        events.append(("claude", t, clean(b["text"])))
                    elif b.get("type") == "tool_use":
                        events.append(("tool", t, tool_label(b.get("name", "?"), b.get("input"))))
    return events, usage, models, first, last, len(seen_requests)


def render(session_id, events, usage, models, first, last, requests):
    n_h = sum(1 for e in events if e[0] == "human")
    n_c = sum(1 for e in events if e[0] == "claude")
    n_t = sum(1 for e in events if e[0] == "tool")
    n_k = sum(1 for e in events if e[0] == "compact")
    fmt = "%Y-%m-%d %H:%M"

    def num(n):
        return f"{n:,}".replace(",", " ")

    out = [
        f"# Transcription brute — session `{session_id[:8]}`",
        "",
        "> Export automatique (hook Stop / SessionEnd, `.claude/hooks/export_transcript.py`). "
        "Régénéré à chaque fin de tour : ne pas éditer à la main, l'analyse va dans `journal/sessions/`.",
        "> Contient les messages de Nordine, les réponses de Claude et une ligne par action. "
        "Exclut le raisonnement interne, les résultats bruts des outils, les captures et les rappels système. "
        "Secrets masqués.",
        "",
        f"- Début : {first.strftime(fmt) if first else '?'} · dernière activité : {last.strftime(fmt) if last else '?'}",
        f"- Modèle(s) : {', '.join(sorted(models)) or '?'}",
        f"- Messages de Nordine : {n_h} · réponses de Claude : {n_c} · actions : {n_t} · requêtes API : {requests}"
        + (f" · compactions du contexte : {n_k}" if n_k else ""),
        f"- Tokens : {num(usage['in'] + usage['cache_write'] + usage['cache_read'])} en entrée "
        f"(dont {num(usage['cache_read'])} relus en cache, {num(usage['cache_write'])} écrits en cache), "
        f"{num(usage['out'])} en sortie",
        "",
        "---",
    ]
    prev, day = None, first.date() if first else None
    for kind, t, text in events:
        # The date appears in a heading whenever the day changes: a session can span days.
        hhmm = t.strftime("%H:%M") if t else ""
        if t and t.date() != day:
            day = t.date()
            hhmm = t.strftime("%Y-%m-%d %H:%M")
            prev = None
        if kind == "compact":
            pre, post = text
            sizes = f" ({num(pre)} tokens ramenés à {num(post)})" if pre and post else ""
            out += ["", f"## Compaction du contexte — {hhmm}", "",
                    f"> Le contexte de la conversation{sizes} a été remplacé par un résumé que Claude a rédigé "
                    "lui-même. Claude Code le lui a ensuite renvoyé comme un message de l'utilisateur : "
                    "ce n'est pas un message de Nordine. La suite de la session part de ce résumé seul."]
        elif kind == "summary":
            out += ["", "<details><summary>Résumé rédigé par Claude</summary>", "", text, "", "</details>"]
        elif kind == "human":
            out += ["", f"## Nordine — {hhmm}", "", text]
        elif kind == "claude":
            if prev != "claude-block":
                out += ["", f"### Claude — {hhmm}"]
            out += ["", text]
        else:
            if prev != "claude-block":
                out += ["", f"### Claude — {hhmm}"]
            out += ["", f"> action : {text}"]
        prev = "claude-block" if kind in ("claude", "tool") else kind
    return "\n".join(out) + "\n"


def main():
    try:
        payload = {}
        if len(sys.argv) > 1:
            payload["transcript_path"] = sys.argv[1]
        elif not sys.stdin.isatty():
            raw = sys.stdin.read()
            payload = json.loads(raw) if raw.strip() else {}
        path = payload.get("transcript_path")
        if not path or not Path(path).exists():
            return
        session_id = payload.get("session_id") or Path(path).stem
        events, usage, models, first, last, requests = parse(path)
        if not any(e[0] == "human" for e in events):
            return
        OUT_DIR.mkdir(parents=True, exist_ok=True)
        target = OUT_DIR / f"{(first or datetime.now()).strftime('%Y-%m-%d')}_{session_id[:8]}.md"
        text = render(session_id, events, usage, models, first, last, requests)
        if target.exists() and target.read_text(encoding="utf-8") == text:
            return
        tmp = target.with_suffix(".tmp")
        tmp.write_text(text, encoding="utf-8")
        tmp.replace(target)
    except Exception as exc:  # never break the session over the journal
        try:
            with open(LOG, "a", encoding="utf-8") as log:
                log.write(f"{datetime.now().isoformat()} {type(exc).__name__}: {exc}\n")
        except Exception:
            pass


if __name__ == "__main__":
    main()
    sys.exit(0)
