// ───────────────────────────────────────────────────────────────
// kalori — daily ritual
// ───────────────────────────────────────────────────────────────

const PALETTES = {
  mono: {
    name: "Mono",
    vars: {
      "--bg": "oklch(0.975 0 0)",
      "--surface": "oklch(1 0 0)",
      "--surface-2": "oklch(0.955 0 0)",
      "--ink": "oklch(0.16 0 0)",
      "--ink-2": "oklch(0.35 0 0)",
      "--muted": "oklch(0.55 0 0)",
      "--line": "oklch(0.86 0 0)",
      "--line-soft": "oklch(0.92 0 0)",
      "--clay": "oklch(0.18 0 0)",
      "--clay-soft": "oklch(0.88 0 0)",
      "--sage": "oklch(0.55 0 0)",
      "--sage-soft": "oklch(0.92 0 0)",
      "--amber": "oklch(0.40 0 0)",
      "--plum": "oklch(0.22 0 0)",
    },
  },
  ink: {
    name: "Ink",
    vars: {
      "--bg": "oklch(0.10 0 0)",
      "--surface": "oklch(0.14 0 0)",
      "--surface-2": "oklch(0.17 0 0)",
      "--ink": "oklch(0.98 0 0)",
      "--ink-2": "oklch(0.85 0 0)",
      "--muted": "oklch(0.55 0 0)",
      "--line": "oklch(0.25 0 0)",
      "--line-soft": "oklch(0.20 0 0)",
      "--clay": "oklch(0.98 0 0)",
      "--clay-soft": "oklch(0.25 0 0)",
      "--sage": "oklch(0.65 0 0)",
      "--sage-soft": "oklch(0.25 0 0)",
      "--amber": "oklch(0.50 0 0)",
      "--plum": "oklch(0.80 0 0)",
    },
  },
  paper: {
    name: "Paper",
    vars: {
      "--bg": "oklch(0.99 0 0)",
      "--surface": "oklch(1 0 0)",
      "--surface-2": "oklch(0.96 0 0)",
      "--ink": "oklch(0.10 0 0)",
      "--ink-2": "oklch(0.30 0 0)",
      "--muted": "oklch(0.50 0 0)",
      "--line": "oklch(0.84 0 0)",
      "--line-soft": "oklch(0.92 0 0)",
      "--clay": "oklch(0.10 0 0)",
      "--clay-soft": "oklch(0.90 0 0)",
      "--sage": "oklch(0.45 0 0)",
      "--sage-soft": "oklch(0.92 0 0)",
      "--amber": "oklch(0.30 0 0)",
      "--plum": "oklch(0.15 0 0)",
    },
  },
};

// ───────────────────────────────────────────────────────────────
// Sample data for prototype demo state
// ───────────────────────────────────────────────────────────────
const SAMPLE_FOODS = [
  { id: "a", meal: "pagi",  name: "Oats + pisang + susu",     serving: "1 mangkuk",     kcal: 320, p: 12, c: 56, f: 7 },
  { id: "b", meal: "pagi",  name: "Kopi hitam",                serving: "1 cangkir",     kcal: 5,   p: 0,  c: 0,  f: 0 },
  { id: "c", meal: "siang", name: "Nasi + ayam panggang",      serving: "1 porsi",       kcal: 480, p: 38, c: 52, f: 12 },
  { id: "d", meal: "siang", name: "Sayur bayam rebus",         serving: "1 mangkuk",     kcal: 25,  p: 3,  c: 4,  f: 0 },
  { id: "e", meal: "snack", name: "Alpukat + roti gandum",     serving: "1 porsi",       kcal: 255, p: 6,  c: 28, f: 13 },
];

const SAMPLE_WEEK = [
  { label: "Sen", kcal: 1880 },
  { label: "Sel", kcal: 2120 },
  { label: "Rab", kcal: 1640 },
  { label: "Kam", kcal: 1950 },
  { label: "Jum", kcal: 2240 },
  { label: "Sab", kcal: 1780 },
  { label: "Min", kcal: 0,    today: true }, // populated from today's foods
];

// Generate ~25 days of demo data for the current month
function buildSampleMonth() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const tDay = today.getDate();
  const data = {};
  // seeded pseudo-random so chart is stable across renders
  function rng(seed) { return ((seed * 9301 + 49297) % 233280) / 233280; }
  for (let d = 1; d <= tDay; d++) {
    if (d === tDay) continue; // today comes from live foods
    // ~85% of days have data
    if (rng(d * 11) > 0.18) {
      // around target 1900-2100 with some scatter
      const base = 1900 + Math.round((rng(d * 7) - 0.5) * 800);
      data[d] = Math.max(900, base);
    }
  }
  return { year, month, data };
}
const SAMPLE_MONTH = buildSampleMonth();

function greeting() {
  const h = new Date().getHours();
  if (h < 11) return "Selamat pagi";
  if (h < 15) return "Selamat siang";
  if (h < 18) return "Selamat sore";
  return "Selamat malam";
}

function todayLabel() {
  return new Date().toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long",
  });
}

// ───────────────────────────────────────────────────────────────

function demoUser() {
  return {
    name: "Marcos",
    email: "marcos@kalori.app",
    bio: "Konsistensi kecil setiap hari.",
    age: 28,
    gender: "Laki-laki",
    heightCm: 175,
    weightKg: 72,
    targetWeightKg: 68,
    activity: "moderate",
    goal: "fatloss",
    startDate: new Date().toISOString().slice(0, 10),
  };
}

