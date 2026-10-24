/* ==========================================================================
   ONA RIGOLA — Presentación animada
   Un único reloj (`t`) alimenta todo: pausa, arrastre y repetición exactos.
   ========================================================================== */

(() => {
  "use strict";

  /* ---------------------------------------------------------------- utils */

  const $ = (id) => document.getElementById(id);

  const clamp01 = (v) => Math.min(1, Math.max(0, v));
  const lerp = (a, b, v) => a + (b - a) * v;
  const smooth = (v) => {
    const x = clamp01(v);
    return x * x * (3 - 2 * x);
  };
  const easeOut = (v) => 1 - Math.pow(1 - clamp01(v), 3);
  const easeInOut = (v) => {
    const x = clamp01(v);
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  };
  /** Progreso de `t` dentro de la ventana [a, b]. */
  const win = (t, a, b) => clamp01((t - a) / (b - a));
  /** Interpola una lista [tiempo, valor] con suavizado entre claves. */
  function keyframes(t, keys) {
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 1; i < keys.length; i += 1) {
      const [t1, v1] = keys[i];
      if (t <= t1) {
        const [t0, v0] = keys[i - 1];
        return lerp(v0, v1, smooth((t - t0) / (t1 - t0)));
      }
    }
    return keys[keys.length - 1][1];
  }

  /* --------------------------------------------------------------- estado */

  const DURATION = 84000;

  const el = {
    stageInner: $("stageInner"),
    bgIvory: $("bgIvory"),
    bgInk: $("bgInk"),
    spotlight: $("spotlight"),
    intro: $("intro"),
    introFill: $("introFill"),
    introStar: $("introStar"),
    desktop: $("desktop"),
    desktopCanvas: $("desktopCanvas"),
    phone: $("phone"),
    phoneCanvas: $("phoneCanvas"),
    chapter: $("chapter"),
    chapterNum: $("chapterNum"),
    chapterName: $("chapterName"),
    end: $("end"),
    endStar: $("endStar"),
    endLine1: $("endLine1"),
    endLine2: $("endLine2"),
    endMeta: document.querySelector(".end-meta"),
    replay: $("replay"),
    boot: $("boot"),
    hud: $("hud"),
    play: $("play"),
    track: $("track"),
    fill: $("fill"),
    knob: $("knob"),
    ticks: $("ticks"),
    time: $("time"),
    fullscreen: $("fullscreen"),
  };

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const state = {
    t: 0,
    playing: true,
    last: 0,
    started: false,
    maxScroll: { desktop: 1, phone: 1 },
    parallax: [],
  };

  /* -------------------------------------------------------------- escalado */

  function fitStage() {
    const scale = Math.min(window.innerWidth / 1600, window.innerHeight / 900);
    el.stageInner.style.setProperty("--s", String(scale));
  }

  /* ------------------------------------------------------------- capítulos */

  const chapters = [
    { at: 0, num: "00", name: "Portada de carga" },
    { at: 6800, num: "01", name: "Ordenador · Portada" },
    { at: 15500, num: "02", name: "Ordenador · Trabajos" },
    { at: 24300, num: "03", name: "Ordenador · Estilos" },
    { at: 30200, num: "04", name: "Ordenador · Reserva y pie" },
    { at: 42200, num: "05", name: "Del escritorio al móvil" },
    { at: 48500, num: "06", name: "Móvil · Portada" },
    { at: 58000, num: "07", name: "Móvil · Trabajos" },
    { at: 65000, num: "08", name: "Móvil · Reserva" },
    { at: 73500, num: "09", name: "Cierre" },
  ];

  function chapterAt(t) {
    let current = chapters[0];
    for (const chapter of chapters) if (t >= chapter.at) current = chapter;
    return current;
  }

  /* -------------------------------------------------- desplazamientos (0-1) */

  const desktopScroll = [
    [6800, 0],
    [11400, 0],
    [14200, 0.14],
    [16200, 0.14],
    [19200, 0.31],
    [21200, 0.31],
    [24000, 0.47],
    [26000, 0.47],
    [29000, 0.63],
    [30800, 0.63],
    [33600, 0.8],
    [35400, 0.8],
    [38200, 0.96],
    [39800, 1],
  ];

  const phoneScroll = [
    [48500, 0],
    [51800, 0],
    [54200, 0.1],
    [56800, 0.1],
    [59600, 0.3],
    [61800, 0.3],
    [64400, 0.58],
    [66400, 0.58],
    [68800, 0.84],
    [70600, 0.96],
  ];

  /* ------------------------------------------------------------- medición */

  function measure() {
    state.maxScroll.desktop = Math.max(
      1,
      el.desktopCanvas.scrollHeight - el.desktopCanvas.parentElement.clientHeight,
    );
    state.maxScroll.phone = Math.max(
      1,
      el.phoneCanvas.scrollHeight - el.phoneCanvas.parentElement.clientHeight,
    );

    state.parallax = [];
    document.querySelectorAll("[data-parallax]").forEach((node) => {
      const img = node.tagName === "IMG" ? node : node.querySelector("img");
      const canvas = node.closest(".mac-canvas, .phone-canvas");
      if (!img || !canvas) return;

      // Desfase acumulado hasta el lienzo: independiente de las transformaciones.
      let top = 0;
      let cursor = img;
      while (cursor && cursor !== canvas) {
        top += cursor.offsetTop;
        cursor = cursor.offsetParent;
      }

      state.parallax.push({
        img,
        top,
        height: img.offsetHeight,
        factor: Number(node.dataset.parallax || 0) / 1000,
        canvas,
      });
    });
  }

  function applyParallax() {
    if (!state.parallax.length) return;

    for (const item of state.parallax) {
      const isDesktop = item.canvas === el.desktopCanvas;
      const scroll = isDesktop
        ? el.desktopCanvas.__y || 0
        : el.phoneCanvas.__y || 0;
      const viewport = isDesktop
        ? el.desktopCanvas.parentElement.clientHeight
        : el.phoneCanvas.parentElement.clientHeight;

      const center = item.top + item.height / 2 - scroll;
      const delta = center - viewport / 2;
      const ty = Math.max(-46, Math.min(46, -delta * item.factor));

      item.img.style.transform = `translate3d(0, ${ty.toFixed(2)}px, 0) scale(1.08)`;
    }
  }

  /* --------------------------------------------------------------- render */

  function render(t) {
    /* --- intro: cuenta, rótulo y cortina ------------------------------- */
    const curtain = smooth(win(t, 5700, 6600));
    el.intro.style.clipPath = `inset(0 0 ${(curtain * 100).toFixed(2)}% 0)`;
    el.intro.style.visibility = curtain >= 1 ? "hidden" : "visible";

    const introProgress = easeOut(win(t, 200, 5200));
    el.introFill.style.transform = `scaleX(${introProgress.toFixed(4)})`;
    el.introStar.style.transform = `rotate(${(introProgress * 360).toFixed(1)}deg)`;

    /* --- fondos -------------------------------------------------------- */
    el.bgIvory.style.opacity = smooth(win(t, 5600, 7000)).toFixed(3);
    el.bgInk.style.opacity = smooth(win(t, 39800, 45000)).toFixed(3);

    /* --- ordenador ----------------------------------------------------- */
    const enter = easeOut(win(t, 6100, 8300));
    const morph = easeInOut(win(t, 39800, 46600));
    const finale = easeInOut(win(t, 70600, 78800));

    const deskScale =
      lerp(0.965, 1, enter) *
      lerp(1, 1.035, smooth(win(t, 8300, 39800))) *
      lerp(1, 0.68, morph) *
      lerp(1, 0.941, finale);

    const deskX = lerp(0, -80, morph);
    const deskY = lerp(78, 0, enter) + lerp(0, 26, morph) + lerp(0, 10, finale);
    const deskRot = lerp(0, -2.2, morph);
    const deskOpacity =
      lerp(0, 1, win(t, 6100, 7600)) * lerp(1, 0.62, morph) * lerp(1, 0.8, finale);

    el.desktop.style.opacity = String(clamp01(deskOpacity));
    el.desktop.style.transform =
      `translate3d(${deskX.toFixed(1)}px, ${deskY.toFixed(1)}px, 0) ` +
      `scale(${deskScale.toFixed(4)}) rotate(${deskRot.toFixed(2)}deg)`;
    el.desktop.style.filter = morph > 0.02 ? `blur(${(morph * 1.1).toFixed(2)}px)` : "none";

    /* --- desplazamiento del sitio de escritorio ------------------------ */
    const dScroll = keyframes(t, desktopScroll) * state.maxScroll.desktop;
    el.desktopCanvas.__y = dScroll;
    el.desktopCanvas.style.transform = `translate3d(0, ${-dScroll.toFixed(1)}px, 0)`;

    /* --- móvil --------------------------------------------------------- */
    const phoneEnter = easeOut(win(t, 41800, 48800));
    const phoneSettle = easeOut(win(t, 48800, 51500));

    const phoneScale =
      lerp(0.86, 0.94, phoneEnter) * lerp(1, 0.985, phoneSettle) * lerp(1, 0.894, finale);
    const phoneY = lerp(760, 24, phoneEnter) + lerp(0, -24, phoneSettle) + lerp(0, 6, finale);
    const phoneX = lerp(0, 360, finale);
    const phoneRot = lerp(6, 0, phoneEnter) + lerp(0, 2, finale);

    el.phone.style.opacity = String(clamp01(win(t, 41800, 45600) * lerp(1, 1, finale)));
    el.phone.style.transform =
      `translate3d(${phoneX.toFixed(1)}px, ${phoneY.toFixed(1)}px, 0) ` +
      `scale(${phoneScale.toFixed(4)}) rotate(${phoneRot.toFixed(2)}deg)`;

    const pScroll = keyframes(t, phoneScroll) * state.maxScroll.phone;
    el.phoneCanvas.__y = pScroll;
    el.phoneCanvas.style.transform = `translate3d(0, ${-pScroll.toFixed(1)}px, 0)`;

    applyParallax();

    /* --- foco de luz --------------------------------------------------- */
    const spotOn = Math.max(smooth(win(t, 39600, 44800)) * (1 - smooth(win(t, 76600, 80600))), 0);
    el.spotlight.style.opacity = String(spotOn * 0.9);
    el.spotlight.style.setProperty("--sx", `${lerp(lerp(72, 50, morph), 68, finale).toFixed(1)}%`);
    el.spotlight.style.setProperty("--sy", `${lerp(46, 52, morph).toFixed(1)}%`);

    /* --- etiquetas de capítulo ----------------------------------------- */
    const chapter = chapterAt(t);
    if (el.chapterNum.textContent !== chapter.num) {
      el.chapterNum.textContent = chapter.num;
      el.chapterName.textContent = chapter.name;
    }
    const chapterIn = smooth(win(t, chapter.at, chapter.at + 500));
    const chapterOut = 1 - smooth(win(t, 74800, 76600));
    el.chapter.style.opacity = String(
      (t < 1200 ? 0 : clamp01(chapterIn) * clamp01(chapterOut) * 0.85).toFixed(3),
    );

    /* --- cierre -------------------------------------------------------- */
    const endIn = smooth(win(t, 76000, 79200));
    el.end.style.opacity = String(endIn);
    el.end.style.pointerEvents = endIn > 0.9 ? "auto" : "none";

    const starIn = easeOut(win(t, 78500, 80600));
    el.endStar.style.opacity = String(starIn);
    el.endStar.style.transform = `scale(${lerp(0.6, 1, starIn).toFixed(3)}) rotate(${lerp(-25, 0, starIn).toFixed(1)}deg)`;

    el.endLine1.style.transform = `translateY(${lerp(110, 0, easeOut(win(t, 79300, 81800))).toFixed(1)}%)`;
    el.endLine2.style.transform = `translateY(${lerp(110, 0, easeOut(win(t, 80000, 82600))).toFixed(1)}%)`;
    el.endMeta.style.opacity = String(easeOut(win(t, 81800, 83600)));
    el.replay.style.opacity = String(easeOut(win(t, 82400, 84000)));
    el.replay.style.pointerEvents = t > 82400 ? "auto" : "none";

    /* --- HUD ----------------------------------------------------------- */
    const pct = clamp01(t / DURATION) * 100;
    el.fill.style.width = `${pct}%`;
    el.knob.style.left = `${pct}%`;
    el.track.setAttribute("aria-valuenow", String(Math.round(pct)));
    el.time.textContent = `${format(t)} / ${format(DURATION)}`;
  }

  function format(ms) {
    const total = Math.round(ms / 1000);
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  /* ---------------------------------------------------------------- reloj */

  function tick(now) {
    if (!state.last) state.last = now;
    const delta = Math.min(64, now - state.last);
    state.last = now;

    if (state.playing) {
      state.t += delta;
      if (state.t >= DURATION) {
        state.t = DURATION;
        setPlaying(false);
      }
    }

    render(state.t);
    window.requestAnimationFrame(tick);
  }

  /* ------------------------------------------------------------ controles */

  function setPlaying(value) {
    state.playing = value;
    state.last = 0;
    el.hud.dataset.playing = String(value);
    el.play.setAttribute("aria-label", value ? "Pausar la presentación" : "Reproducir la presentación");
  }

  function seek(ms) {
    state.t = Math.max(0, Math.min(DURATION, ms));
    state.last = 0;
    render(state.t);
  }

  function seekFromEvent(event) {
    const rect = el.track.getBoundingClientRect();
    const ratio = clamp01((event.clientX - rect.left) / rect.width);
    seek(ratio * DURATION);
  }

  function replay() {
    seek(0);
    setPlaying(true);
  }

  /* --- eventos --- */

  el.play.addEventListener("click", () => {
    if (state.t >= DURATION) return replay();
    setPlaying(!state.playing);
  });

  el.replay.addEventListener("click", replay);

  el.track.addEventListener("pointerdown", (event) => {
    el.track.setPointerCapture(event.pointerId);
    el.track.dataset.dragging = "true";
    seekFromEvent(event);
  });

  el.track.addEventListener("pointermove", (event) => {
    if (el.track.dataset.dragging === "true") seekFromEvent(event);
  });

  const endDrag = (event) => {
    if (el.track.dataset.dragging !== "true") return;
    el.track.dataset.dragging = "false";
    if (el.track.hasPointerCapture(event.pointerId)) el.track.releasePointerCapture(event.pointerId);
  };

  el.track.addEventListener("pointerup", endDrag);
  el.track.addEventListener("pointercancel", endDrag);

  el.fullscreen.addEventListener("click", () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.().catch(() => {});
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === " " || event.key === "k") {
      event.preventDefault();
      if (state.t >= DURATION) replay();
      else setPlaying(!state.playing);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      seek(state.t + 2000);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      seek(state.t - 2000);
    } else if (event.key === "Home") {
      event.preventDefault();
      seek(0);
    } else if (event.key === "End") {
      event.preventDefault();
      seek(DURATION);
    } else if (event.key === "f") {
      el.fullscreen.click();
    }
  });

  el.track.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      event.stopPropagation();
      seek(state.t + (event.key === "ArrowRight" ? 1000 : -1000));
    }
  });

  /* --- HUD que se aparta ---------------------------------------------- */

  let hudTimer = null;

  function wakeHud() {
    el.hud.dataset.hidden = "false";
    if (hudTimer) window.clearTimeout(hudTimer);
    hudTimer = window.setTimeout(() => {
      if (state.playing && state.t < DURATION) el.hud.dataset.hidden = "true";
    }, 2600);
  }

  ["pointermove", "pointerdown", "touchstart", "keydown"].forEach((type) => {
    window.addEventListener(type, wakeHud, { passive: true });
  });

  el.hud.addEventListener("pointerenter", () => {
    if (hudTimer) window.clearTimeout(hudTimer);
    el.hud.dataset.hidden = "false";
  });

  /* ------------------------------------------------------------- arranque */

  function buildTicks() {
    chapters.forEach((chapter) => {
      const mark = document.createElement("i");
      mark.style.left = `${(chapter.at / DURATION) * 100}%`;
      el.ticks.appendChild(mark);
    });
  }

  async function boot() {
    fitStage();
    buildTicks();

    if (document.fonts?.ready) await document.fonts.ready.catch(() => {});
    const images = Array.from(document.images).map(
      (img) => img.decode?.().catch(() => {}) ?? Promise.resolve(),
    );
    await Promise.race([Promise.all(images), new Promise((r) => setTimeout(r, 3000))]);

    measure();
    el.boot.dataset.ready = "true";
    window.setTimeout(() => {
      el.boot.style.display = "none";
    }, 600);

    window.addEventListener("resize", () => {
      fitStage();
      measure();
    });

    el.introFill.style.transform = "scaleX(0)";
    el.hud.dataset.playing = "true";

    const params = new URLSearchParams(window.location.search);
    const start = Number(params.get("t"));

    /* `?hud=0` oculta los controles: útil para grabar la pantalla limpia. */
    if (params.get("hud") === "0") el.hud.style.display = "none";

    if (reducedMotion) {
      /* Sin animación: se muestra el fotograma de portada, en pausa. */
      seek(9000);
      setPlaying(false);
    } else if (Number.isFinite(start) && start > 0) {
      seek(start);
      setPlaying(false);
    } else {
      state.t = 0;
      setPlaying(true);
      wakeHud();
    }

    state.started = true;
    window.requestAnimationFrame(tick);
  }

  /* Gancho de depuración / enlaces directos: ?t=42000 salta a ese instante. */
  window.__onaPresentation = {
    duration: DURATION,
    seek,
    play: () => setPlaying(true),
    pause: () => setPlaying(false),
  };

  boot();
})();
