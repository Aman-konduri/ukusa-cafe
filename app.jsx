// ==========================================================================
// UKUSA — INTERACTIVE REACT APPLICATION (LUSION-INSPIRED WEBGL & MOTION)
// ==========================================================================

const { useState, useEffect, useRef, useMemo, useCallback } = React;

const formatINR = (amount) => `₹${Math.round(amount).toLocaleString("en-IN")}`;

// --------------------------------------------------------------------------
// 1. MAGNETIC WRAPPER COMPONENT
// --------------------------------------------------------------------------
function Magnetic({ children, strength = 0.28, cursorLabel = "", cursorColor = "", className = "" }) {
  const ref = useRef(null);

  const isTouchOrMobile = () =>
    window.innerWidth < 768 ||
    (window.matchMedia && window.matchMedia("(hover: none)").matches);

  const handleMouseMove = (e) => {
    if (isTouchOrMobile()) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
  };

  const handleMouseEnter = () => {
    if (isTouchOrMobile()) return;
    if (window.ukusaSound) window.ukusaSound.playHover();
    if (cursorLabel && window.setUkusaCursor) {
      window.setUkusaCursor({ active: true, label: cursorLabel, color: cursorColor });
    }
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (el) {
      el.style.transform = "translate3d(0px, 0px, 0px)";
    }
    if (isTouchOrMobile()) return;
    if (cursorLabel && window.setUkusaCursor) {
      window.setUkusaCursor({ active: false, label: "", color: "" });
    }
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ transition: "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)" }}
      className={`inline-block ${className}`}
    >
      {children}
    </div>
  );
}