function App() {
  // Persisted state via tweaks
  const tweakDefaults = /*EDITMODE-BEGIN*/{
    "palette": "mono",
    "density": "comfortable"
  }/*EDITMODE-END*/;
  const [t, setT] = useTweaks(tweakDefaults);

  // App state
  const [user, setUser] = React.useState(() => {
    // 1) Host shortcut for the "Dashboard only" bundle
    if (typeof window !== "undefined" && window.__SKIP_LOGIN__) return demoUser();
    // 2) Restore from previous session if any
    try {
      const saved = localStorage.getItem("kalori.user");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    // 3) Otherwise show login
    return null;
  });
  const [view, setView] = React.useState("dashboard");
  const [foods, setFoods] = React.useState(SAMPLE_FOODS);
  const [target, setTarget] = React.useState({ calories: 2000, protein: 120, carbs: 200, fat: 65 });
  const [monthData, setMonthData] = React.useState(SAMPLE_MONTH.data);
  const [targetOpen, setTargetOpen] = React.useState(false);
  const [aiOpen, setAiOpen] = React.useState(false);
  const [addMeal, setAddMeal] = React.useState(null);

  // Apply palette
  React.useEffect(() => {
    const p = PALETTES[t.palette] || PALETTES.mono;
    Object.entries(p.vars).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
  }, [t.palette]);

  // Apply density
  React.useEffect(() => {
    document.documentElement.style.setProperty("--pad", t.density === "compact" ? "20px" : "28px");
    document.documentElement.style.setProperty("--gap", t.density === "compact" ? "14px" : "20px");
  }, [t.density]);

  // Derived totals
  const totals = foods.reduce((s, f) => ({
    kcal: s.kcal + f.kcal,
    p: s.p + f.p, c: s.c + f.c, f: s.f + f.f,
  }), { kcal: 0, p: 0, c: 0, f: 0 });

  const [savedAt, setSavedAt] = React.useState(0);
  const [savingStatus, setSavingStatus] = React.useState("idle"); // idle | editing | saving | saved
  const saveTimerRef = React.useRef(null);
  const settleTimerRef = React.useRef(null);

  function handleLogin(u) {
    setUser({
      name: u.name || "Marcos",
      email: u.email || "kamu@email.com",
      bio: "Konsistensi kecil setiap hari.",
      age: 28,
      gender: "Laki-laki",
      heightCm: 175,
      weightKg: 72,
      targetWeightKg: 68,
      activity: "moderate",
      goal: "fatloss",
      startDate: new Date().toISOString().slice(0, 10),
      ...u,
    });
  }

  function updateUser(patch) {
    setUser(prev => ({ ...prev, ...patch }));
    setSavingStatus("editing");
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      setSavingStatus("saving");
      settleTimerRef.current = setTimeout(() => {
        setSavedAt(Date.now());
        setSavingStatus("saved");
      }, 350);
    }, 500);
  }

  function confirmSave() {
    setSavedAt(Date.now());
    setSavingStatus("saved");
    try { localStorage.setItem("kalori.user", JSON.stringify(user)); } catch (e) {}
  }

  function logout() {
    try { localStorage.removeItem("kalori.user"); } catch (e) {}
    setUser(null);
  }

  function addFood(food) { setFoods(fs => [...fs, food]); }
  function removeFood(id) { setFoods(fs => fs.filter(f => f.id !== id)); }
  function resetDay() { if (confirm("Hapus semua catatan hari ini?")) setFoods([]); }

  const week = SAMPLE_WEEK.map(d => d.today ? { ...d, kcal: totals.kcal } : d);

  // ── Gate: show login screen until user signs in ───────────────────────────
  if (!user) {
    return (
      <React.Fragment>
        <Login onLogin={(u) => {
          handleLogin(u);
          try { localStorage.setItem("kalori.user", JSON.stringify({ ...demoUser(), ...u })); } catch (e) {}
        }} />
        <TweaksPanel title="Tweaks">
          <TweakSection label="Tampilan" />
          <TweakRadio label="Palette" value={t.palette}
            options={[
              { value: "mono",  label: "Mono" },
              { value: "ink",   label: "Ink" },
              { value: "paper", label: "Paper" },
            ]}
            onChange={(v) => setT("palette", v)} />
        </TweaksPanel>
      </React.Fragment>
    );
  }

  const firstName = user.name ? user.name.split(/\s+/)[0] : "Marcos";

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar view={view} onView={setView} user={user} onLogout={logout} onProfile={() => setView("settings")} />

      <main style={{ flex: 1, minWidth: 0, padding: "32px 44px 80px", maxWidth: 1280 }}>
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <div className="display" style={{
              fontSize: 11, color: "var(--clay)", letterSpacing: "0.22em",
            }}>
              {todayLabel()}
            </div>
            <h1 className="headline" style={{
              margin: "8px 0 0", fontSize: 44, lineHeight: 1.0,
            }}>
              {greeting()}, <span className="script" style={{ fontSize: 36, letterSpacing: 0, color: "var(--ink-2)", textTransform: "none" }}>{firstName}</span>
            </h1>
            <div style={{ fontSize: 14, color: "var(--ink-2)", marginTop: 10, maxWidth: 460 }}>
              {totals.kcal === 0
                ? "Belum ada catatan hari ini. Mulai pelan, sesuai ritmemu sendiri."
                : `Kamu sudah mencatat ${Math.round(totals.kcal)} kcal. Konsisten itu lebih penting dari sempurna.`}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Btn kind="ghost" icon={<I.Target size={15} />} onClick={() => setTargetOpen(true)}>
              Atur target
            </Btn>
            <Btn kind="primary" icon={<I.Plus size={15} />} onClick={() => setAddMeal("siang")}>
              Catat makanan
            </Btn>
          </div>
        </div>

        {view === "dashboard" && (
          <DashboardView
            foods={foods} target={target} totals={totals}
            week={week}
            onAdd={(m) => setAddMeal(m)}
            onDelete={removeFood}
            onReset={resetDay}
            onTarget={() => setTargetOpen(true)}
          />
        )}
        {view === "weekly"   && <WeeklyView   foods={foods} target={target} totals={totals} week={week} />}
        {view === "report"   && <ReportView   foods={foods} target={target} totals={totals} monthData={monthData} />}
        {view === "target"   && <TargetView   target={target} onEdit={() => setTargetOpen(true)} totals={totals} />}
        {view === "settings" && <SettingsView user={user} onUpdate={updateUser} onLogout={logout} target={target} onSaveTarget={setTarget} savedAt={savedAt} savingStatus={savingStatus} onConfirmSave={confirmSave} />}
      </main>

      {/* Floating AI button */}
      <button onClick={() => setAiOpen(v => !v)} style={{
        position: "fixed", right: 24, bottom: 24, zIndex: 40,
        background: "var(--ink)", color: "var(--surface)",
        border: "1px solid var(--ink)",
        padding: "12px 18px 12px 14px", borderRadius: 999,
        boxShadow: "0 12px 30px -10px rgba(60, 30, 10, 0.3)",
        display: aiOpen ? "none" : "inline-flex", alignItems: "center", gap: 8,
        fontFamily: "inherit", fontSize: 13, fontWeight: 500,
      }}>
        <I.Sparkle size={15} /> Catat via chat
      </button>

      <AIDock open={aiOpen} onClose={() => setAiOpen(false)} onLog={addFood} />
      <TargetModal open={targetOpen} onClose={() => setTargetOpen(false)} target={target} onSave={setTarget} />
      <AddFoodModal open={!!addMeal} meal={addMeal} onClose={() => setAddMeal(null)} onAdd={addFood} />
      <SaveToast savedAt={savedAt} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Tampilan" />
        <TweakRadio label="Palette" value={t.palette}
          options={[
            { value: "mono",  label: "Mono" },
            { value: "ink",   label: "Ink" },
            { value: "paper", label: "Paper" },
          ]}
          onChange={(v) => setT("palette", v)} />
        <TweakRadio label="Density" value={t.density}
          options={[
            { value: "comfortable", label: "Nyaman" },
            { value: "compact",     label: "Padat" },
          ]}
          onChange={(v) => setT("density", v)} />
        <TweakSection label="Demo data" />
        <TweakButton label="Reset ke contoh" onClick={() => setFoods(SAMPLE_FOODS)} />
        <TweakButton label="Kosongkan hari"  onClick={() => setFoods([])} secondary />
      </TweaksPanel>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Dashboard view
