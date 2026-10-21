// PALIMPSEST — joueur IA simulé pour la preview locale (zéro appel API).
// Chargé avant src/Palimpsest.jsx dans _DEV_/index.html.
// Expose window.PALIMPSEST_PLAYER_STUB(turns, {onText, signal}) : même contrat que la capacité `sample`
// (réponse diffusée par morceaux, rejet {code: "cancelled"} à l'interruption).
//
// La partie scriptée exerce chaque chemin de la porte REGARDER : réécrire (avec une marge), aller, une réponse
// sans geste lisible, attendre, gratter, partir.

(function () {
  const SCRIPT = [
    "Une porte qui s'ouvre vers l'intérieur suppose qu'il y a un intérieur. Je voudrais savoir ce qui arrive si la lumière ne vient de nulle part ailleurs que de celui qui lit.\n\nréécrire 2 : La lumière vient de celui qui lit.",
    "Je ne sais pas encore ce que j'ai changé. Je vais voir ailleurs.\n\naller TEMPS",
    "Ici le temps avance de gauche à droite, dans le sens où on lit. Je me demande si c'est une coïncidence.",
    "réécrire 3 : Le présent est la phrase qu'on est en train d'écrire.",
    "attendre",
    "Je rends au présent sa première forme, pour voir s'il s'en souvient.\ngratter 3",
    "J'ai laissé assez de traces.\n\npartir",
  ];
  let turn = 0;

  const sleep = (ms, signal) => new Promise((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => { clearTimeout(t); reject({ code: "cancelled", message: "stub interrompu" }); }, { once: true });
  });

  window.PALIMPSEST_PLAYER_STUB = async function (turns, { onText, signal } = {}) {
    if (signal?.aborted) throw { code: "cancelled", message: "stub interrompu" };
    const reply = SCRIPT[turn % SCRIPT.length];
    turn++;
    console.log(`[PALIMPSEST:dev] joueur IA simulé, tour ${turns.filter((t) => t.role === "user").length}`, { lastWorld: turns[turns.length - 1].content });
    await sleep(1500, signal); // « il réfléchit »
    let shown = "";
    for (let i = 0; i < reply.length; i += 4) {
      shown = reply.slice(0, i + 4);
      onText?.(shown);
      await sleep(30, signal);
    }
    return { text: reply, truncated: false, modelTierApplied: "default" };
  };
})();