// --------------------------------------------------------------------------
// 2. CUSTOM DYNAMIC CURSOR WITH CONTEXTUAL LABELS
// --------------------------------------------------------------------------
function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [cursorState, setCursorState] = useState({ active: false, label: "", color: "" });

  useEffect(() => {
    window.setUkusaCursor = (next) => {
      setCursorState(next);
    };

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });

    let raf;
    const render = () => {
      raf = requestAnimationFrame(render);
      ring.x += (mouse.x - ring.x) * 0.16;
      ring.y += (mouse.y - ring.y) * 0.16;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
      }
    };
    render();

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const hasLabel = Boolean(cursorState.label);
  const bg = cursorState.color || (hasLabel ? "#C85A32" : "rgba(244, 243, 239, 0.08)");

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden md:block overflow-hidden">
      {/* Crisp center dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -ml-1 -mt-1 w-2 h-2 rounded-full bg-[#F4F3EF] mix-blend-difference transition-opacity duration-200"
        style={{ opacity: hasLabel ? 0 : 1 }}
      />
      {/* Lerped morphing ring / pill */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 flex items-center justify-center rounded-full border transition-all duration-300 ease-out"
        style={{
          width: hasLabel ? "92px" : "38px",
          height: hasLabel ? "92px" : "38px",
          marginLeft: hasLabel ? "-46px" : "-19px",
          marginTop: hasLabel ? "-46px" : "-19px",
          backgroundColor: bg,
          borderColor: hasLabel ? "transparent" : "rgba(244, 243, 239, 0.35)",
          backdropFilter: hasLabel ? "blur(8px)" : "none",
          boxShadow: hasLabel ? "0 12px 35px rgba(200, 90, 50, 0.35)" : "none"
        }}
      >
        {hasLabel && (
          <span className="font-mono text-[10px] font-semibold tracking-[0.18em] text-[#F4F3EF] uppercase text-center px-2 leading-tight">
            {cursorState.label}
          </span>
        )}
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// 3. INTERACTIVE PRELOADER (0% - 100% + WORDMARK SPLIT)
// --------------------------------------------------------------------------
function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [splitting, setSplitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let val = 0;
    const timer = setInterval(() => {
      val += Math.floor(Math.random() * 14) + 6;
      if (val >= 100) {
        val = 100;
        setProgress(100);
        clearInterval(timer);
        setTimeout(() => setSplitting(true), 250);
        setTimeout(() => {
          setDone(true);
          onComplete();
        }, 1250);
      } else {
        setProgress(val);
      }
    }, 60);
    return () => clearInterval(timer);
  }, [onComplete]);

  if (done) return null;

  return (
    <div className="fixed inset-0 z-[5000] pointer-events-auto flex flex-col overflow-hidden">
      {/* Top Shutter */}
      <div
        className="relative flex-1 bg-[#0B0B0C] border-b border-[#F4F3EF]/10 flex flex-col justify-between p-6 md:p-12 transition-transform duration-1000 ease-[cubic-bezier(0.83,0,0.17,1)]"
        style={{ transform: splitting ? "translateY(-102%)" : "translateY(0%)" }}
      >
        <div className="flex justify-between items-center font-mono text-xs tracking-[0.2em] text-[#F4F3EF]/60">
          <span>UKUSA // SENSORY ROASTERY</span>
          <span>LAT 35.0116° N / LON 135.7681° E</span>
        </div>

        {/* Upper Half of Split Wordmark */}
        <div className="overflow-hidden flex justify-center items-end">
          <h1 className="font-display font-extrabold text-[17vw] leading-[0.75] tracking-tighter text-[#F4F3EF] select-none translate-y-[38%]">
            UKUSA
          </h1>
        </div>
      </div>

      {/* Bottom Shutter */}
      <div
        className="relative flex-1 bg-[#0B0B0C] flex flex-col justify-between p-6 md:p-12 transition-transform duration-1000 ease-[cubic-bezier(0.83,0,0.17,1)]"
        style={{ transform: splitting ? "translateY(102%)" : "translateY(0%)" }}
      >
        {/* Lower Half of Split Wordmark */}
        <div className="overflow-hidden flex justify-center items-start">
          <h1 className="font-display font-extrabold text-[17vw] leading-[0.75] tracking-tighter text-[#C85A32] select-none -translate-y-[62%]">
            UKUSA
          </h1>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
          <div className="w-full md:w-72 h-[2px] bg-[#F4F3EF]/15 overflow-hidden">
            <div
              className="h-full bg-[#C85A32] transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-baseline gap-4 font-mono">
            <span className="text-xs tracking-[0.22em] text-[#F4F3EF]/50 uppercase">
              PRESSURIZING 9.0 BAR
            </span>
            <span className="text-3xl md:text-5xl font-bold text-[#F4F3EF]">
              {String(progress).padStart(3, "0")}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// 4. DRAGGABLE PHOTO STACK (SPRING PHYSICS + FLICK AWAY)
// --------------------------------------------------------------------------
function DraggablePhotoStack() {
  const [cards, setCards] = useState(window.UKUSA_DATA.photoStack);
  const [dragState, setDragState] = useState({ dragging: false, x: 0, y: 0, rot: 0 });
  const startPos = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    startPos.current = { x: e.clientX - dragState.x, y: e.clientY - dragState.y };
    setDragState((prev) => ({ ...prev, dragging: true }));
    if (window.ukusaSound) window.ukusaSound.playClick();
  };

  const handlePointerMove = (e) => {
    if (!dragState.dragging) return;
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    setDragState({
      dragging: true,
      x: dx,
      y: dy,
      rot: dx * 0.06
    });
  };

  const handlePointerUp = () => {
    if (!dragState.dragging) return;
    const threshold = window.innerWidth < 768 ? 55 : 95;
    if (Math.hypot(dragState.x, dragState.y) > threshold) {
      // Flick card to back of deck
      if (window.ukusaSound) window.ukusaSound.playConfirm();
      setCards((prev) => {
        const [first, ...rest] = prev;
        return [...rest, first];
      });
    }
    setDragState({ dragging: false, x: 0, y: 0, rot: 0 });
  };

  const cycleNextCard = () => {
    if (window.ukusaSound) window.ukusaSound.playClick();
    setCards((prev) => {
      const [first, ...rest] = prev;
      return [...rest, first];
    });
  };

  return (
    <div className="relative w-full max-w-[440px] mx-auto h-[540px] max-md:h-[460px] select-none">
      {/* Stack Header Indicator */}
      <div className="flex justify-between items-center mb-4 font-mono text-xs max-md:text-[10px] tracking-[0.18em] text-[#0B0B0C]/60">
        <span>INTERACTIVE ARCHIVE // DRAG OR FLICK</span>
        <button
          onClick={cycleNextCard}
          className="px-3 py-1 rounded-full border border-[#0B0B0C]/20 hover:bg-[#0B0B0C] hover:text-[#F4F3EF] transition-colors uppercase"
        >
          SHUFFLE NEXT ↻
        </button>
      </div>

      <div
        className="relative w-full h-[480px] max-md:h-[400px]"
        onMouseEnter={() =>
          window.setUkusaCursor && window.setUkusaCursor({ active: true, label: "DRAG", color: "#C85A32" })
        }
        onMouseLeave={() =>
          window.setUkusaCursor && window.setUkusaCursor({ active: false, label: "", color: "" })
        }
      >
        {cards
          .slice(0, 4)
          .reverse()
          .map((card, reversedIdx, arr) => {
            const stackIndex = arr.length - 1 - reversedIdx; // 0 is top card
            const isTop = stackIndex === 0;

            const baseScale = 1 - stackIndex * 0.045;
            const baseY = stackIndex * 16;
            const baseRot = stackIndex % 2 === 0 ? stackIndex * 2.2 : -stackIndex * 2.2;

            const transform = isTop
              ? `translate3d(${dragState.x}px, ${dragState.y}px, 0) rotate(${dragState.rot}deg) scale(1)`
              : `translate3d(0px, ${baseY}px, 0) rotate(${baseRot}deg) scale(${baseScale})`;

            return (
              <div
                key={card.id}
                onPointerDown={isTop ? handlePointerDown : undefined}
                onPointerMove={isTop ? handlePointerMove : undefined}
                onPointerUp={isTop ? handlePointerUp : undefined}
                onPointerCancel={isTop ? handlePointerUp : undefined}
                style={{
                  transform,
                  transition:
                    isTop && dragState.dragging
                      ? "none"
                      : "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease",
                  zIndex: 30 - stackIndex,
                  touchAction: "none"
                }}
                className={`absolute inset-0 rounded-2xl overflow-hidden bg-[#0B0B0C] text-[#F4F3EF] shadow-2xl border border-[#F4F3EF]/15 flex flex-col justify-between ${
                  isTop ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"
                }`}
              >
                {/* Background image */}
                <div className="relative h-[64%] w-full overflow-hidden bg-[#181615]">
                  <img
                    src={card.fallbackImage || card.image}
                    alt={card.title}
                    draggable="false"
                    className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-transparent to-black/30" />
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-center font-mono text-[11px] tracking-[0.2em]">
                    <span className="px-2.5 py-1 rounded-full bg-[#0B0B0C]/75 backdrop-blur-md text-[#D9B382] border border-[#D9B382]/30">
                      {card.index}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-[#C85A32] text-[#F4F3EF] font-semibold">
                      FLICK CARD ↗
                    </span>
                  </div>
                </div>

                {/* Card Metadata */}
                <div className="p-6 flex-1 flex flex-col justify-between bg-[#0B0B0C]">
                  <div>
                    <p className="font-mono text-[11px] tracking-[0.2em] text-[#C85A32] uppercase mb-1">
                      {card.subtitle}
                    </p>
                    <h4 className="font-display text-xl font-bold tracking-tight text-[#F4F3EF]">
                      {card.title}
                    </h4>
                  </div>
                  <p className="text-xs text-[#F4F3EF]/70 leading-relaxed border-t border-[#F4F3EF]/10 pt-3">
                    {card.caption}
                  </p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// 5. INTERACTIVE "FIND YOUR BREW" SENSORY SELECTOR
// --------------------------------------------------------------------------
function BrewFinderSection({ onAddPairing }) {
  // 0 to 100 continuous sliders + quick mood presets
  const [boldness, setBoldness] = useState(65); // 0: Smooth/Silky -> 100: Bold/Intense
  const [tempPref, setTempPref] = useState("Hot"); // "Hot" | "Iced"
  const [profile, setProfile] = useState(40); // 0: Sweet/Creamy -> 100: Earthy/Botanical

  const recommendation = useMemo(() => {
    const items = window.UKUSA_DATA.menuItems;
    let drink;
    let pastry;
    let rationale;

    if (tempPref === "Iced") {
      if (profile > 55) {
        drink = items.find((i) => i.id === "sig-01"); // Smoked Black Sesame Latte
        pastry = items.find((i) => i.id === "bak-01"); // Black Sesame Kouign-Amann
        rationale = "High earthy resonance with cold-extracted tahini salinity and laminated caramel crunch.";
      } else if (boldness > 60) {
        drink = items.find((i) => i.id === "esp-04"); // Kyoto 18-Hour Slow Drip
        pastry = items.find((i) => i.id === "bak-02"); // Miso Brown Butter Canele
        rationale = "18-hour glacial extraction paired with rum-custard beeswax crust for deep cacao harmonics.";
      } else {
        drink = items.find((i) => i.id === "mat-03"); // Salted Pistachio Matcha Cloud
        pastry = items.find((i) => i.id === "bak-03"); // Yuzu Pistachio Croissant
        rationale = "Velvety Sicilian pistachio foam and Kochi yuzu citrus brighten smooth first-harvest matcha.";
      }
    } else {
      // Hot recommendations
      if (boldness > 70 && profile > 50) {
        drink = items.find((i) => i.id === "esp-01"); // Obsidian Double Espresso
        pastry = items.find((i) => i.id === "bak-02"); // Miso Brown Butter Canele
        rationale = "Unfiltered 9-bar Sidama intensity cut by savory-sweet white miso and caramelized beeswax.";
      } else if (profile > 60) {
        drink = items.find((i) => i.id === "mat-01"); // Uji Ceremonial Matcha
        pastry = items.find((i) => i.id === "bak-01"); // Black Sesame Kouign-Amann
        rationale = "Pure Kyoto Samidori umami balanced against toasted black sesame and cultured Isigny butter.";
      } else if (boldness < 45) {
        drink = items.find((i) => i.id === "esp-02"); // Velvet Oat Cortado
        pastry = items.find((i) => i.id === "bak-04"); // Cardamom Espresso Brioche Knot
        rationale = "Micro-steamed 58°C oat silkiness paired with freshly mortared green cardamom sourdough brioche.";
      } else {
        drink = items.find((i) => i.id === "sig-03"); // Cardamom Burnt Honey Cortado
        pastry = items.find((i) => i.id === "bak-03"); // Yuzu Pistachio Croissant
        rationale = "Smoked wildflower honey and expressed orange oil elevated by crisp twice-baked pistachio pastry.";
      }
    }

    return {
      drink,
      pastry,
      rationale,
      bundlePrice: Math.round((drink.price + pastry.price) * 0.92) // 8% ritual pairing privilege
    };
  }, [boldness, tempPref, profile]);

  const applyPreset = (b, t, p) => {
    if (window.ukusaSound) window.ukusaSound.playClick();
    setBoldness(b);
    setTempPref(t);
    setProfile(p);
  };

  return (
    <section id="ritual" className="relative py-28 md:py-36 max-md:py-14 px-6 md:px-14 max-md:px-5 bg-[#111113] border-y border-[#F4F3EF]/10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 max-md:mb-8 gap-6 max-md:gap-3">
          <div>
            <p className="font-mono text-xs tracking-[0.25em] text-[#C85A32] uppercase mb-3">
              03 // ALGORITHMIC SOMMELIER
            </p>
            <h2 className="font-display text-4xl md:text-6xl max-md:text-3xl font-extrabold tracking-tight text-[#F4F3EF]">
              CALIBRATE YOUR RITUAL.
            </h2>
          </div>
          <p className="font-mono text-xs text-[#F4F3EF]/60 max-w-md leading-relaxed">
            DIAL IN YOUR SENSORY COORDINATES BELOW. OUR EXTRACTION MATRIX PAIRS A BESPOKE BEVERAGE WITH AN ARTISANAL BAKE.
          </p>
        </div>

        {/* Interactive Matrix Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-md:gap-6 items-stretch">
          {/* Left Controls (7 cols) */}
          <div className="lg:col-span-7 bg-[#0B0B0C] border border-[#F4F3EF]/12 rounded-3xl max-md:rounded-2xl p-8 md:p-10 max-md:p-5 flex flex-col justify-between">
            {/* Quick Mood Pills */}
            <div className="mb-10 max-md:mb-7">
              <span className="block font-mono text-[11px] tracking-[0.2em] text-[#F4F3EF]/50 uppercase mb-4 max-md:mb-3">
                QUICK SENSORY PRESETS
              </span>
              <div className="flex flex-wrap gap-2.5 max-md:gap-2">
                {[
                  { label: "KYOTO DAWN (UMAMI & HOT)", b: 45, t: "Hot", p: 85 },
                  { label: "VELVET GOLDEN HOUR (SWEET & ICED)", b: 35, t: "Iced", p: 25 },
                  { label: "OBSIDIAN FOCUS (9-BAR BOLD)", b: 90, t: "Hot", p: 75 },
                  { label: "BLACK SESAME CLOUD (EARTHY ICED)", b: 70, t: "Iced", p: 80 }
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => applyPreset(preset.b, preset.t, preset.p)}
                    className="font-mono text-xs max-md:text-[10px] px-4 py-2 max-md:px-3 max-md:py-2 rounded-full border border-[#F4F3EF]/15 text-[#F4F3EF]/80 hover:border-[#C85A32] hover:text-[#F4F3EF] hover:bg-[#C85A32]/15 transition-all text-left"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders & Toggles */}
            <div className="space-y-9 max-md:space-y-6">
              {/* Axis 1: Bold vs Smooth */}
              <div>
                <div className="flex justify-between font-mono text-xs max-md:text-[10px] tracking-[0.15em] max-md:tracking-[0.08em] mb-3">
                  <span className={boldness < 50 ? "text-[#D9B382] font-bold" : "text-[#F4F3EF]/50"}>
                    ← SILKY & SMOOTH
                  </span>
                  <span className="text-[#F4F3EF]/40 max-md:hidden">EXTRACTION INTENSITY: {boldness}%</span>
                  <span className="text-[#F4F3EF]/40 md:hidden">{boldness}%</span>
                  <span className={boldness >= 50 ? "text-[#C85A32] font-bold" : "text-[#F4F3EF]/50"}>
                    BOLD & VISCOUS →
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={boldness}
                  onChange={(e) => setBoldness(Number(e.target.value))}
                  className="ukusa-slider w-full"
                />
              </div>

              {/* Axis 2: Temperature Toggle */}
              <div>
                <div className="flex justify-between font-mono text-xs max-md:text-[10px] tracking-[0.15em] max-md:tracking-[0.08em] mb-3">
                  <span className="text-[#F4F3EF]/50">THERMAL EXTRACTION STATE</span>
                  <span className="text-[#D9B382]">{tempPref === "Hot" ? "58°C – 93°C" : "2°C GLACIAL"}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 max-md:gap-2 p-1.5 rounded-2xl bg-[#161618] border border-[#F4F3EF]/10">
                  {["Hot", "Iced"].map((temp) => (
                    <button
                      key={temp}
                      onClick={() => {
                        if (window.ukusaSound) window.ukusaSound.playClick();
                        setTempPref(temp);
                      }}
                      className={`py-3.5 rounded-xl font-mono text-xs max-md:text-[11px] tracking-[0.2em] max-md:tracking-[0.1em] uppercase transition-all ${
                        tempPref === temp
                          ? "bg-[#C85A32] text-[#F4F3EF] font-bold shadow-lg"
                          : "text-[#F4F3EF]/60 hover:text-[#F4F3EF]"
                      }`}
                    >
                      {temp === "Hot" ? "🔥 STEAMED / HOT" : "🧊 COLD / OVER ICE"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Axis 3: Sweet vs Earthy */}
              <div>
                <div className="flex justify-between font-mono text-xs max-md:text-[10px] tracking-[0.15em] max-md:tracking-[0.08em] mb-3">
                  <span className={profile < 50 ? "text-[#D9B382] font-bold" : "text-[#F4F3EF]/50"}>
                    ← CARAMEL & SWEET
                  </span>
                  <span className="text-[#F4F3EF]/40 max-md:hidden">TERROIR SPECTRUM: {profile}%</span>
                  <span className="text-[#F4F3EF]/40 md:hidden">{profile}%</span>
                  <span className={profile >= 50 ? "text-[#C85A32] font-bold" : "text-[#F4F3EF]/50"}>
                    EARTHY & UMAMI →
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={profile}
                  onChange={(e) => setProfile(Number(e.target.value))}
                  className="ukusa-slider w-full"
                />
              </div>
            </div>

            {/* Bottom Live Telemetry Bar */}
            <div className="mt-10 max-md:mt-6 pt-6 max-md:pt-4 border-t border-[#F4F3EF]/10 flex flex-wrap justify-between items-center gap-4 max-md:gap-2 font-mono text-[11px] max-md:text-[10px] text-[#F4F3EF]/50">
              <span>TDS TARGET: {(1.35 + boldness * 0.008).toFixed(2)}%</span>
              <span>WATER MINERALITY: 65 PPM</span>
              <span className="text-[#D9B382]">PAIRING SYNERGY: 99.4%</span>
            </div>
          </div>

          {/* Right Live Recommendation Output Card (5 cols) */}
          <div className="lg:col-span-5 bg-[#F4F3EF] text-[#0B0B0C] rounded-3xl max-md:rounded-2xl p-8 md:p-10 max-md:p-5 flex flex-col justify-between relative overflow-hidden shadow-2xl">
            <div>
              <div className="flex justify-between items-center font-mono text-xs max-md:text-[10px] tracking-[0.18em] mb-6 max-md:mb-4">
                <span className="px-3 py-1 rounded-full bg-[#0B0B0C] text-[#F4F3EF]">
                  BESPOKE PAIRING
                </span>
                <span className="text-[#C85A32] font-bold">SAVE 8% BUNDLE</span>
              </div>

              {/* Dual visual thumbnails */}
              <div className="grid grid-cols-2 gap-4 max-md:gap-3 mb-6 max-md:mb-5">
                <div className="group relative rounded-2xl overflow-hidden h-40 max-md:h-32 bg-[#0B0B0C]">
                  <img
                    src={recommendation.drink.image}
                    alt={recommendation.drink.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-[#0B0B0C]/80 text-[#F4F3EF] font-mono text-[10px]">
                    01 // CUP
                  </span>
                </div>
                <div className="group relative rounded-2xl overflow-hidden h-40 max-md:h-32 bg-[#0B0B0C]">
                  <img
                    src={recommendation.pastry.image}
                    alt={recommendation.pastry.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-[#0B0B0C]/80 text-[#F4F3EF] font-mono text-[10px]">
                    02 // PLATE
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-6 max-md:mb-5">
                <div>
                  <span className="font-mono text-[10px] tracking-[0.2em] text-[#C85A32] uppercase">
                    LIQUID COMPONENT ({tempPref.toUpperCase()})
                  </span>
                  <h3 className="font-display text-2xl max-md:text-xl font-extrabold leading-tight">
                    {recommendation.drink.name}
                  </h3>
                </div>
                <div className="text-xs font-mono text-[#0B0B0C]/60">+ PAIRED WITH</div>
                <div>
                  <span className="font-mono text-[10px] tracking-[0.2em] text-[#C85A32] uppercase">
                    PASTRY COMPONENT
                  </span>
                  <h4 className="font-display text-xl max-md:text-lg font-bold leading-tight">
                    {recommendation.pastry.name}
                  </h4>
                </div>
              </div>

              <p className="text-xs text-[#0B0B0C]/75 leading-relaxed border-l-2 border-[#C85A32] pl-3.5 mb-8 max-md:mb-5">
                {recommendation.rationale}
              </p>
            </div>

            <div className="pt-5 border-t border-[#0B0B0C]/15 flex max-md:flex-col items-center max-md:items-stretch justify-between gap-4">
              <div className="max-md:flex max-md:items-baseline max-md:justify-between">
                <span className="block font-mono text-[10px] tracking-[0.18em] text-[#0B0B0C]/50 uppercase">
                  RITUAL PAIRING TOTAL
                </span>
                <span className="font-mono text-2xl font-extrabold text-[#0B0B0C]">
                  {formatINR(recommendation.bundlePrice)}
                </span>
              </div>

              <Magnetic strength={0.2} cursorLabel="ADD +" cursorColor="#C85A32" className="max-md:w-full">
                <button
                  onClick={() => onAddPairing(recommendation.drink, recommendation.pastry, tempPref)}
                  className="px-6 py-4 max-md:w-full rounded-full bg-[#0B0B0C] text-[#F4F3EF] hover:bg-[#C85A32] transition-colors font-mono text-xs tracking-[0.18em] uppercase font-bold"
                >
                  Add Pairing to Order +
                </button>
              </Magnetic>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --------------------------------------------------------------------------
// 6. PHYSICS WORDMARK IN FOOTER (LETTERS BEND, STRETCH & REPEL FROM CURSOR)
// --------------------------------------------------------------------------
function PhysicsWordmark() {
  const letters = ["U", "K", "U", "S", "A"];
  const containerRef = useRef(null);
  const letterRefs = useRef([]);

  const handlePointerMove = (e) => {
    const container = containerRef.current;
    if (!container) return;

    letterRefs.current.forEach((el) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const maxRadius = 280;

      if (dist < maxRadius) {
        const power = 1 - dist / maxRadius;
        const repelX = -(dx / (dist || 1)) * power * 42;
        const repelY = -(dy / (dist || 1)) * power * 36;
        const stretchY = 1 + power * 0.28;
        const stretchX = 1 - power * 0.12;
        const skew = (dx / maxRadius) * power * 18;

        el.style.transform = `translate3d(${repelX}px, ${repelY}px, 0) scale(${stretchX}, ${stretchY}) skewX(${skew}deg)`;
        el.style.color = power > 0.45 ? "#C85A32" : "#F4F3EF";
      } else {
        el.style.transform = "translate3d(0px, 0px, 0) scale(1, 1) skewX(0deg)";
        el.style.color = "#F4F3EF";
      }
    });
  };

  const handlePointerLeave = () => {
    letterRefs.current.forEach((el) => {
      if (!el) return;
      el.style.transform = "translate3d(0px, 0px, 0) scale(1, 1) skewX(0deg)";
      el.style.color = "#F4F3EF";
    });
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onMouseEnter={() =>
        window.setUkusaCursor && window.setUkusaCursor({ active: true, label: "DISTORT", color: "#C85A32" })
      }
      onMouseLeave={() =>
        window.setUkusaCursor && window.setUkusaCursor({ active: false, label: "", color: "" })
      }
      className="w-full overflow-hidden py-8 max-md:py-4 select-none md:cursor-none"
    >
      <div className="flex justify-between items-center px-2 md:px-6 max-md:px-1 w-full">
        {letters.map((char, i) => (
          <span
            key={i}
            ref={(el) => (letterRefs.current[i] = el)}
            style={{
              transition: "transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), color 0.25s ease",
              willChange: "transform"
            }}
            className="font-display font-extrabold text-[19vw] max-md:text-[17vw] leading-[0.82] tracking-tighter text-[#F4F3EF] inline-block"
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// 7. MAIN UKUSA APP COMPONENT
// --------------------------------------------------------------------------
function UkusaApp() {
  const [loaded, setLoaded] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("espresso");

  // Floating menu hover image preview state
  const [hoveredItem, setHoveredItem] = useState(null);
  const previewRef = useRef(null);
  const previewPos = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  // Customizer Modal state
  const [customizingItem, setCustomizingItem] = useState(null);
  const [customOptions, setCustomOptions] = useState({
    milk: "Barista Oat (+₹60)",
    milkCost: 60,
    temp: "Hot",
    sweetness: "Unsweetened (100% Terroir)",
    extraShot: false,
    warmed: true
  });

  // Cart Drawer state
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([
    {
      cartId: "init-1",
      id: "sig-01",
      name: "Smoked Black Sesame Latte",
      price: 290,
      qty: 1,
      details: "Iced · Barista Oat · Smoked Sea Salt Foam",
      image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=900&q=85"
    }
  ]);
  const [orderCheckedOut, setOrderCheckedOut] = useState(false);

  // Table Reservation Modal state
  const [reserveOpen, setReserveOpen] = useState(false);
  const [reservation, setReservation] = useState({
    date: "2026-11-21",
    time: "10:30 AM",
    guests: 2,
    zone: "Espresso Basalt Bar",
    name: "",
    notes: ""
  });
  const [reservationConfirmed, setReservationConfirmed] = useState(false);

  // Toast Notification state
  const [toast, setToast] = useState(null);

  // Refs for WebGL & GSAP ScrollTrigger animations
  const webglContainerRef = useRef(null);
  const storyContainerRef = useRef(null);
  const horizontalSectionRef = useRef(null);
  const horizontalTrackRef = useRef(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => {
      setToast((prev) => (prev === msg ? null : prev));
    }, 3200);
  }, []);

  // Initialize WebGL Hero Playground
  useEffect(() => {
    if (!webglContainerRef.current || !window.initUkusaWebGL) return;
    const cleanup = window.initUkusaWebGL(webglContainerRef.current);
    return cleanup;
  }, []);

  // Initialize Lenis Smooth Inertial Scrolling + GSAP ScrollTrigger
  useEffect(() => {
    let lenis;
    if (window.Lenis) {
      lenis = new window.Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true
      });

      const raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }

    if (window.gsap && window.ScrollTrigger) {
      const gsap = window.gsap;
      const ScrollTrigger = window.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      // 1. Word-by-word illumination in Philosophy Section
      const words = document.querySelectorAll(".scrub-word");
      if (words.length > 0 && storyContainerRef.current) {
        gsap.fromTo(
          words,
          { opacity: 0.16, color: "#0B0B0C" },
          {
            opacity: 1,
            color: "#0B0B0C",
            stagger: 0.08,
            scrollTrigger: {
              trigger: storyContainerRef.current,
              start: "top 78%",
              end: "bottom 52%",
              scrub: 1
            }
          }
        );
      }

      // 2. Horizontal Scroll Gallery ("The Space") — Desktop (>= 768px) only; Mobile uses native snap-x carousel
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        if (horizontalSectionRef.current && horizontalTrackRef.current) {
          const track = horizontalTrackRef.current;
          gsap.to(track, {
            x: () => -(track.scrollWidth - window.innerWidth + 96),
            ease: "none",
            scrollTrigger: {
              trigger: horizontalSectionRef.current,
              start: "top top",
              end: () => `+=${track.scrollWidth - window.innerWidth + 200}`,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true
            }
          });
        }
      });
    }

    return () => {
      if (lenis) lenis.destroy();
      if (window.ScrollTrigger) {
        window.ScrollTrigger.getAll().forEach((t) => t.kill());
      }
    };
  }, [loaded]);

  // Lerp floating menu preview image following the cursor
  useEffect(() => {
    const onMove = (e) => {
      previewPos.current.tx = e.clientX;
      previewPos.current.ty = e.clientY;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      previewPos.current.x += (previewPos.current.tx - previewPos.current.x) * 0.12;
      previewPos.current.y += (previewPos.current.ty - previewPos.current.y) * 0.12;
      if (previewRef.current) {
        const vx = previewPos.current.tx - previewPos.current.x;
        const tilt = Math.max(-14, Math.min(14, vx * 0.18));
        previewRef.current.style.transform = `translate3d(${previewPos.current.x + 28}px, ${
          previewPos.current.y - 110
        }px, 0) rotate(${tilt}deg)`;
      }
    };
    loop();

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const openCustomizer = (item) => {
    if (window.ukusaSound) window.ukusaSound.playClick();
    setCustomizingItem(item);
    setCustomOptions({
      milk: "Barista Oat (+₹60)",
      milkCost: item.isDrink ? 60 : 0,
      temp: item.defaultTemp || "Hot",
      sweetness: "Unsweetened (100% Terroir)",
      extraShot: false,
      warmed: true
    });
  };

  const liveCustomPrice = useMemo(() => {
    if (!customizingItem) return 0;
    let total = customizingItem.price;
    if (customizingItem.isDrink) {
      total += customOptions.milkCost;
      if (customOptions.extraShot) total += 50;
    }
    return total;
  }, [customizingItem, customOptions]);

  const handleAddCustomizedToCart = () => {
    if (!customizingItem) return;
    if (window.ukusaSound) window.ukusaSound.playConfirm();

    const details = customizingItem.isDrink
      ? `${customOptions.temp} · ${customOptions.milk.split(" (")[0]} · ${
          customOptions.extraShot ? "Double Ristretto Boost" : customOptions.sweetness
        }`
      : customOptions.warmed
      ? "Warmed in Deck Oven · Cultured Butter Service"
      : "Room Temp Artisanal Service";

    const newItem = {
      cartId: `${customizingItem.id}-${Date.now()}`,
      id: customizingItem.id,
      name: customizingItem.name,
      price: liveCustomPrice,
      qty: 1,
      details,
      image: customizingItem.image
    };

    setCart((prev) => [...prev, newItem]);
    setCustomizingItem(null);
    setOrderCheckedOut(false);
    setCartOpen(true);
    showToast(`ADDED ${customizingItem.name.toUpperCase()} TO BAG`);
  };

  const handleAddPairingToCart = (drink, pastry, tempPref) => {
    if (window.ukusaSound) window.ukusaSound.playConfirm();
    const pairItems = [
      {
        cartId: `${drink.id}-${Date.now()}-1`,
        id: drink.id,
        name: `${drink.name} (Pairing)`,
        price: Math.round(drink.price * 0.92),
        qty: 1,
        details: `${tempPref} · Sommelier Calibrated`,
        image: drink.image
      },
      {
        cartId: `${pastry.id}-${Date.now()}-2`,
        id: pastry.id,
        name: `${pastry.name} (Pairing)`,
        price: Math.round(pastry.price * 0.92),
        qty: 1,
        details: "Warmed · Paired Ritual Privilege (-8%)",
        image: pastry.image
      }
    ];
    setCart((prev) => [...prev, ...pairItems]);
    setOrderCheckedOut(false);
    setCartOpen(true);
    showToast("ADDED CALIBRATED PAIRING TO ORDER BAG");
  };

  const updateCartQty = (cartId, delta) => {
    if (window.ukusaSound) window.ukusaSound.playClick();
    setCart((prev) =>
      prev
        .map((item) => (item.cartId === cartId ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.qty, 0), [cart]);
  const cartSubtotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.qty, 0),
    [cart]
  );

  const filteredMenu = useMemo(
    () => window.UKUSA_DATA.menuItems.filter((item) => item.category === activeCategory),
    [activeCategory]
  );

  const storyText =
    "WE APPROACH COFFEE NOT AS COMMODITY, BUT AS LIQUID ARCHITECTURE. FROM HIGH-ALTITUDE VOLCANIC LOTS IN SIDAMA AND BOQUETE TO OUR CAST-IRON 1968 PROBAT ROASTER, EVERY EXTRACTION IS CALIBRATED FOR VISCOSITY, CLARITY, AND QUIET SENSORY RESONANCE.";

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#F4F3EF] selection:bg-[#C85A32] selection:text-[#F4F3EF] relative max-md:overflow-x-hidden">
      {/* Custom Morphing Cursor */}
      <CustomCursor />

      {/* Interactive Split Preloader */}
      <Preloader onComplete={() => setLoaded(true)} />

      {/* Toast Notification Pill */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[4000] px-6 py-3 max-md:px-4 max-md:py-2.5 max-md:w-[90vw] max-md:justify-center rounded-full bg-[#C85A32] text-[#F4F3EF] font-mono text-xs max-md:text-[10px] tracking-[0.2em] shadow-2xl flex items-center gap-3 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#F4F3EF] flex-shrink-0" />
          <span className="truncate">{toast}</span>
        </div>
      )}

      {/* ==================================================================
          STICKY MINIMALIST EDITORIAL HEADER
         ================================================================== */}
      <header className="fixed top-0 left-0 right-0 z-[1000] px-6 md:px-12 max-md:px-5 py-5 max-md:py-3.5 flex items-center justify-between backdrop-blur-md bg-[#0B0B0C]/70 border-b border-[#F4F3EF]/10">
        <Magnetic strength={0.22}>
          <a
            href="#hero"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 group"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#C85A32] group-hover:scale-125 transition-transform" />
            <span className="font-display font-extrabold text-xl tracking-tight text-[#F4F3EF]">
              UKUSA
            </span>
            <span className="hidden sm:inline-block font-mono text-[10px] tracking-[0.22em] text-[#F4F3EF]/45 pl-2 border-l border-[#F4F3EF]/15">
              ROASTERY & SANCTUARY
            </span>
          </a>
        </Magnetic>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-8 font-mono text-xs tracking-[0.18em] text-[#F4F3EF]/75">
          {[
            { href: "#philosophy", label: "01. PHILOSOPHY" },
            { href: "#menu", label: "02. MENU" },
            { href: "#ritual", label: "03. BREW FINDER" },
            { href: "#space", label: "04. THE SPACE" }
          ].map((link) => (
            <Magnetic key={link.href} strength={0.25}>
              <a
                href={link.href}
                className="hover:text-[#C85A32] transition-colors py-1"
              >
                {link.label}
              </a>
            </Magnetic>
          ))}
        </nav>

        {/* Right Controls: Ambient Sound Toggle + Reserve + Live Order Bag + Mobile Menu Toggle */}
        <div className="flex items-center gap-3 max-md:gap-2">
          {/* Ambient Sound Button */}
          <Magnetic strength={0.25} cursorLabel={soundOn ? "MUTE" : "AUDIO"}>
            <button
              onClick={() => {
                const state = window.ukusaSound ? window.ukusaSound.toggle() : !soundOn;
                setSoundOn(state);
              }}
              aria-label="Toggle Ambient Sound"
              className={`px-3.5 py-2 max-md:px-2.5 max-md:py-2 rounded-full border font-mono text-[11px] tracking-[0.15em] flex items-center gap-2 transition-all ${
                soundOn
                  ? "border-[#C85A32] bg-[#C85A32]/20 text-[#F4F3EF]"
                  : "border-[#F4F3EF]/20 text-[#F4F3EF]/60 hover:text-[#F4F3EF]"
              }`}
            >
              <span className="flex items-end gap-[2px] h-3">
                {[1, 2, 3, 4].map((bar) => (
                  <span
                    key={bar}
                    className={`w-[2px] bg-current transition-all duration-300 ${
                      soundOn ? "animate-pulse" : ""
                    }`}
                    style={{
                      height: soundOn ? `${4 + ((bar * 3) % 9)}px` : "3px"
                    }}
                  />
                ))}
              </span>
              <span className="hidden sm:inline">{soundOn ? "SFX ON" : "SFX OFF"}</span>
            </button>
          </Magnetic>

          {/* Table Reservation Trigger */}
          <Magnetic strength={0.22} cursorLabel="BOOK" cursorColor="#C85A32">
            <button
              onClick={() => {
                if (window.ukusaSound) window.ukusaSound.playClick();
                setReservationConfirmed(false);
                setReserveOpen(true);
              }}
              className="hidden sm:inline-flex px-4 py-2 rounded-full border border-[#F4F3EF]/25 hover:border-[#F4F3EF] font-mono text-[11px] tracking-[0.18em] uppercase transition-all"
            >
              Reserve Table
            </button>
          </Magnetic>

          {/* Order Bag Trigger */}
          <Magnetic strength={0.25} cursorLabel="BAG" cursorColor="#C85A32">
            <button
              onClick={() => {
                if (window.ukusaSound) window.ukusaSound.playClick();
                setMobileMenuOpen(false);
                setCartOpen(true);
              }}
              className="px-4 py-2 max-md:px-3.5 max-md:py-2 rounded-full bg-[#F4F3EF] text-[#0B0B0C] hover:bg-[#C85A32] hover:text-[#F4F3EF] font-mono text-[11px] font-bold tracking-[0.18em] uppercase transition-colors flex items-center gap-2"
            >
              <span>ORDER</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#0B0B0C] text-[#F4F3EF] text-[10px]">
                {cartCount}
              </span>
            </button>
          </Magnetic>

          {/* Dedicated Mobile Hamburger Menu Button (< 768px only) */}
          <button
            onClick={() => {
              if (window.ukusaSound) window.ukusaSound.playClick();
              setMobileMenuOpen((prev) => !prev);
            }}
            aria-label="Toggle Mobile Navigation"
            className="md:hidden w-9 h-9 rounded-full border border-[#F4F3EF]/25 flex flex-col items-center justify-center gap-1.5 text-[#F4F3EF] active:bg-[#C85A32] transition-colors"
          >
            <span
              className={`w-4 h-[1.5px] bg-current transition-transform duration-300 ${
                mobileMenuOpen ? "rotate-45 translate-y-[3.5px]" : ""
              }`}
            />
            <span
              className={`w-4 h-[1.5px] bg-current transition-transform duration-300 ${
                mobileMenuOpen ? "-rotate-45 -translate-y-[3.5px]" : ""
              }`}
            />
          </button>
        </div>
      </header>

      {/* ==================================================================
          DEDICATED MOBILE FULL-SCREEN NAVIGATION OVERLAY (< 768px only)
         ================================================================== */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[950] bg-[#0B0B0C]/98 backdrop-blur-xl pt-24 pb-8 px-6 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-2">
            <span className="font-mono text-[10px] tracking-[0.25em] text-[#C85A32] uppercase block mb-4">
              SANCTUARY DIRECTORY
            </span>
            {[
              { href: "#philosophy", code: "01", label: "Philosophy & Terroir" },
              { href: "#menu", code: "02", label: "Seasonal Menu" },
              { href: "#ritual", code: "03", label: "Find Your Brew" },
              { href: "#space", code: "04", label: "The Sanctuary" }
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (window.ukusaSound) window.ukusaSound.playClick();
                  setMobileMenuOpen(false);
                }}
                className="flex items-baseline justify-between py-4 border-b border-[#F4F3EF]/12 active:text-[#C85A32]"
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs text-[#C85A32]">{item.code}</span>
                  <span className="font-display text-2xl font-extrabold text-[#F4F3EF]">
                    {item.label}
                  </span>
                </div>
                <span className="font-mono text-sm text-[#D9B382]">→</span>
              </a>
            ))}
          </div>

          <div className="space-y-4 pt-6">
            <button
              onClick={() => {
                if (window.ukusaSound) window.ukusaSound.playClick();
                setMobileMenuOpen(false);
                setReservationConfirmed(false);
                setReserveOpen(true);
              }}
              className="w-full py-4 rounded-full bg-[#C85A32] text-[#F4F3EF] font-mono text-xs font-bold tracking-[0.2em] uppercase"
            >
              Reserve a Table →
            </button>
            <div className="flex justify-between items-center font-mono text-[10px] tracking-[0.18em] text-[#F4F3EF]/50 pt-2">
              <span>428 NAKAGYO-KU BASALT LANE</span>
              <span>07:00 — 19:00</span>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================
          SECTION 1: HERO WITH INTERACTIVE WEBGL ESPRESSO SHADER PLAYGROUND
         ================================================================== */}
      <section
        id="hero"
        className="relative min-h-screen w-full flex flex-col justify-between pt-28 max-md:pt-20 pb-10 max-md:pb-8 px-6 md:px-14 max-md:px-5 overflow-hidden"
      >
        {/* Interactive Three.js WebGL Liquid Shader Canvas */}
        <div
          ref={webglContainerRef}
          onMouseEnter={() =>
            window.setUkusaCursor &&
            window.setUkusaCursor({ active: true, label: "RIPPLE", color: "#C85A32" })
          }
          onMouseLeave={() =>
            window.setUkusaCursor &&
            window.setUkusaCursor({ active: false, label: "", color: "" })
          }
          className="absolute inset-0 z-0 cursor-pointer"
        />

        {/* Subtle radial vignette so kinetic typography pops cleanly */}
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,transparent_25%,#0B0B0C_92%)]" />

        {/* Top Telemetry Bar */}
        <div className="relative z-10 flex flex-wrap justify-between items-center gap-4 max-md:gap-2 font-mono text-[11px] max-md:text-[10px] tracking-[0.22em] max-md:tracking-[0.15em] text-[#F4F3EF]/60 border-b border-[#F4F3EF]/10 pb-4 max-md:pb-3">
          <span>EXTRACTION LAB // 93.5°C · 9.0 BAR</span>
          <span className="text-[#D9B382] max-md:hidden">INTERACTIVE WEBGL // MOVE & CLICK TO RIPPLE CREMA</span>
          <span className="text-[#D9B382] md:hidden">TAP TO RIPPLE CREMA</span>
          <span className="max-md:hidden">HARVEST 2026 // MICRO-LOT 04</span>
        </div>

        {/* Center Giant Split-Line Kinetic Typography */}
        <div className="relative z-10 my-auto py-12 max-md:py-6 pointer-events-none">
          <div className="overflow-hidden">
            <p className="font-mono text-xs md:text-sm max-md:text-[10px] tracking-[0.3em] max-md:tracking-[0.18em] text-[#C85A32] uppercase mb-4 max-md:mb-3">
              SPECIALTY COFFEE · CEREMONIAL MATCHA · LAMINATED PASTRY
            </p>
          </div>

          <h1 className="font-display font-extrabold uppercase tracking-tighter leading-[0.88] max-md:leading-[1.05] text-[11.5vw] md:text-[8.8vw] max-md:text-[2.45rem] text-[#F4F3EF] mix-blend-lighten">
            <span className="block">UKUSA —</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#F4F3EF] via-[#D9B382] to-[#C85A32]">
              CRAFTED FOR
            </span>
            <span className="block flex items-center gap-4 md:gap-8">
              <span>THE RITUAL.</span>
            </span>
          </h1>
        </div>

        {/* Bottom Hero Action Row */}
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 max-md:gap-5 pt-6 max-md:pt-4 border-t border-[#F4F3EF]/10">
          <div className="max-w-md">
            <p className="font-mono text-xs max-md:text-[11px] text-[#F4F3EF]/70 leading-relaxed">
              AN ARCHITECTURAL ESPRESSO SANCTUARY INSPIRED BY KYOTO LISTEN-BARS AND NORDIC ROASTING PRECISION.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 max-md:gap-3 max-md:w-full">
            <Magnetic strength={0.25} cursorLabel="EXPLORE" cursorColor="#C85A32" className="max-md:w-full">
              <a
                href="#menu"
                className="px-8 py-4 max-md:w-full max-md:justify-center rounded-full bg-[#C85A32] text-[#F4F3EF] hover:bg-[#F4F3EF] hover:text-[#0B0B0C] font-mono text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-xl inline-flex items-center gap-3"
              >
                <span>Explore Seasonal Menu</span>
                <span>↘</span>
              </a>
            </Magnetic>

            <Magnetic strength={0.25} cursorLabel="TASTE" cursorColor="#D9B382" className="max-md:w-full">
              <a
                href="#ritual"
                className="px-7 py-4 max-md:w-full max-md:text-center max-md:block rounded-full border border-[#F4F3EF]/25 hover:border-[#D9B382] text-[#F4F3EF] font-mono text-xs tracking-[0.2em] uppercase transition-all"
              >
                Find Your Brew
              </a>
            </Magnetic>
          </div>
        </div>
      </section>

      {/* ==================================================================
          SECTION 2: ABOUT / PHILOSOPHY (LUSION-STYLE SCROLL + DRAGGABLE STACK)
         ================================================================== */}
      <section
        id="philosophy"
        className="relative py-28 md:py-40 max-md:py-14 px-6 md:px-14 max-md:px-5 bg-[#F4F3EF] text-[#0B0B0C] rounded-t-[2.5rem] md:rounded-t-[4rem] max-md:rounded-t-[1.75rem]"
      >
        <div className="max-w-7xl mx-auto">
          {/* Top Section Meta */}
          <div className="flex flex-wrap justify-between items-center gap-4 max-md:gap-2 pb-8 max-md:pb-5 mb-16 max-md:mb-8 border-b border-[#0B0B0C]/15 font-mono text-xs max-md:text-[10px] tracking-[0.2em] max-md:tracking-[0.14em]">
            <span className="text-[#C85A32] font-bold">01 // PHILOSOPHY & TERROIR</span>
            <span>PROBAT UG22 · REMINERALIZED WATER · 72H FERMENTATION</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 max-md:gap-10 items-center">
            {/* Left 7 Cols: Scroll-Scrubbed Word-by-Word Illuminated Editorial Text */}
            <div ref={storyContainerRef} className="lg:col-span-7 space-y-10 max-md:space-y-6">
              <div className="font-display font-bold text-2xl sm:text-4xl md:text-[42px] max-md:text-xl leading-[1.18] max-md:leading-[1.35] tracking-tight">
                {storyText.split(" ").map((word, idx) => (
                  <span
                    key={idx}
                    className="scrub-word inline-block mr-[0.28em] transition-colors"
                  >
                    {word}
                  </span>
                ))}
              </div>

              {/* 3 Architectural Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-md:gap-5 pt-8 max-md:pt-6 border-t border-[#0B0B0C]/15">
                <div>
                  <span className="font-mono text-xs text-[#C85A32] font-bold tracking-[0.2em]">
                    01 / SOURCE
                  </span>
                  <h3 className="font-display font-bold text-lg mt-1 mb-2">
                    Direct Micro-Lots
                  </h3>
                  <p className="text-xs text-[#0B0B0C]/70 leading-relaxed">
                    92+ point lots harvested above 1,900m in Ethiopia, Panama, and Colombia.
                  </p>
                </div>
                <div>
                  <span className="font-mono text-xs text-[#C85A32] font-bold tracking-[0.2em]">
                    02 / ROAST
                  </span>
                  <h3 className="font-display font-bold text-lg mt-1 mb-2">
                    Nordic Light Curves
                  </h3>
                  <p className="text-xs text-[#0B0B0C]/70 leading-relaxed">
                    Omni-roasted to highlight translucent florals, stone fruit, and natural sweetness.
                  </p>
                </div>
                <div>
                  <span className="font-mono text-xs text-[#C85A32] font-bold tracking-[0.2em]">
                    03 / SPACE
                  </span>
                  <h3 className="font-display font-bold text-lg mt-1 mb-2">
                    Acoustic Calm
                  </h3>
                  <p className="text-xs text-[#0B0B0C]/70 leading-relaxed">
                    Hi-fi vinyl warmth and monolithic basalt counters built for unhurried presence.
                  </p>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Tactile Draggable Photo Stack */}
            <div className="lg:col-span-5">
              <DraggablePhotoStack />
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================
          SECTION 3: INTERACTIVE MENU & FLOATING CURSOR-TRAILING PREVIEW
         ================================================================== */}
      <section id="menu" className="relative py-28 md:py-36 max-md:py-14 px-6 md:px-14 max-md:px-5 bg-[#0B0B0C] text-[#F4F3EF]">
        {/* Floating Cursor-Trailing Image Preview */}
        <div
          ref={previewRef}
          className="pointer-events-none fixed top-0 left-0 z-[2000] hidden md:block w-72 h-80 rounded-2xl overflow-hidden shadow-2xl border border-[#F4F3EF]/20 bg-[#141416] transition-opacity duration-300"
          style={{ opacity: hoveredItem ? 1 : 0 }}
        >
          {hoveredItem && (
            <>
              <img
                src={hoveredItem.image}
                alt={hoveredItem.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <span className="font-mono text-[10px] tracking-[0.2em] text-[#D9B382] block">
                  {hoveredItem.origin}
                </span>
                <span className="font-display text-sm font-bold text-[#F4F3EF]">
                  CLICK TO CUSTOMIZE +
                </span>
              </div>
            </>
          )}
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 max-md:mb-7 gap-6 max-md:gap-3">
            <div>
              <p className="font-mono text-xs tracking-[0.25em] text-[#C85A32] uppercase mb-3">
                02 // SEASONAL CURATION
              </p>
              <h2 className="font-display text-4xl md:text-6xl max-md:text-3xl font-extrabold tracking-tight">
                THE EXTRACTION MENU.
              </h2>
            </div>
            <p className="font-mono text-xs text-[#F4F3EF]/60 max-w-sm">
              <span className="max-md:hidden">HOVER ANY ITEM TO PREVIEW. CLICK TO OPEN THE BESPOKE CUSTOMIZER & LIVE ORDER BAG.</span>
              <span className="md:hidden">TAP ANY ITEM TO OPEN THE BESPOKE CUSTOMIZER & LIVE ORDER BAG.</span>
            </p>
          </div>

          {/* Animated Category Filter Tabs (Horizontally scrollable pills on mobile) */}
          <div className="flex flex-wrap max-md:flex-nowrap max-md:overflow-x-auto no-scrollbar gap-3 max-md:gap-2.5 pb-10 max-md:pb-6 mb-10 max-md:mb-6 border-b border-[#F4F3EF]/12 max-md:-mx-5 max-md:px-5">
            {window.UKUSA_DATA.categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <Magnetic key={cat.id} strength={0.18} className="max-md:flex-shrink-0">
                  <button
                    onClick={() => {
                      if (window.ukusaSound) window.ukusaSound.playClick();
                      setActiveCategory(cat.id);
                    }}
                    className={`px-6 py-3.5 max-md:px-4 max-md:py-2.5 rounded-full font-mono text-xs max-md:text-[11px] tracking-[0.18em] uppercase transition-all flex items-center gap-3 max-md:gap-2 whitespace-nowrap ${
                      isActive
                        ? "bg-[#F4F3EF] text-[#0B0B0C] font-bold shadow-lg"
                        : "bg-[#151518] text-[#F4F3EF]/70 hover:text-[#F4F3EF] border border-[#F4F3EF]/10"
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        isActive ? "bg-[#0B0B0C] text-[#F4F3EF]" : "bg-[#F4F3EF]/10"
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                </Magnetic>
              );
            })}
          </div>

          {/* Interactive Menu List Rows */}
          <div className="divide-y divide-[#F4F3EF]/12">
            {filteredMenu.map((item) => (
              <div
                key={item.id}
                onMouseEnter={() => {
                  setHoveredItem(item);
                  if (window.ukusaSound) window.ukusaSound.playHover();
                  if (window.setUkusaCursor) {
                    window.setUkusaCursor({ active: true, label: "TASTE +", color: "#C85A32" });
                  }
                }}
                onMouseLeave={() => {
                  setHoveredItem(null);
                  if (window.setUkusaCursor) {
                    window.setUkusaCursor({ active: false, label: "", color: "" });
                  }
                }}
                onClick={() => openCustomizer(item)}
                className="group py-8 max-md:py-5 px-4 max-md:px-2 -mx-4 max-md:-mx-2 rounded-2xl hover:bg-[#F4F3EF]/[0.04] transition-all cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-6 max-md:gap-4"
              >
                {/* Left Code, Mobile Thumbnail & Title */}
                <div className="flex items-start md:items-center gap-6 max-md:gap-3.5">
                  {/* Crisp Mobile Thumbnail (< 768px only) since mobile users don't hover */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="md:hidden w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-[#F4F3EF]/15 bg-[#151518]"
                  />
                  <span className="max-md:hidden font-mono text-xs text-[#C85A32] tracking-[0.2em] pt-1 md:pt-0">
                    {item.code}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="md:hidden block font-mono text-[10px] text-[#C85A32] tracking-[0.18em] mb-0.5">
                      {item.code}
                    </span>
                    <div className="flex flex-wrap items-center gap-3 max-md:gap-1.5 mb-1.5">
                      <h3 className="font-display text-2xl md:text-3xl max-md:text-lg font-bold group-hover:text-[#D9B382] transition-colors leading-snug">
                        {item.name}
                      </h3>
                      {item.tags &&
                        item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="font-mono text-[10px] max-md:text-[9px] tracking-[0.18em] max-md:tracking-[0.12em] px-2.5 py-0.5 max-md:px-2 rounded-full border border-[#F4F3EF]/20 text-[#F4F3EF]/70"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                    <p className="text-sm max-md:text-xs text-[#F4F3EF]/60 max-w-2xl leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Right Tasting Notes + Price + Quick Customize CTA */}
                <div className="flex flex-wrap sm:flex-nowrap items-center justify-between lg:justify-end gap-6 max-md:gap-3 lg:gap-10 pl-14 max-md:pl-0 lg:pl-0 max-md:pt-2 max-md:border-t max-md:border-[#F4F3EF]/10">
                  <div className="text-left lg:text-right max-md:flex-1 max-md:min-w-0">
                    <span className="block font-mono text-[10px] tracking-[0.2em] max-md:tracking-[0.12em] text-[#D9B382] uppercase truncate">
                      {item.tastingNotes}
                    </span>
                    <span className="block font-mono text-[11px] max-md:text-[10px] text-[#F4F3EF]/45 mt-0.5 truncate">
                      {item.origin}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 max-md:gap-3 flex-shrink-0">
                    <span className="font-mono text-2xl max-md:text-lg font-bold text-[#F4F3EF]">
                      {formatINR(item.price)}
                    </span>
                    <span className="w-11 h-11 max-md:w-9 max-md:h-9 rounded-full border border-[#F4F3EF]/20 group-hover:bg-[#C85A32] group-hover:border-[#C85A32] flex items-center justify-center font-mono text-lg transition-all">
                      +
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================================
          SECTION 4: INTERACTIVE "FIND YOUR BREW" SOMMELIER SELECTOR
         ================================================================== */}
      <BrewFinderSection onAddPairing={handleAddPairingToCart} />

      {/* ==================================================================
          SECTION 5: THE SPACE (SCROLL-LOCKED HORIZONTAL GALLERY ON DESKTOP,
          TOUCH-SWIPEABLE CAROUSEL ON MOBILE)
         ================================================================== */}
      <section
        id="space"
        ref={horizontalSectionRef}
        className="relative h-screen max-md:h-auto w-full overflow-hidden bg-[#0B0B0C] flex flex-col justify-between py-20 max-md:py-14 max-md:gap-6"
      >
        <div className="px-6 md:px-14 max-md:px-5 flex flex-wrap justify-between items-end gap-4 max-md:gap-2">
          <div>
            <p className="font-mono text-xs tracking-[0.25em] text-[#C85A32] uppercase mb-2">
              04 // SPATIAL ARCHITECTURE
            </p>
            <h2 className="font-display text-3xl md:text-5xl max-md:text-2xl font-extrabold tracking-tight">
              THE SANCTUARY IN MOTION.
            </h2>
          </div>
          <span className="font-mono text-xs max-md:text-[10px] tracking-[0.2em] text-[#D9B382]">
            <span className="max-md:hidden">SCROLL TO TRAVERSE GALLERY →</span>
            <span className="md:hidden">SWIPE TO EXPLORE GALLERY →</span>
          </span>
        </div>

        {/* Horizontal Track */}
        <div
          ref={horizontalTrackRef}
          className="flex items-center gap-8 md:gap-12 max-md:gap-4 px-6 md:px-14 max-md:px-5 w-max max-md:w-full max-md:overflow-x-auto max-md:snap-x max-md:snap-mandatory no-scrollbar max-md:pb-2"
        >
          {window.UKUSA_DATA.spaceGallery.map((zone) => (
            <div
              key={zone.id}
              onMouseEnter={() =>
                window.setUkusaCursor &&
                window.setUkusaCursor({ active: true, label: "EXPLORE", color: "#C85A32" })
              }
              onMouseLeave={() =>
                window.setUkusaCursor &&
                window.setUkusaCursor({ active: false, label: "", color: "" })
              }
              className="group relative w-[84vw] sm:w-[540px] md:w-[640px] max-md:w-[86vw] h-[56vh] min-h-[370px] max-h-[520px] max-md:h-[380px] max-md:min-h-[340px] rounded-3xl max-md:rounded-2xl overflow-hidden bg-[#151517] border border-[#F4F3EF]/15 flex-shrink-0 max-md:snap-center transition-transform duration-500 hover:-translate-y-2"
            >
              <img
                src={zone.image}
                alt={zone.title}
                className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-[#0B0B0C]/30 to-transparent" />

              <div className="absolute top-6 left-6 right-6 max-md:top-4 max-md:left-4 max-md:right-4 flex flex-wrap justify-between items-center gap-2 font-mono text-xs max-md:text-[10px]">
                <span className="px-3 py-1 max-md:px-2.5 max-md:py-0.5 rounded-full bg-[#0B0B0C]/80 backdrop-blur-md text-[#D9B382] border border-[#D9B382]/30">
                  {zone.code}
                </span>
                <span className="px-3 py-1 max-md:px-2.5 max-md:py-0.5 rounded-full bg-[#0B0B0C]/75 text-[#F4F3EF]/70">
                  {zone.specs}
                </span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 max-md:bottom-4 max-md:left-4 max-md:right-4">
                <h3 className="font-display text-2xl md:text-3xl max-md:text-xl font-extrabold text-[#F4F3EF] mb-2 max-md:mb-1.5">
                  {zone.title}
                </h3>
                <p className="text-xs md:text-sm text-[#F4F3EF]/75 max-w-lg leading-relaxed">
                  {zone.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 md:px-14 max-md:px-5 flex flex-wrap justify-between items-center gap-2 font-mono text-[11px] max-md:text-[10px] tracking-[0.2em] max-md:tracking-[0.14em] text-[#F4F3EF]/45">
          <span>ACOUSTICS BY DEVIALET & MCINTOSH</span>
          <span>NATURAL DAYLIGHT COEFFICIENT // 0.84</span>
        </div>
      </section>

      {/* ==================================================================
          SECTION 6: SWISS-GRID FOOTER + TABLE RESERVATION + PHYSICS WORDMARK
         ================================================================== */}
      <footer className="relative bg-[#0B0B0C] text-[#F4F3EF] border-t border-[#F4F3EF]/15 pt-20 max-md:pt-14 pb-10 max-md:pb-8 px-6 md:px-14 max-md:px-5">
        <div className="max-w-7xl mx-auto">
          {/* Swiss Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 border border-[#F4F3EF]/15 rounded-3xl max-md:rounded-2xl overflow-hidden mb-16 max-md:mb-10">
            {/* Col 1: Sanctuary Location */}
            <div className="md:col-span-4 p-8 md:p-10 max-md:p-6 border-b md:border-b-0 md:border-r border-[#F4F3EF]/15 flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs tracking-[0.2em] text-[#C85A32] uppercase block mb-4 max-md:mb-2">
                  01 // FLAGSHIP SANCTUARY
                </span>
                <h3 className="font-display text-2xl max-md:text-xl font-bold mb-3 max-md:mb-2">
                  428 Nakagyo-ku Basalt Lane
                </h3>
                <p className="text-sm max-md:text-xs text-[#F4F3EF]/65 leading-relaxed">
                  Designed for slow mornings, vinyl listening sessions, and omakase coffee pairings.
                </p>
              </div>
              <div className="mt-8 max-md:mt-5 pt-4 border-t border-[#F4F3EF]/10 font-mono text-xs text-[#D9B382]">
                35.0116° N, 135.7681° E
              </div>
            </div>

            {/* Col 2: Hours & Cuppings */}
            <div className="md:col-span-4 p-8 md:p-10 max-md:p-6 border-b md:border-b-0 md:border-r border-[#F4F3EF]/15 flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs tracking-[0.2em] text-[#C85A32] uppercase block mb-4 max-md:mb-2">
                  02 // EXTRACTION HOURS
                </span>
                <ul className="space-y-3 max-md:space-y-2 font-mono text-xs">
                  <li className="flex justify-between">
                    <span className="text-[#F4F3EF]/60">MON – FRI</span>
                    <span>07:00 — 19:00</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-[#F4F3EF]/60">SAT – SUN</span>
                    <span>08:00 — 21:00</span>
                  </li>
                  <li className="flex justify-between text-[#D9B382]">
                    <span>PUBLIC CUPPING LAB</span>
                    <span>FRI 15:00</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 max-md:mt-5 pt-4 border-t border-[#F4F3EF]/10 font-mono text-xs text-[#F4F3EF]/50">
                WALK-INS WELCOME · RESERVATIONS ADVISED
              </div>
            </div>

            {/* Col 3: Reserve Table CTA */}
            <div className="md:col-span-4 p-8 md:p-10 max-md:p-6 bg-[#141416] flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs tracking-[0.2em] text-[#D9B382] uppercase block mb-4 max-md:mb-2">
                  03 // TABLE & OMAKASE BOOKING
                </span>
                <h3 className="font-display text-2xl max-md:text-xl font-bold mb-3 max-md:mb-2">
                  Experience the Pour-Over Bar.
                </h3>
                <p className="text-sm max-md:text-xs text-[#F4F3EF]/65 leading-relaxed mb-6 max-md:mb-5">
                  Reserve seats at our 6-seat Bizen ceramic bar or the sunlit moss courtyard.
                </p>
              </div>

              <Magnetic strength={0.2} cursorLabel="RESERVE" cursorColor="#C85A32" className="w-full">
                <button
                  onClick={() => {
                    if (window.ukusaSound) window.ukusaSound.playClick();
                    setReservationConfirmed(false);
                    setReserveOpen(true);
                  }}
                  className="w-full py-4 rounded-full bg-[#C85A32] hover:bg-[#F4F3EF] hover:text-[#0B0B0C] text-[#F4F3EF] font-mono text-xs font-bold tracking-[0.2em] uppercase transition-all"
                >
                  Reserve a Table →
                </button>
              </Magnetic>
            </div>
          </div>

          {/* Interactive Cursor-Repelling Physics Wordmark */}
          <div className="mb-8 max-md:mb-4">
            <p className="font-mono text-[10px] tracking-[0.25em] max-md:tracking-[0.14em] text-[#F4F3EF]/40 uppercase text-center mb-2">
              <span className="max-md:hidden">SWEEP CURSOR ACROSS WORDMARK TO DISTORT FIELD</span>
              <span className="md:hidden">TOUCH WORDMARK TO DISTORT FIELD</span>
            </p>
            <PhysicsWordmark />
          </div>

          {/* Bottom Legal / Credits */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 max-md:gap-2 pt-8 max-md:pt-5 border-t border-[#F4F3EF]/10 font-mono text-xs max-md:text-[10px] text-center sm:text-left text-[#F4F3EF]/45">
            <span>© 2026 UKUSA SPECIALTY COFFEE & ROASTERY. ALL RIGHTS RESERVED.</span>
            <span>CRAFTED WITH WEBGL · THREE.JS · LENIS · GSAP</span>
          </div>
        </div>
      </footer>

      {/* ==================================================================
          MODAL 1: DRINK / FOOD QUICK CUSTOMIZER
          (Centered modal on desktop; full-width bottom sheet on mobile)
         ================================================================== */}
      {customizingItem && (
        <div className="fixed inset-0 z-[3000] bg-black/80 backdrop-blur-md flex items-center max-md:items-end justify-center p-4 max-md:p-0">
          <div className="bg-[#121214] border border-[#F4F3EF]/20 text-[#F4F3EF] rounded-3xl max-md:rounded-b-none max-md:rounded-t-2xl max-w-lg max-md:max-w-full w-full overflow-hidden max-md:max-h-[85vh] max-md:overflow-y-auto shadow-2xl">
            {/* Mobile Bottom-Sheet Grab Pill */}
            <div className="md:hidden w-full flex justify-center pt-2.5 pb-1 bg-[#121214]">
              <span className="w-10 h-1 rounded-full bg-[#F4F3EF]/25" />
            </div>
            {/* Top Image Banner */}
            <div className="relative h-52 max-md:h-44 w-full">
              <img
                src={customizingItem.image}
                alt={customizingItem.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-black/30 to-transparent" />
              <button
                onClick={() => setCustomizingItem(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#0B0B0C]/80 text-[#F4F3EF] hover:bg-[#C85A32] font-mono text-sm flex items-center justify-center"
              >
                ✕
              </button>
              <div className="absolute bottom-4 left-6 right-6 max-md:left-5 max-md:right-5">
                <span className="font-mono text-[10px] tracking-[0.2em] text-[#D9B382] uppercase">
                  {customizingItem.code} · {customizingItem.origin}
                </span>
                <h3 className="font-display text-2xl max-md:text-xl font-extrabold">{customizingItem.name}</h3>
              </div>
            </div>

            {/* Customizer Options Body */}
            <div className="p-6 max-md:p-5 space-y-6 max-md:space-y-5">
              {customizingItem.isDrink ? (
                <>
                  {/* Temperature Selection */}
                  {customizingItem.allowTemp && (
                    <div>
                      <label className="block font-mono text-[11px] tracking-[0.2em] text-[#F4F3EF]/60 uppercase mb-2.5">
                        01 // TEMPERATURE
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {["Hot", "Iced"].map((t) => (
                          <button
                            key={t}
                            onClick={() => setCustomOptions((p) => ({ ...p, temp: t }))}
                            className={`py-2.5 max-md:py-3 rounded-xl font-mono text-xs border transition-all ${
                              customOptions.temp === t
                                ? "border-[#C85A32] bg-[#C85A32]/20 text-[#F4F3EF] font-bold"
                                : "border-[#F4F3EF]/15 text-[#F4F3EF]/60"
                            }`}
                          >
                            {t.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Milk Choice */}
                  <div>
                    <label className="block font-mono text-[11px] tracking-[0.2em] text-[#F4F3EF]/60 uppercase mb-2.5">
                      02 // MILK & TEXTURE
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { label: "Barista Oat (+₹60)", cost: 60 },
                        { label: "Hokkaido Whole (+₹0)", cost: 0 },
                        { label: "Raw Macadamia (+₹70)", cost: 70 },
                        { label: "Black / Pure (+₹0)", cost: 0 }
                      ].map((m) => (
                        <button
                          key={m.label}
                          onClick={() =>
                            setCustomOptions((p) => ({ ...p, milk: m.label, milkCost: m.cost }))
                          }
                          className={`py-2.5 max-md:py-3 px-3 rounded-xl font-mono text-[11px] border text-left transition-all ${
                            customOptions.milk === m.label
                              ? "border-[#C85A32] bg-[#C85A32]/20 text-[#F4F3EF] font-bold"
                              : "border-[#F4F3EF]/15 text-[#F4F3EF]/60"
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Extra Shot & Sweetness */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-[#0B0B0C] border border-[#F4F3EF]/10">
                    <div>
                      <span className="font-mono text-xs font-bold block">
                        + EXTRA SINGLE-ORIGIN RISTRETTO SHOT
                      </span>
                      <span className="font-mono text-[11px] text-[#F4F3EF]/50">
                        Sidama 9-Bar Pull (+₹50)
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={customOptions.extraShot}
                      onChange={(e) =>
                        setCustomOptions((p) => ({ ...p, extraShot: e.target.checked }))
                      }
                      className="w-5 h-5 accent-[#C85A32] cursor-pointer"
                    />
                  </div>
                </>
              ) : (
                /* Pastry / Bite Service Options */
                <div>
                  <label className="block font-mono text-[11px] tracking-[0.2em] text-[#F4F3EF]/60 uppercase mb-2.5">
                    OVEN & PLATING PREPARATION
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Warmed in Deck Oven", val: true },
                      { label: "Ambient Room Temp", val: false }
                    ].map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => setCustomOptions((p) => ({ ...p, warmed: opt.val }))}
                        className={`py-3 px-4 rounded-xl font-mono text-xs border transition-all ${
                          customOptions.warmed === opt.val
                            ? "border-[#C85A32] bg-[#C85A32]/20 text-[#F4F3EF] font-bold"
                            : "border-[#F4F3EF]/15 text-[#F4F3EF]/60"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Button with Live Price */}
              <button
                onClick={handleAddCustomizedToCart}
                className="w-full py-4 rounded-full bg-[#C85A32] hover:bg-[#F4F3EF] hover:text-[#0B0B0C] text-[#F4F3EF] font-mono text-xs font-bold tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-3"
              >
                <span>Add to Order Bag</span>
                <span>·</span>
                <span>{formatINR(liveCustomPrice)}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================
          MODAL 2: SLIDE-OUT LIVE ORDER BAG (CART DRAWER ON DESKTOP,
          BOTTOM SHEET ON MOBILE)
         ================================================================== */}
      {cartOpen && (
        <div className="fixed inset-0 z-[3500] bg-black/75 backdrop-blur-sm flex justify-end max-md:items-end">
          <div className="w-full max-w-md max-md:max-w-full bg-[#0B0B0C] border-l max-md:border-l-0 max-md:border-t border-[#F4F3EF]/15 h-full max-md:h-auto max-md:max-h-[85vh] max-md:rounded-t-2xl flex flex-col justify-between p-6 md:p-8 max-md:p-5 text-[#F4F3EF] shadow-2xl">
            {/* Mobile Bottom-Sheet Grab Pill */}
            <div className="md:hidden w-full flex justify-center pb-3">
              <span className="w-10 h-1 rounded-full bg-[#F4F3EF]/25" />
            </div>
            {/* Drawer Header */}
            <div className="flex justify-between items-center pb-6 max-md:pb-4 border-b border-[#F4F3EF]/15">
              <div>
                <span className="font-mono text-[10px] tracking-[0.22em] text-[#C85A32] uppercase block">
                  LIVE EXTRACTION QUEUE
                </span>
                <h3 className="font-display text-2xl max-md:text-xl font-extrabold">
                  YOUR ORDER BAG ({cartCount})
                </h3>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="w-10 h-10 rounded-full border border-[#F4F3EF]/20 hover:bg-[#F4F3EF] hover:text-[#0B0B0C] font-mono text-sm flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto py-6 max-md:py-4 space-y-5 max-md:space-y-3.5">
              {orderCheckedOut ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 border border-[#D9B382]/30 rounded-3xl bg-[#141416]">
                  <div className="w-14 h-14 rounded-full bg-[#C85A32] text-[#F4F3EF] flex items-center justify-center font-mono text-2xl mb-4">
                    ✓
                  </div>
                  <span className="font-mono text-xs tracking-[0.2em] text-[#D9B382] uppercase mb-2">
                    TICKET #UK-204 DISPATCHED
                  </span>
                  <h4 className="font-display text-2xl font-bold mb-3">
                    Barista Extraction Initiated.
                  </h4>
                  <p className="text-xs text-[#F4F3EF]/70 leading-relaxed mb-6">
                    Your order is being prepared at the Basalt Espresso Bar. Estimated readiness: 4 minutes.
                  </p>
                  <button
                    onClick={() => {
                      setOrderCheckedOut(false);
                      setCartOpen(false);
                    }}
                    className="px-6 py-3 rounded-full border border-[#F4F3EF]/25 font-mono text-xs uppercase tracking-[0.18em]"
                  >
                    Return to Sanctuary
                  </button>
                </div>
              ) : cart.length === 0 ? (
                <div className="h-full max-md:py-10 flex flex-col items-center justify-center text-center text-[#F4F3EF]/50 font-mono text-xs">
                  <p className="mb-4">YOUR ORDER BAG IS EMPTY.</p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="px-5 py-2.5 rounded-full border border-[#F4F3EF]/20 text-[#F4F3EF]"
                  >
                    Explore Menu
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.cartId}
                    className="flex gap-4 p-4 max-md:p-3.5 rounded-2xl bg-[#141417] border border-[#F4F3EF]/10"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 max-md:w-16 max-md:h-16 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-display font-bold text-base max-md:text-sm leading-snug">
                            {item.name}
                          </h4>
                          <span className="font-mono text-sm font-bold text-[#D9B382]">
                            {formatINR(item.price * item.qty)}
                          </span>
                        </div>
                        <p className="font-mono text-[11px] max-md:text-[10px] text-[#F4F3EF]/55 mt-1">
                          {item.details}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-3 bg-[#0B0B0C] px-3 py-1 rounded-full border border-[#F4F3EF]/15 font-mono text-xs">
                          <button
                            onClick={() => updateCartQty(item.cartId, -1)}
                            className="hover:text-[#C85A32] max-md:px-1"
                          >
                            −
                          </button>
                          <span>{item.qty}</span>
                          <button
                            onClick={() => updateCartQty(item.cartId, 1)}
                            className="hover:text-[#C85A32] max-md:px-1"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => updateCartQty(item.cartId, -item.qty)}
                          className="font-mono text-[10px] tracking-[0.15em] text-[#F4F3EF]/40 hover:text-[#C85A32] uppercase"
                        >
                          REMOVE
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer Subtotal & Checkout */}
            {!orderCheckedOut && cart.length > 0 && (
              <div className="pt-6 max-md:pt-4 border-t border-[#F4F3EF]/15 space-y-4 max-md:space-y-3">
                <div className="flex justify-between items-center font-mono text-xs text-[#F4F3EF]/60">
                  <span>HOSPITALITY & SERVICE</span>
                  <span>INCLUDED</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="font-mono text-xs tracking-[0.2em] uppercase">
                    LIVE SUBTOTAL
                  </span>
                  <span className="font-mono text-3xl max-md:text-2xl font-extrabold text-[#F4F3EF]">
                    {formatINR(cartSubtotal)}
                  </span>
                </div>
                <button
                  onClick={() => {
                    if (window.ukusaSound) window.ukusaSound.playConfirm();
                    setOrderCheckedOut(true);
                    setCart([]);
                  }}
                  className="w-full py-4 rounded-full bg-[#C85A32] hover:bg-[#F4F3EF] hover:text-[#0B0B0C] text-[#F4F3EF] font-mono text-xs font-bold tracking-[0.2em] uppercase transition-all"
                >
                  Send to Espresso Bar →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================================
          MODAL 3: INTERACTIVE TABLE RESERVATION MODAL
          (Centered modal on desktop; full-width bottom sheet on mobile)
         ================================================================== */}
      {reserveOpen && (
        <div className="fixed inset-0 z-[3500] bg-black/80 backdrop-blur-md flex items-center max-md:items-end justify-center p-4 max-md:p-0">
          <div className="bg-[#121215] border border-[#F4F3EF]/20 text-[#F4F3EF] rounded-3xl max-md:rounded-b-none max-md:rounded-t-2xl max-w-lg max-md:max-w-full w-full p-6 md:p-8 max-md:p-5 max-md:max-h-[85vh] max-md:overflow-y-auto shadow-2xl">
            {/* Mobile Bottom-Sheet Grab Pill */}
            <div className="md:hidden w-full flex justify-center pb-3">
              <span className="w-10 h-1 rounded-full bg-[#F4F3EF]/25" />
            </div>
            <div className="flex justify-between items-start mb-6 max-md:mb-4">
              <div>
                <span className="font-mono text-[10px] tracking-[0.22em] text-[#C85A32] uppercase block">
                  SANCTUARY SEATING
                </span>
                <h3 className="font-display text-2xl md:text-3xl max-md:text-xl font-extrabold">
                  RESERVE A TABLE
                </h3>
              </div>
              <button
                onClick={() => setReserveOpen(false)}
                className="w-10 h-10 rounded-full border border-[#F4F3EF]/20 hover:bg-[#C85A32] font-mono text-sm flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {reservationConfirmed ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#C85A32] text-[#F4F3EF] mx-auto flex items-center justify-center font-mono text-2xl">
                  ✓
                </div>
                <p className="font-mono text-xs tracking-[0.2em] text-[#D9B382] uppercase">
                  RESERVATION CONFIRMED // REF #UK-884
                </p>
                <h4 className="font-display text-2xl font-bold">
                  We await your arrival{reservation.name ? `, ${reservation.name}` : ""}.
                </h4>
                <p className="font-mono text-xs text-[#F4F3EF]/70">
                  {reservation.date} AT {reservation.time} · {reservation.guests} GUESTS ·{" "}
                  {reservation.zone.toUpperCase()}
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setReserveOpen(false)}
                    className="px-8 py-3.5 rounded-full bg-[#F4F3EF] text-[#0B0B0C] font-mono text-xs font-bold tracking-[0.18em] uppercase"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (window.ukusaSound) window.ukusaSound.playConfirm();
                  setReservationConfirmed(true);
                }}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] tracking-[0.2em] text-[#F4F3EF]/60 uppercase mb-2">
                      DATE
                    </label>
                    <input
                      type="date"
                      value={reservation.date}
                      onChange={(e) =>
                        setReservation((p) => ({ ...p, date: e.target.value }))
                      }
                      className="w-full px-4 py-3 rounded-xl bg-[#0B0B0C] border border-[#F4F3EF]/20 font-mono text-xs text-[#F4F3EF]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] tracking-[0.2em] text-[#F4F3EF]/60 uppercase mb-2">
                      PARTY SIZE
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 4, 6].map((n) => (
                        <button
                          type="button"
                          key={n}
                          onClick={() => setReservation((p) => ({ ...p, guests: n }))}
                          className={`py-3 rounded-xl font-mono text-xs border ${
                            reservation.guests === n
                              ? "border-[#C85A32] bg-[#C85A32] text-[#F4F3EF] font-bold"
                              : "border-[#F4F3EF]/15 text-[#F4F3EF]/65"
                          }`}
                        >
                          {n}P
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Time Slot Pills */}
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.2em] text-[#F4F3EF]/60 uppercase mb-2">
                    TIME SLOT
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      "08:30 AM",
                      "10:30 AM",
                      "12:30 PM",
                      "02:30 PM",
                      "04:30 PM",
                      "06:30 PM"
                    ].map((slot) => (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setReservation((p) => ({ ...p, time: slot }))}
                        className={`py-2.5 rounded-xl font-mono text-xs border transition-all ${
                          reservation.time === slot
                            ? "border-[#C85A32] bg-[#C85A32]/20 text-[#F4F3EF] font-bold"
                            : "border-[#F4F3EF]/15 text-[#F4F3EF]/60"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Architectural Zone */}
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.2em] text-[#F4F3EF]/60 uppercase mb-2">
                    ARCHITECTURAL ZONE
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      "Espresso Basalt Bar",
                      "Pour-Over Alcove",
                      "Sunlit Moss Courtyard"
                    ].map((z) => (
                      <button
                        type="button"
                        key={z}
                        onClick={() => setReservation((p) => ({ ...p, zone: z }))}
                        className={`p-3 rounded-xl font-mono text-[11px] border text-left transition-all ${
                          reservation.zone === z
                            ? "border-[#D9B382] bg-[#D9B382]/15 text-[#F4F3EF] font-bold"
                            : "border-[#F4F3EF]/15 text-[#F4F3EF]/60"
                        }`}
                      >
                        {z}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Guest Name */}
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.2em] text-[#F4F3EF]/60 uppercase mb-2">
                    GUEST NAME
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={reservation.name}
                    onChange={(e) =>
                      setReservation((p) => ({ ...p, name: e.target.value }))
                    }
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0B0C] border border-[#F4F3EF]/20 font-mono text-xs text-[#F4F3EF]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-[#C85A32] hover:bg-[#F4F3EF] hover:text-[#0B0B0C] text-[#F4F3EF] font-mono text-xs font-bold tracking-[0.2em] uppercase transition-all"
                >
                  Confirm Sanctuary Booking →
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<UkusaApp />);