// ───────────────────────────────────────────────────────────────

function DashboardView({ foods, target, totals, week, onAdd, onDelete, onReset, onTarget }) {
  const meals = ["pagi", "siang", "malam", "snack"];
  const foodsByMeal = Object.fromEntries(meals.map(m => [m, foods.filter(f => f.meal === m)]));

  const remaining = target.calories - totals.kcal;
  const pct = Math.round((totals.kcal / target.calories) * 100);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "var(--gap)" }}>
      {/* LEFT — Today's ring + macros */}
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "var(--pad)", borderBottom: "1px solid var(--line-soft)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <Eyebrow>Hari ini</Eyebrow>
            <button onClick={onReset} style={{
              background: "transparent", border: "none", color: "var(--muted)",
              fontSize: 12, padding: 0, fontFamily: "inherit",
            }}>Reset</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "center", marginTop: 14 }}>
            <CalorieRing consumed={totals.kcal} target={target.calories} />
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <MacroBar label="Protein"     value={totals.p} target={target.protein} color="var(--c-protein)" icon={<I.Drop size={14} />} />
              <MacroBar label="Karbohidrat" value={totals.c} target={target.carbs}   color="var(--c-carb)"    icon={<I.Wheat size={14} />} />
              <MacroBar label="Lemak"       value={totals.f} target={target.fat}     color="var(--c-fat)"     icon={<I.Avocado size={14} />} />

              <div style={{
                marginTop: 6, padding: "10px 14px",
                background: "var(--surface-2)", borderRadius: 12,
                border: "1px solid var(--line-soft)",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div>
                  <div className="mono" style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    {remaining >= 0 ? "Sisa hari ini" : "Melampaui target"}
                  </div>
                  <div className="display-num" style={{ fontSize: 26, lineHeight: 1, marginTop: 2 }}>
                    {Math.abs(Math.round(remaining))} <span style={{ fontSize: 12, color: "var(--muted)" }}>kcal</span>
                  </div>
                </div>
                <Pill tone={remaining < 0 ? "clay" : "sage"}>
                  {pct}% tercapai
                </Pill>
              </div>
            </div>
          </div>
        </div>

        {/* Meal breakdown */}
        <div style={{ padding: "var(--pad)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <Eyebrow>Rincian waktu makan</Eyebrow>
            <span className="mono" style={{ fontSize: 10.5, color: "var(--muted)" }}>
              {foods.length} item dicatat
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {meals.map(m => (
              <MealRow key={m} meal={m} items={foodsByMeal[m]} onAdd={onAdd} onDelete={onDelete} />
            ))}
          </div>
        </div>
      </Card>

      {/* RIGHT column */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap)" }}>
        {/* Weekly chart */}
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
            <div>
              <Eyebrow>7 hari terakhir</Eyebrow>
              <div className="headline" style={{ fontSize: 24, marginTop: 6, lineHeight: 1.05 }}>
                Ritme mingguanmu
              </div>
            </div>
            <Pill tone="ghost">rata-rata {Math.round(week.reduce((s, d) => s + d.kcal, 0) / week.filter(d => d.kcal > 0).length || 0)} kcal</Pill>
          </div>
          <WeeklyChart data={week} target={target.calories} />
          <div style={{
            marginTop: 16, paddingTop: 14, borderTop: "1px dashed var(--line)",
            display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "var(--muted)",
            gap: 10, flexWrap: "wrap",
          }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: "var(--c-today)" }}></span> Hari ini
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: "var(--c-target)" }}></span> Pada target
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: "var(--c-under)" }}></span> Di bawah
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: "var(--c-over)" }}></span> Melampaui
            </span>
          </div>
        </Card>

        {/* Insight card */}
        <Card style={{ background: "var(--surface-2)" }}>
          <Eyebrow>Catatan untuk hari ini</Eyebrow>
          <div className="script" style={{
            fontSize: 18, lineHeight: 1.5, marginTop: 8, color: "var(--ink)",
          }}>
            {totals.kcal === 0
              ? "Pagi yang tenang. Mulai dari sarapan kecil, atau lewatkan jika tubuh belum siap."
              : totals.p < target.protein * 0.4
                ? `Protein masih ${Math.round((totals.p / target.protein) * 100)}% dari target. Pertimbangkan telur, tempe, atau ayam di makan berikutnya.`
                : totals.kcal > target.calories * 0.9 && totals.kcal < target.calories * 1.05
                  ? "Kamu hampir tepat di target. Tidak perlu kaku — tubuhmu tahu kapan cukup."
                  : "Ritmemu sedang baik. Tidak ada keharusan untuk mencatat tiap gigitan."}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <Pill tone="default">
              <I.Sparkle size={11} /> berdasarkan harimu
            </Pill>
          </div>
        </Card>

        {/* Quick streak */}
        <Card padded={false}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--line-soft)" }}>
            <Eyebrow>Konsistensi</Eyebrow>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", textAlign: "center" }}>
            {[
              { v: "12", l: "hari berturut" },
              { v: "5/7", l: "minggu ini" },
              { v: "1.940", l: "rata-rata kcal" },
            ].map((s, i) => (
              <div key={i} style={{
                padding: "20px 14px",
                borderRight: i < 2 ? "1px solid var(--line-soft)" : "none",
              }}>
                <div className="display-num" style={{ fontSize: 30, lineHeight: 1 }}>{s.v}</div>
                <div className="mono" style={{ fontSize: 10, color: "var(--muted)", marginTop: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Other views (lighter)
// ───────────────────────────────────────────────────────────────

function WeeklyView({ target, totals }) {
  const [period, setPeriod] = React.useState({ preset: "current", offset: 0, customRange: null });

  // Generate week data based on offset (sample data — varies by period)
  const week = React.useMemo(() => buildWeekData(period.offset, totals.kcal), [period.offset, totals.kcal]);
  const avg = Math.round(week.reduce((s, d) => s + d.kcal, 0) / Math.max(1, week.filter(d => d.kcal > 0).length));
  const onTarget = week.filter(d => d.kcal >= target.calories * 0.85 && d.kcal <= target.calories * 1.10).length;
  const tracked = week.filter(d => d.kcal > 0).length;
  const delta = avg - target.calories;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--gap)" }}>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 18, flexWrap: "wrap", marginBottom: 22 }}>
          <div>
            <Eyebrow>Ringkasan mingguan</Eyebrow>
            <div className="headline" style={{ fontSize: 26, marginTop: 6, lineHeight: 1 }}>
              {period.preset === "current" ? "Minggu ini"
                : period.preset === "previous" ? "Minggu lalu"
                : period.preset === "rolling7"  ? "7 hari terakhir"
                : "Periode kustom"}
            </div>
          </div>
          <PeriodFilter mode="week"
            preset={period.preset} offset={period.offset} customRange={period.customRange}
            onChange={setPeriod} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, marginTop: 12 }}>
          {[
            { l: "Rata-rata kalori", v: avg.toLocaleString("id-ID"), u: "kcal" },
            { l: "Hari pada target", v: `${onTarget} / ${week.length}`, u: "hari" },
            { l: "Selisih vs target", v: (delta >= 0 ? "+" : "−") + Math.abs(delta), u: "kcal" },
            { l: "Hari tercatat",  v: `${tracked} / ${week.length}`, u: "" },
          ].map((s, i) => (
            <div key={i}>
              <Eyebrow>{s.l}</Eyebrow>
              <div className="display-num" style={{ fontSize: 36, lineHeight: 1, marginTop: 8 }}>
                {s.v} <span style={{ fontSize: 13, color: "var(--muted)" }}>{s.u}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 28 }}>
          <WeeklyChart data={week} target={target.calories} />
        </div>
      </Card>
    </div>
  );
}

// Generate keyed data {dayOfMonth: kcal} for a date range
function buildPeriodData(start, end, offset, todayKcal) {
  const rng = (n) => ((n * 9301 + 49297) % 233280) / 233280;
  const data = {};
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const days = Math.floor((end - start) / 86400000) + 1;
  for (let i = 0; i < days; i++) {
    const d = new Date(start); d.setDate(start.getDate() + i);
    const dayNum = d.getDate();
    const isToday = d.getTime() === today.getTime();
    const isFuture = d.getTime() > today.getTime();
    if (isFuture) continue;
    if (isToday) { if (todayKcal > 0) data[dayNum] = todayKcal; continue; }
    const seed = (offset + 100) * 1000 + dayNum * 17 + d.getMonth() * 7;
    if (rng(seed) > 0.15) {
      const base = 1900 + Math.round((rng(seed * 3) - 0.5) * 800);
      data[dayNum] = Math.max(900, base);
    }
  }
  return data;
}

function ReportView({ foods, target, totals, monthData }) {
  const [period, setPeriod] = React.useState({ preset: "current", offset: 0, customRange: null });

  // Build period bounds based on preset/offset/custom
  const monthInfo = React.useMemo(() => {
    const today = new Date();
    let start, end, label;
    if (period.preset === "custom" && period.customRange) {
      start = new Date(period.customRange.start);
      end = new Date(period.customRange.end);
      label = `${start.toLocaleDateString("id-ID", { day: "numeric", month: "short" })} — ${end.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}`;
    } else if (period.preset === "rolling30") {
      end = new Date(today); end.setHours(0, 0, 0, 0); end.setDate(today.getDate() + period.offset * 30);
      start = new Date(end); start.setDate(end.getDate() - 29);
      label = "30 hari terakhir";
    } else if (period.preset === "previous") {
      const m = today.getMonth() - 1 + period.offset;
      start = new Date(today.getFullYear(), m, 1);
      end = new Date(today.getFullYear(), m + 1, 0);
      label = start.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
    } else {
      const m = today.getMonth() + period.offset;
      start = new Date(today.getFullYear(), m, 1);
      end = new Date(today.getFullYear(), m + 1, 0);
      label = start.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
    }
    return { start, end, label };
  }, [period]);

  const fullData = React.useMemo(() => buildPeriodData(monthInfo.start, monthInfo.end, period.offset, totals.kcal), [monthInfo, period.offset, totals.kcal]);
  const daysInPeriod = Math.floor((monthInfo.end - monthInfo.start) / 86400000) + 1;

  const days = Object.entries(fullData);
  const tracked = days.length;
  const avg = tracked ? Math.round(days.reduce((s, [, v]) => s + v, 0) / tracked) : 0;
  const onTarget = days.filter(([, v]) => v >= target.calories * 0.9 && v <= target.calories * 1.1).length;
  const onTargetPct = tracked ? Math.round((onTarget / tracked) * 100) : 0;
  const totalKcal = days.reduce((s, [, v]) => s + v, 0);

  // 4 weekly averages within the period
  const weeks = [0, 1, 2, 3].map(w => {
    const ws = w * 7 + 1, we = ws + 6;
    const inWeek = days.filter(([d]) => +d >= ws && +d <= we);
    const a = inWeek.length ? inWeek.reduce((s, [, v]) => s + v, 0) / inWeek.length : 0;
    return { label: `M${w + 1}`, avg: a };
  });

  // Streak — longest consecutive logged from latest day
  let curStreak = 0;
  const sortedDays = days.map(([d]) => +d).sort((a, b) => b - a);
  let prevDay = sortedDays[0];
  for (const d of sortedDays) {
    if (d === prevDay || d === prevDay - 1) { curStreak++; prevDay = d; }
    else break;
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--gap)" }}>
      {/* Stats row */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24, flexWrap: "wrap", gap: 18 }}>
          <div>
            <Eyebrow>Laporan periode</Eyebrow>
            <div className="headline" style={{ fontSize: 30, marginTop: 6, lineHeight: 1 }}>
              {monthInfo.label}
            </div>
          </div>
          <PeriodFilter mode="month"
            preset={period.preset} offset={period.offset} customRange={period.customRange}
            onChange={setPeriod} />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 18 }}>
          <Pill tone="default">
            {tracked} dari {daysInPeriod} hari tercatat
          </Pill>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, marginBottom: 24 }}>
          {[
            { l: "Rata-rata harian", v: avg.toLocaleString("id-ID"), u: "kcal" },
            { l: "Pada target",      v: `${onTargetPct}%`,            u: `${onTarget} dari ${tracked} hari` },
            { l: "Streak aktif",     v: curStreak,                    u: "hari berturut" },
            { l: "Total tercatat",   v: (totalKcal / 1000).toFixed(1) + "k", u: "kcal periode ini" },
          ].map((s, i) => (
            <div key={i} style={{
              padding: "0 22px",
              borderRight: i < 3 ? "1px solid var(--line-soft)" : "none",
            }}>
              <Eyebrow>{s.l}</Eyebrow>
              <div className="display-num" style={{ fontSize: 36, marginTop: 8, lineHeight: 1 }}>
                {s.v}
              </div>
              <div className="mono" style={{ fontSize: 10.5, color: "var(--muted)", marginTop: 6, letterSpacing: "0.08em" }}>
                {s.u}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Calendar heatmap + Macro */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "var(--gap)" }}>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
            <div>
              <Eyebrow>Konsistensi harian</Eyebrow>
              <div className="headline" style={{ fontSize: 22, marginTop: 6, lineHeight: 1 }}>
                Kalender {monthInfo.label}
              </div>
            </div>
          </div>
          <MonthlyHeatmap
            data={fullData}
            target={target.calories}
            year={monthInfo.start.getFullYear()}
            month={monthInfo.start.getMonth()}
          />
        </Card>

        <Card>
          <Eyebrow>Tren mingguan</Eyebrow>
          <div className="headline" style={{ fontSize: 22, marginTop: 6, lineHeight: 1, marginBottom: 22 }}>
            Rata-rata per minggu
          </div>
          <MonthTrend weeks={weeks} />

          <div style={{
            marginTop: 22, paddingTop: 18, borderTop: "1px solid var(--line-soft)",
          }}>
            <Eyebrow>Pola distribusi makro hari ini</Eyebrow>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 14 }}>
              {[
                { l: "Protein", v: totals.p, t: target.protein, c: "var(--c-protein)"  },
                { l: "Karbo",   v: totals.c, t: target.carbs,   c: "var(--c-carb)" },
                { l: "Lemak",   v: totals.f, t: target.fat,     c: "var(--c-fat)"  },
              ].map((m, i) => {
                const pct = m.t ? Math.round((m.v / m.t) * 100) : 0;
                return (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                      <span>{m.l}</span>
                      <span className="mono" style={{ color: "var(--muted)" }}>{pct}%</span>
                    </div>
                    <div style={{ height: 5, background: "var(--line-soft)", borderRadius: 999, overflow: "hidden" }}>
                      <div style={{ width: `${Math.min(100, pct)}%`, height: "100%", background: m.c }}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function TargetView({ target, totals, onEdit }) {
  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <Eyebrow>Target aktif</Eyebrow>
          <div className="display-num" style={{ fontSize: 32, marginTop: 6 }}>
            {target.calories} <span style={{ fontSize: 15, color: "var(--muted)" }}>kcal / hari</span>
          </div>
        </div>
        <Btn kind="ghost" icon={<I.Edit size={14} />} onClick={onEdit}>Ubah</Btn>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginTop: 22 }}>
        {[
          { l: "Protein", v: target.protein, c: "var(--c-protein)"  },
          { l: "Karbo",   v: target.carbs,   c: "var(--c-carb)" },
          { l: "Lemak",   v: target.fat,     c: "var(--c-fat)"  },
        ].map((m, i) => (
          <div key={i} style={{ padding: 18, background: "var(--surface-2)", borderRadius: 14, border: "1px solid var(--line-soft)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: m.c }}></span>
              <span style={{ fontSize: 12, color: "var(--ink-2)" }}>{m.l}</span>
            </div>
            <div className="display-num" style={{ fontSize: 34, marginTop: 8, lineHeight: 1 }}>
              {m.v}<span style={{ fontSize: 14, color: "var(--muted)" }}>g</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function SettingsView({ user, onUpdate, onLogout, target, onSaveTarget, savedAt, savingStatus, onConfirmSave }) {
  // TDEE: Mifflin-St Jeor
  const activityFactor = {
    sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9,
  };
  const bmrBase = user.gender === "Perempuan" ? -161 : 5;
  const bmr = Math.round(10 * user.weightKg + 6.25 * user.heightCm - 5 * user.age + bmrBase);
  const tdee = Math.round(bmr * (activityFactor[user.activity] || 1.55));
  const goalDelta = { fatloss: -400, maintain: 0, gain: 300 };
  const recommended = tdee + (goalDelta[user.goal] || 0);

  const initials = user.name.split(/\s+/).map(s => s[0]).join("").slice(0, 2).toUpperCase();
  const savedAgo = savedAt
    ? new Date(savedAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
    : null;

  // Save status pill content
  let statusPill;
  if (savingStatus === "editing") {
    statusPill = { dot: "var(--c-near)", text: "Mengetik…", muted: true };
  } else if (savingStatus === "saving") {
    statusPill = { dot: "var(--c-near)", text: "Menyimpan…", muted: true };
  } else if (savedAgo) {
    statusPill = { dot: "var(--c-target)", text: `Tersimpan · ${savedAgo}`, muted: false };
  } else {
    statusPill = { dot: "var(--line)", text: "Belum ada perubahan", muted: true };
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--gap)" }}>
      {/* Header card */}
      <Card padded={false} style={{ overflow: "hidden" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 22,
          padding: 24,
        }}>
          <div style={{
            width: 76, height: 76, borderRadius: "50%",
            background: "var(--surface-2)", color: "var(--ink)",
            border: "1px solid var(--line)",
            display: "grid", placeItems: "center",
            fontFamily: "Anton, sans-serif", fontSize: 32, letterSpacing: "0.02em",
            flexShrink: 0,
          }}>{initials}</div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <Eyebrow>Profil</Eyebrow>
            <div className="headline" style={{ fontSize: 26, marginTop: 4, lineHeight: 1 }}>
              {user.name || "Tanpa nama"}
            </div>
            <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 4, display: "flex", gap: 14, flexWrap: "wrap" }}>
              <span>{user.email}</span>
              <span>·</span>
              <span>sejak {new Date(user.startDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "8px 14px", borderRadius: 999,
              background: "var(--surface-2)", border: "1px solid var(--line-soft)",
              fontSize: 12, fontWeight: 500,
              color: statusPill.muted ? "var(--muted)" : "var(--ink-2)",
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: "50%", background: statusPill.dot,
                animation: savingStatus === "editing" || savingStatus === "saving" ? "pulse 1s infinite" : "none",
              }}></span>
              {statusPill.text}
            </span>
            <Btn kind="ghost" icon={<I.Arrow size={14} />} onClick={onLogout}>
              Keluar
            </Btn>
          </div>
        </div>
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }`}</style>
      </Card>

      {/* Editable forms */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--gap)" }}>
        {/* Identitas */}
        <Card>
          <Eyebrow>Identitas</Eyebrow>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 16 }}>
            <FieldInput label="Nama lengkap" value={user.name} onChange={v => onUpdate({ name: v })} />
            <FieldInput label="Email" value={user.email} onChange={v => onUpdate({ email: v })} type="email" />
            <FieldArea label="Bio singkat" value={user.bio || ""} onChange={v => onUpdate({ bio: v })} placeholder="Misal: Konsistensi kecil setiap hari." />
          </div>
        </Card>

        {/* Body metrics */}
        <Card>
          <Eyebrow>Data tubuh</Eyebrow>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 16 }}>
            <FieldInput label="Umur" suffix="th" type="number" value={user.age} onChange={v => onUpdate({ age: +v })} />
            <FieldSelect label="Gender" value={user.gender}
              options={["Laki-laki", "Perempuan", "Lainnya"]}
              onChange={v => onUpdate({ gender: v })} />
            <FieldInput label="Tinggi" suffix="cm" type="number" value={user.heightCm} onChange={v => onUpdate({ heightCm: +v })} />
            <FieldInput label="Berat saat ini" suffix="kg" type="number" value={user.weightKg} onChange={v => onUpdate({ weightKg: +v })} />
            <FieldInput label="Target berat" suffix="kg" type="number" value={user.targetWeightKg} onChange={v => onUpdate({ targetWeightKg: +v })} />
            <FieldSelect label="Aktivitas" value={user.activity}
              options={[
                { value: "sedentary",   label: "Jarang gerak" },
                { value: "light",       label: "Ringan" },
                { value: "moderate",    label: "Sedang" },
                { value: "active",      label: "Aktif" },
                { value: "very_active", label: "Sangat aktif" },
              ]}
              onChange={v => onUpdate({ activity: v })} />
          </div>

          <div style={{ marginTop: 18 }}>
            <Eyebrow>Tujuan</Eyebrow>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 10 }}>
              {[
                { v: "fatloss",  l: "Fat loss",  s: "−400 kcal/hari" },
                { v: "maintain", l: "Maintain",  s: "Jaga berat" },
                { v: "gain",     l: "Bangun",    s: "+300 kcal/hari" },
              ].map(opt => {
                const active = user.goal === opt.v;
                return (
                  <button key={opt.v} onClick={() => onUpdate({ goal: opt.v })} style={{
                    textAlign: "left", padding: "12px 14px",
                    background: active ? "var(--surface)" : "transparent",
                    border: `1px solid ${active ? "var(--ink)" : "var(--line)"}`,
                    borderRadius: 12, cursor: "pointer",
                  }}>
                    <div className="display" style={{ fontSize: 14, letterSpacing: "0.04em", lineHeight: 1 }}>{opt.l}</div>
                    <div className="mono" style={{ fontSize: 9.5, color: "var(--muted)", marginTop: 5, letterSpacing: "0.06em" }}>{opt.s}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>
      </div>

      {/* TDEE summary */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 18 }}>
          <div>
            <Eyebrow>Kebutuhan estimasi</Eyebrow>
            <div className="headline" style={{ fontSize: 22, marginTop: 6, lineHeight: 1 }}>
              Berdasarkan data tubuhmu
            </div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 6, maxWidth: 460, lineHeight: 1.55 }}>
              Estimasi pakai rumus Mifflin-St Jeor. Angka ini hanya panduan — sesuaikan target sesuai bagaimana tubuhmu merespon.
            </div>
          </div>
          {recommended !== target.calories && (
            <Btn kind="primary" onClick={() => onSaveTarget({ ...target, calories: recommended })} icon={<I.Check size={14} />}>
              Set target ke {recommended.toLocaleString("id-ID")} kcal
            </Btn>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", marginTop: 22 }}>
          {[
            { l: "BMR",         v: bmr.toLocaleString("id-ID"),         u: "kcal istirahat" },
            { l: "TDEE",        v: tdee.toLocaleString("id-ID"),        u: "kcal pemeliharaan" },
            { l: "Rekomendasi", v: recommended.toLocaleString("id-ID"), u: `kcal · ${user.goal === "fatloss" ? "fat loss" : user.goal === "gain" ? "bangun" : "maintain"}` },
            { l: "Selisih berat", v: `${(user.weightKg - user.targetWeightKg).toFixed(1)} kg`, u: user.weightKg > user.targetWeightKg ? "sampai target" : "sudah tercapai" },
          ].map((s, i) => (
            <div key={i} style={{
              padding: "0 22px",
              borderRight: i < 3 ? "1px solid var(--line-soft)" : "none",
            }}>
              <Eyebrow>{s.l}</Eyebrow>
              <div className="display-num" style={{ fontSize: 30, marginTop: 8, lineHeight: 1 }}>{s.v}</div>
              <div className="mono" style={{ fontSize: 10, color: "var(--muted)", marginTop: 6, letterSpacing: "0.08em" }}>{s.u}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Preferences */}
      <Card>
        <Eyebrow>Preferensi</Eyebrow>
        <div style={{ display: "flex", flexDirection: "column", gap: 0, marginTop: 8 }}>
          {[
            { l: "Pengingat lembut", d: "Notifikasi makan & air · 12:00, 19:00", action: "Aktif" },
            { l: "Satuan",           d: "Metrik (g, kcal, kg, cm)",                action: "Ubah" },
            { l: "Bahasa",           d: "Bahasa Indonesia",                        action: "Ubah" },
            { l: "Ekspor data",      d: "Unduh seluruh catatan (.csv)",            action: "Unduh" },
            { l: "Hapus akun",       d: "Hapus semua data secara permanen",        action: "Hapus", danger: true },
          ].map((row, i, arr) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "16px 0",
              borderBottom: i < arr.length - 1 ? "1px solid var(--line-soft)" : "none",
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: row.danger ? "var(--plum)" : "var(--ink)" }}>{row.l}</div>
                <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 2 }}>{row.d}</div>
              </div>
              <button style={{
                background: "transparent",
                border: `1px solid ${row.danger ? "var(--plum)" : "var(--line)"}`,
                color: row.danger ? "var(--plum)" : "var(--ink-2)",
                padding: "7px 14px", borderRadius: 999,
                fontFamily: "inherit", fontSize: 12, fontWeight: 500,
                cursor: "pointer",
              }}>
                {row.action}
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Final save action */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "18px 22px",
        background: "var(--surface)", border: "1px solid var(--line-soft)",
        borderRadius: "var(--r-lg)",
        position: "sticky", bottom: 20, zIndex: 5,
        boxShadow: "0 8px 24px -16px rgba(0,0,0,0.18)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            width: 28, height: 28, borderRadius: "50%",
            background: savingStatus === "saved" || savedAgo ? "var(--c-target)" : "var(--surface-2)",
            color: "white", border: "1px solid var(--line-soft)",
            display: "grid", placeItems: "center",
          }}>
            {savingStatus === "saved" || savedAgo ? <I.Check size={14} stroke={2.4} /> : <I.Edit size={13} />}
          </span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>
              {savingStatus === "editing" ? "Sedang mengetik…"
                : savingStatus === "saving" ? "Menyimpan perubahan…"
                : savedAgo ? `Semua perubahan tersimpan · ${savedAgo}`
                : "Belum ada perubahan"}
            </div>
            <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 1 }}>
              Perubahan tersimpan otomatis. Tekan tombol di kanan untuk konfirmasi.
            </div>
          </div>
        </div>
        <Btn kind="primary" icon={<I.Check size={14} stroke={2.4} />} onClick={onConfirmSave}>
          Simpan & selesai
        </Btn>
      </div>
    </div>
  );
}

// Small editable input field
function FieldInput({ label, value, onChange, type = "text", suffix }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)" }}>{label}</span>
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "10px 12px",
        background: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: 10,
      }}>
        <input
          type={type} value={value} onChange={e => onChange(e.target.value)}
          style={{
            flex: 1, minWidth: 0,
            background: "transparent", border: "none", outline: "none",
            fontFamily: "inherit", fontSize: 14, color: "var(--ink)",
          }}
        />
        {suffix && <span className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>{suffix}</span>}
      </div>
    </label>
  );
}

function FieldArea({ label, value, onChange, placeholder }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)" }}>{label}</span>
      <textarea
        value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={2}
        style={{
          padding: "10px 12px",
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: 10,
          fontFamily: "inherit", fontSize: 14, color: "var(--ink)",
          resize: "vertical", outline: "none",
        }}
      />
    </label>
  );
}

function FieldSelect({ label, value, onChange, options }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)" }}>{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)} style={{
        padding: "10px 12px",
        background: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: 10,
        fontFamily: "inherit", fontSize: 14, color: "var(--ink)",
        outline: "none", cursor: "pointer",
      }}>
        {options.map(o => {
          const v = typeof o === "object" ? o.value : o;
          const l = typeof o === "object" ? o.label : o;
          return <option key={v} value={v}>{l}</option>;
        })}
      </select>
    </label>
  );
}

// Floating save indicator — appears briefly after profile edits settle
function SaveToast({ savedAt }) {
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    if (!savedAt) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 1600);
    return () => clearTimeout(t);
  }, [savedAt]);
  return (
    <div aria-live="polite" style={{
      position: "fixed", top: 24, right: 24, zIndex: 200,
      pointerEvents: "none",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(-10px)",
      transition: "opacity .25s ease, transform .25s ease",
    }}>
      <div style={{
        background: "var(--ink)", color: "var(--surface)",
        padding: "10px 16px 10px 12px", borderRadius: 999,
        fontSize: 12.5, fontWeight: 500,
        display: "inline-flex", alignItems: "center", gap: 8,
        boxShadow: "0 8px 24px -8px rgba(0,0,0,0.25)",
      }}>
        <span style={{
          width: 18, height: 18, borderRadius: "50%",
          background: "var(--c-target)", color: "white",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}>
          <I.Check size={11} stroke={2.4} />
        </span>
        Perubahan tersimpan
      </div>
    </div>
  );
}

// Mount
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
