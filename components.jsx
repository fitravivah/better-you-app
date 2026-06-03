// ───────────────────────────────────────────────────────────────
// Better You logo
// ───────────────────────────────────────────────────────────────

function Logo({ size = 28, color, style }) {
  const filter = color === "light"
    ? "invert(98%) sepia(8%) saturate(0%) hue-rotate(0deg) brightness(105%)"
    : "none";
  return (
    <img
      src="assets/better-you-logo.png"
      alt="Better You"
      style={{
        height: size, width: "auto", display: "block",
        filter,
        ...style,
      }}
    />
  );
}

// ───────────────────────────────────────────────────────────────
// Period filter — for Weekly / Monthly views
// ───────────────────────────────────────────────────────────────

function fmtRange(start, end) {
  const sameYear = start.getFullYear() === end.getFullYear();
  const sameMonth = sameYear && start.getMonth() === end.getMonth();
  const opts = { day: "numeric", month: "short" };
  const startTxt = start.toLocaleDateString("id-ID", opts);
  const endTxt = end.toLocaleDateString("id-ID", { ...opts, year: sameYear ? undefined : "numeric" });
  if (sameMonth && start.getDate() === end.getDate()) return startTxt + " " + start.getFullYear();
  return `${start.toLocaleDateString("id-ID", sameMonth ? { day: "numeric" } : opts)} — ${endTxt}${sameYear ? " " + start.getFullYear() : ""}`;
}

function PeriodFilter({
  mode,                   // "week" | "month"
  preset,                 // "current" | "previous" | "rolling7" | "rolling30" | "custom"
  offset,                 // numeric offset (weeks or months back/forward)
  customRange,            // {start: Date, end: Date} when preset=custom
  onChange,               // ({preset, offset, customRange}) => void
}) {
  const [pickerOpen, setPickerOpen] = React.useState(false);

  const presets = mode === "week"
    ? [
        { id: "current",  label: "Minggu ini" },
        { id: "rolling7", label: "7 hari" },
        { id: "previous", label: "Minggu lalu" },
        { id: "custom",   label: "Custom" },
      ]
    : [
        { id: "current",   label: "Bulan ini" },
        { id: "rolling30", label: "30 hari" },
        { id: "previous",  label: "Bulan lalu" },
        { id: "custom",    label: "Custom" },
      ];

  // Compute range for label display
  const today = new Date(); today.setHours(0, 0, 0, 0);
  let start, end;
  if (preset === "custom" && customRange) {
    start = new Date(customRange.start);
    end = new Date(customRange.end);
  } else if (mode === "week") {
    // Monday-based week
    const dow = (today.getDay() + 6) % 7;
    const weekStart = new Date(today); weekStart.setDate(today.getDate() - dow);
    if (preset === "current")  { start = new Date(weekStart); end = new Date(weekStart); end.setDate(weekStart.getDate() + 6); }
    else if (preset === "previous") { start = new Date(weekStart); start.setDate(weekStart.getDate() - 7 + offset * 7); end = new Date(start); end.setDate(start.getDate() + 6); }
    else { // rolling7
      end = new Date(today); end.setDate(today.getDate() + offset * 7);
      start = new Date(end); start.setDate(end.getDate() - 6);
    }
  } else {
    // month
    if (preset === "current")  { start = new Date(today.getFullYear(), today.getMonth() + offset, 1); end = new Date(today.getFullYear(), today.getMonth() + offset + 1, 0); }
    else if (preset === "previous") { start = new Date(today.getFullYear(), today.getMonth() - 1 + offset, 1); end = new Date(today.getFullYear(), today.getMonth() + offset, 0); }
    else { // rolling30
      end = new Date(today); end.setDate(today.getDate() + offset * 30);
      start = new Date(end); start.setDate(end.getDate() - 29);
    }
  }

  const rangeText = fmtRange(start, end);
  const stepLabel = mode === "week" ? "minggu" : "bulan";

  function setPreset(id) {
    if (id === "custom") {
      setPickerOpen(true);
      return;
    }
    onChange({ preset: id, offset: 0, customRange: null });
  }
  function step(delta) {
    if (preset === "custom") return;
    onChange({ preset, offset: offset + delta, customRange: null });
  }

  return (
    <>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 10,
        flexWrap: "wrap",
      }}>
        {/* Chip group */}
        <div style={{
          display: "inline-flex", padding: 4,
          background: "var(--surface-2)",
          border: "1px solid var(--line-soft)",
          borderRadius: 999,
          gap: 2,
        }}>
          {presets.map(p => {
            const active = p.id === preset;
            return (
              <button key={p.id} onClick={() => setPreset(p.id)} style={{
                padding: "7px 14px",
                background: active ? "var(--surface)" : "transparent",
                border: active ? "1px solid var(--line)" : "1px solid transparent",
                borderRadius: 999,
                fontSize: 12.5, fontWeight: active ? 600 : 500,
                color: active ? "var(--ink)" : "var(--ink-2)",
                fontFamily: "inherit", cursor: "pointer",
                boxShadow: active ? "0 1px 2px rgba(0,0,0,0.04)" : "none",
                transition: "all .15s",
              }}>{p.label}</button>
            );
          })}
        </div>

        {/* Nav with prev / range / next */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          padding: 4, background: "var(--surface)",
          border: "1px solid var(--line-soft)",
          borderRadius: 999,
        }}>
          <button onClick={() => step(-1)} disabled={preset === "custom"} title={`Mundur 1 ${stepLabel}`} style={{
            width: 30, height: 30, borderRadius: "50%",
            background: "transparent", border: "none",
            color: preset === "custom" ? "var(--line)" : "var(--ink-2)",
            display: "grid", placeItems: "center",
            cursor: preset === "custom" ? "default" : "pointer",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <div className="mono" style={{
            padding: "0 12px", fontSize: 11.5, color: "var(--ink)",
            minWidth: 130, textAlign: "center", letterSpacing: "0.06em",
            whiteSpace: "nowrap",
          }}>
            {rangeText}
          </div>
          <button onClick={() => step(1)} disabled={preset === "custom" || offset >= 0} title={`Maju 1 ${stepLabel}`} style={{
            width: 30, height: 30, borderRadius: "50%",
            background: "transparent", border: "none",
            color: (preset === "custom" || offset >= 0) ? "var(--line)" : "var(--ink-2)",
            display: "grid", placeItems: "center",
            cursor: (preset === "custom" || offset >= 0) ? "default" : "pointer",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>

      {pickerOpen && (
        <DateRangePicker
          initial={customRange || { start, end }}
          onClose={() => setPickerOpen(false)}
          onApply={(range) => {
            setPickerOpen(false);
            onChange({ preset: "custom", offset: 0, customRange: range });
          }}
        />
      )}
    </>
  );
}

function DateRangePicker({ initial, onClose, onApply }) {
  const [start, setStart] = React.useState(toInputDate(initial.start));
  const [end, setEnd] = React.useState(toInputDate(initial.end));

  function toInputDate(d) {
    const dt = d instanceof Date ? d : new Date(d);
    return dt.toISOString().slice(0, 10);
  }

  // Quick presets
  const quick = [
    { l: "7 hari terakhir",  days: 7 },
    { l: "14 hari terakhir", days: 14 },
    { l: "30 hari terakhir", days: 30 },
    { l: "90 hari terakhir", days: 90 },
  ];
  function applyQuick(days) {
    const e = new Date(); e.setHours(0, 0, 0, 0);
    const s = new Date(e); s.setDate(e.getDate() - days + 1);
    setStart(toInputDate(s));
    setEnd(toInputDate(e));
  }

  function apply() {
    if (!start || !end) return;
    const s = new Date(start), e = new Date(end);
    if (s > e) { onApply({ start: e, end: s }); return; }
    onApply({ start: s, end: e });
  }

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(0, 0, 0, 0.45)",
      backdropFilter: "blur(6px)",
      display: "grid", placeItems: "center", padding: 20,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "var(--bg)", borderRadius: "var(--r-xl)",
        width: "100%", maxWidth: 460,
        border: "1px solid var(--line-soft)",
        overflow: "hidden",
      }}>
        <div style={{ padding: "24px 28px 14px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <Eyebrow>Pilih rentang tanggal</Eyebrow>
            <h2 className="headline" style={{ margin: "6px 0 0", fontSize: 24, lineHeight: 1.1 }}>
              Periode kustom
            </h2>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "var(--muted)", padding: 6, cursor: "pointer" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6l-6 6-6 6" />
            </svg>
          </button>
        </div>

        <div style={{ padding: "0 28px 18px" }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
            {quick.map(q => (
              <button key={q.l} onClick={() => applyQuick(q.days)} style={{
                padding: "7px 14px",
                background: "var(--surface)", border: "1px solid var(--line)",
                borderRadius: 999, fontSize: 12, fontWeight: 500,
                color: "var(--ink-2)", fontFamily: "inherit", cursor: "pointer",
              }}>{q.l}</button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span className="mono" style={{ fontSize: 10, color: "var(--muted)" }}>DARI</span>
              <input type="date" value={start} onChange={e => setStart(e.target.value)} style={{
                padding: "12px 14px",
                border: "1px solid var(--line)", borderRadius: 10,
                background: "var(--surface)", outline: "none",
                fontFamily: "inherit", fontSize: 14, color: "var(--ink)",
              }} />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span className="mono" style={{ fontSize: 10, color: "var(--muted)" }}>SAMPAI</span>
              <input type="date" value={end} onChange={e => setEnd(e.target.value)} style={{
                padding: "12px 14px",
                border: "1px solid var(--line)", borderRadius: 10,
                background: "var(--surface)", outline: "none",
                fontFamily: "inherit", fontSize: 14, color: "var(--ink)",
              }} />
            </label>
          </div>
        </div>

        <div style={{
          padding: "14px 28px", borderTop: "1px solid var(--line-soft)",
          display: "flex", justifyContent: "flex-end", gap: 10,
        }}>
          <Btn kind="ghost" onClick={onClose}>Batal</Btn>
          <Btn kind="primary" onClick={apply}>Terapkan</Btn>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PeriodFilter, DateRangePicker });

// ───────────────────────────────────────────────────────────────
// Shared UI primitives
// ───────────────────────────────────────────────────────────────

const cx = (...a) => a.filter(Boolean).join(" ");

function Card({ children, style, padded = true, className, ...rest }) {
  return (
    <div className={cx("card", className)} style={{
      background: "var(--surface)",
      border: "1px solid var(--line-soft)",
      borderRadius: "var(--r-lg)",
      padding: padded ? "var(--pad)" : 0,
      ...style
    }} {...rest}>
      {children}
    </div>
  );
}

function Eyebrow({ children, color = "var(--muted)" }) {
  return (
    <div className="mono" style={{
      fontSize: 10.5,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color,
      fontWeight: 500,
    }}>
      {children}
    </div>
  );
}

function Pill({ children, tone = "default", style, ...rest }) {
  const tones = {
    default: { bg: "var(--surface-2)", fg: "var(--ink-2)", bd: "var(--line)" },
    clay:    { bg: "var(--clay-soft)",  fg: "var(--plum)",  bd: "transparent" },
    sage:    { bg: "var(--sage-soft)",  fg: "oklch(0.35 0.04 145)", bd: "transparent" },
    ghost:   { bg: "transparent",       fg: "var(--ink-2)", bd: "var(--line)" },
  };
  const t = tones[tone] || tones.default;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "5px 10px", borderRadius: 999,
      background: t.bg, color: t.fg, border: `1px solid ${t.bd}`,
      fontSize: 12, fontWeight: 500, lineHeight: 1,
      ...style
    }} {...rest}>{children}</span>
  );
}

function Btn({ children, kind = "primary", icon, style, ...rest }) {
  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    padding: "11px 18px", borderRadius: 999, fontSize: 13.5, fontWeight: 500,
    border: "1px solid transparent", transition: "all .15s ease",
    fontFamily: "inherit",
  };
  const kinds = {
    primary: { background: "var(--ink)", color: "var(--surface)" },
    clay:    { background: "var(--clay)", color: "white" },
    ghost:   { background: "transparent", color: "var(--ink)", borderColor: "var(--line)" },
    soft:    { background: "var(--surface-2)", color: "var(--ink)", borderColor: "var(--line-soft)" },
    plain:   { background: "transparent", color: "var(--ink-2)" },
  };
  return (
    <button style={{ ...base, ...kinds[kind], ...style }} {...rest}>
      {icon}{children}
    </button>
  );
}

// ───────────────────────────────────────────────────────────────
// Sidebar
// ───────────────────────────────────────────────────────────────

function Sidebar({ view, onView, user, onLogout, onProfile }) {
  const items = [
    { id: "dashboard", label: "Hari ini", icon: <I.Home /> },
    { id: "weekly",    label: "Minggu",   icon: <I.Calendar /> },
    { id: "report",    label: "Laporan",  icon: <I.Chart /> },
    { id: "target",    label: "Target",   icon: <I.Target /> },
    { id: "settings",  label: "Profil",   icon: <I.Settings /> },
  ];
  const displayName = user?.name || "Marcos A.";
  const initials = displayName.split(/\s+/).map(s => s[0]).join("").slice(0, 2).toUpperCase();
  return (
    <aside style={{
      width: 240, minWidth: 240, padding: "28px 22px",
      borderRight: "1px solid var(--line-soft)",
      background: "var(--bg)",
      display: "flex", flexDirection: "column", gap: 28,
      position: "sticky", top: 0, height: "100vh",
    }}>
      <div>
        <Logo size={26} color="dark" />
        <div className="mono" style={{
          fontSize: 9.5, color: "var(--muted)", letterSpacing: "0.22em",
          textTransform: "uppercase", marginTop: 10, paddingLeft: 2,
        }}>kalori · daily ritual</div>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Eyebrow>Menu</Eyebrow>
        <div style={{ height: 10 }}></div>
        {items.map(it => {
          const active = it.id === view;
          return (
            <button key={it.id} onClick={() => onView(it.id)} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 12px", borderRadius: 10,
              background: active ? "var(--surface)" : "transparent",
              border: active ? "1px solid var(--line-soft)" : "1px solid transparent",
              color: active ? "var(--ink)" : "var(--ink-2)",
              fontSize: 13.5, fontWeight: active ? 500 : 400,
              textAlign: "left", width: "100%",
            }}>
              <span style={{ opacity: active ? 1 : 0.7, display: "inline-flex" }}>{it.icon}</span>
              <span>{it.label}</span>
            </button>
          );
        })}
      </nav>

      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
        <Card style={{ padding: 18, background: "var(--surface-2)", border: "1px solid var(--line-soft)" }}>
          <Eyebrow>Pengingat lembut</Eyebrow>
          <div className="script" style={{ fontSize: 16, marginTop: 8, lineHeight: 1.4, color: "var(--ink)" }}>
            "Rawat tubuhmu, jangan hukum."
          </div>
        </Card>
        <button onClick={onProfile} style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "8px 6px",
          background: "transparent", border: "none",
          width: "100%", textAlign: "left", cursor: "pointer",
          borderRadius: 10,
          color: "inherit", fontFamily: "inherit",
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            background: "var(--clay-soft)", color: "var(--ink)",
            display: "grid", placeItems: "center", fontSize: 12, fontWeight: 600,
          }}>{initials}</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{displayName}</div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>Lihat profil</div>
          </div>
          {onLogout && (
            <span onClick={(e) => { e.stopPropagation(); onLogout(); }} title="Keluar" style={{
              color: "var(--muted)", padding: 4, display: "inline-flex",
            }}>
              <I.Arrow size={15} />
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}

// ───────────────────────────────────────────────────────────────
// Macro Ring (SVG progress dial)
// ───────────────────────────────────────────────────────────────

function CalorieRing({ consumed, target, size = 220, stroke = 14 }) {
  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, consumed / target));
  const remaining = Math.max(0, target - consumed);
  const overshoot = Math.max(0, consumed - target);

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="var(--line-soft)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="var(--clay)" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C - pct * C}
          style={{ transition: "stroke-dashoffset .6s cubic-bezier(.4,0,.2,1)" }} />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        textAlign: "center", gap: 2,
      }}>
        <Eyebrow>{overshoot > 0 ? "Melampaui" : "Tersisa"}</Eyebrow>
        <div className="display-num" style={{ fontSize: 56, lineHeight: 1 }}>
          {Math.round(overshoot > 0 ? overshoot : remaining)}
        </div>
        <div className="mono" style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          kcal
        </div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>
          {Math.round(consumed)} / {target} dikonsumsi
        </div>
      </div>
    </div>
  );
}

// Macro horizontal bar
function MacroBar({ label, value, target, color, icon }) {
  const pct = Math.max(0, Math.min(1, value / target));
  const over = value > target;
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color, display: "inline-flex" }}>{icon}</span>
          <span style={{ fontSize: 13, fontWeight: 500 }}>{label}</span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
          <span className="display-num" style={{ fontSize: 18, lineHeight: 1, color: "var(--ink)" }}>{Math.round(value)}</span>
          <span style={{ fontSize: 11, color: "var(--muted)" }}>/ {target}g</span>
        </div>
      </div>
      <div style={{
        height: 6, background: "var(--line-soft)", borderRadius: 999, overflow: "hidden", position: "relative",
      }}>
        <div style={{
          width: `${pct * 100}%`, height: "100%",
          background: over ? "var(--plum)" : color,
          borderRadius: 999, transition: "width .6s cubic-bezier(.4,0,.2,1)",
        }}/>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Weekly bar chart
// ───────────────────────────────────────────────────────────────

function WeeklyChart({ data, target }) {
  const max = Math.max(target * 1.2, ...data.map(d => d.kcal));
  const H = 170;       // chart height in px
  const labelH = 22;   // top kcal label
  const dayH = 22;     // bottom day label
  const barAreaH = H - labelH - dayH - 4; // pixels available for bars

  return (
    <div style={{
      display: "flex", alignItems: "flex-end", gap: 12, height: H, padding: "0 4px",
    }}>
      {data.map((d, i) => {
        const h = Math.max(0, Math.round((d.kcal / max) * barAreaH));
        const isToday = d.today;
        const onTarget = d.kcal >= target * 0.85 && d.kcal <= target * 1.10;
        const under = d.kcal > 0 && d.kcal < target * 0.85;
        const over = d.kcal > target * 1.10;
        const fill = isToday   ? "var(--c-today)"
                   : onTarget  ? "var(--c-target)"
                   : under     ? "var(--c-under)"
                   : over      ? "var(--c-over)"
                   : "var(--line)";
        return (
          <div key={i} style={{
            flex: 1, height: "100%",
            display: "flex", flexDirection: "column", alignItems: "center",
          }}>
            <div style={{ height: labelH, display: "flex", alignItems: "center" }}>
              <span className="mono" style={{ fontSize: 10, color: "var(--muted)" }}>
                {d.kcal === 0 ? "—" : (d.kcal / 1000).toFixed(1) + "k"}
              </span>
            </div>
            <div style={{
              flex: 1, width: "100%", maxWidth: 38,
              display: "flex", flexDirection: "column", justifyContent: "flex-end",
              position: "relative",
            }}>
              {/* target line */}
              <div style={{
                position: "absolute",
                bottom: `${(target / max) * 100}%`,
                left: -6, right: -6, height: 0,
                borderTop: "1px dashed var(--line)",
              }} />
              <div style={{
                height: h,
                background: fill,
                borderRadius: "5px 5px 2px 2px",
                transition: "height .5s cubic-bezier(.4,0,.2,1)",
                opacity: isToday ? 1 : 0.92,
                boxShadow: isToday ? "0 0 0 2px color-mix(in oklab, var(--c-today) 30%, transparent)" : "none",
              }} />
            </div>
            <div style={{
              height: dayH, display: "flex", alignItems: "center",
              fontSize: 11, color: isToday ? "var(--ink)" : "var(--muted)",
              fontWeight: isToday ? 600 : 400,
            }}>
              {d.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Meal section
// ───────────────────────────────────────────────────────────────

const MEAL_META = {
  pagi:    { label: "Sarapan",    time: "06:00 — 10:00", icon: <I.Sun size={16} /> },
  siang:   { label: "Makan siang", time: "11:00 — 14:00", icon: <I.Plate size={16} /> },
  malam:   { label: "Makan malam", time: "17:00 — 21:00", icon: <I.Moon size={16} /> },
  snack:   { label: "Camilan",    time: "kapan saja",     icon: <I.Coffee size={16} /> },
};

function MealRow({ meal, items, onAdd, onDelete }) {
  const m = MEAL_META[meal];
  const total = items.reduce((s, i) => s + i.kcal, 0);
  return (
    <div style={{ paddingBottom: 18, borderBottom: "1px solid var(--line-soft)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: "var(--surface-2)", color: "var(--ink-2)",
            display: "grid", placeItems: "center",
            border: "1px solid var(--line-soft)",
          }}>{m.icon}</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>{m.label}</div>
            <div className="mono" style={{ fontSize: 10.5, color: "var(--muted)", letterSpacing: "0.06em" }}>{m.time}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span className="display-num" style={{ fontSize: 20, lineHeight: 1 }}>{Math.round(total)}</span>
            <span style={{ fontSize: 11, color: "var(--muted)" }}>kcal</span>
          </div>
          <button onClick={() => onAdd(meal)} style={{
            background: "transparent", border: "1px solid var(--line)",
            color: "var(--ink-2)", borderRadius: 999,
            width: 28, height: 28, display: "grid", placeItems: "center",
          }}>
            <I.Plus size={14} />
          </button>
        </div>
      </div>
      {items.length === 0 ? (
        <div style={{ fontSize: 12.5, color: "var(--muted)", fontStyle: "italic", paddingLeft: 44 }}>
          Belum ada catatan. Tambahkan saat kamu siap, tanpa terburu-buru.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 44 }}>
          {items.map(it => (
            <div key={it.id} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 14px",
              background: "var(--surface-2)",
              borderRadius: 10,
              border: "1px solid var(--line-soft)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.name}</div>
                  <div className="mono" style={{ fontSize: 10.5, color: "var(--muted)" }}>
                    {it.serving} · P{Math.round(it.p)} · K{Math.round(it.c)} · L{Math.round(it.f)}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{Math.round(it.kcal)} <span style={{ color: "var(--muted)", fontWeight: 400, fontSize: 11 }}>kcal</span></span>
                <button onClick={() => onDelete(it.id)} style={{
                  background: "transparent", border: "none", color: "var(--muted)",
                  padding: 4, display: "inline-flex",
                }}>
                  <I.Trash size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// AI Chat dock
// ───────────────────────────────────────────────────────────────

function AIDock({ open, onClose, onLog }) {
  const [messages, setMessages] = React.useState([
    { role: "ai", text: "Halo. Ceritakan apa yang kamu makan — bisa pakai bahasa santai, contoh: \"nasi setengah piring, ayam goreng, dan teh manis\"." },
  ]);
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, busy]);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    setMessages(m => [...m, { role: "user", text }]);
    setBusy(true);

    try {
      const prompt = `Kamu asisten pencatat makanan untuk pengguna Indonesia. Pengguna menulis:\n"${text}"\n\nParse menjadi JSON array makanan. Setiap item: { "name": string, "serving": string (porsi), "kcal": number, "p": number (protein g), "c": number (karbo g), "f": number (lemak g), "meal": "pagi" | "siang" | "malam" | "snack" }. Tebak meal dari waktu hari atau konteks; default ke jam sekarang. Jawab HANYA JSON array, tanpa markdown atau penjelasan. Contoh: [{"name":"Nasi putih","serving":"1 centong (100g)","kcal":130,"p":2.7,"c":28,"f":0.3,"meal":"siang"}]`;
      const reply = await window.claude.complete(prompt);
      let parsed = [];
      try {
        const cleaned = reply.replace(/```json|```/g, "").trim();
        const m = cleaned.match(/\[[\s\S]*\]/);
        parsed = JSON.parse(m ? m[0] : cleaned);
      } catch (e) { /* fallthrough */ }

      if (Array.isArray(parsed) && parsed.length) {
        parsed.forEach(p => onLog({
          id: Math.random().toString(36).slice(2),
          name: p.name || "Item",
          serving: p.serving || "—",
          kcal: +p.kcal || 0,
          p: +p.p || 0,
          c: +p.c || 0,
          f: +p.f || 0,
          meal: p.meal || "siang",
        }));
        const total = parsed.reduce((s, p) => s + (+p.kcal || 0), 0);
        setMessages(m => [...m, {
          role: "ai",
          text: `Tercatat ${parsed.length} item · ${Math.round(total)} kcal.`,
          items: parsed,
        }]);
      } else {
        setMessages(m => [...m, { role: "ai", text: "Hmm, saya kurang yakin. Coba sebut porsinya juga, contoh: \"setengah piring nasi\"." }]);
      }
    } catch (e) {
      setMessages(m => [...m, { role: "ai", text: "Maaf, ada gangguan koneksi. Coba lagi sebentar." }]);
    } finally {
      setBusy(false);
    }
  }

  if (!open) return null;

  return (
    <div style={{
      position: "fixed", right: 24, bottom: 24, width: 380, maxWidth: "calc(100vw - 32px)",
      maxHeight: "calc(100vh - 48px)",
      background: "var(--surface)",
      border: "1px solid var(--line)",
      borderRadius: "var(--r-lg)",
      boxShadow: "0 20px 50px -20px rgba(60, 30, 10, 0.18)",
      display: "flex", flexDirection: "column",
      zIndex: 50,
      overflow: "hidden",
    }}>
      <div style={{
        padding: "16px 18px", borderBottom: "1px solid var(--line-soft)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: "var(--ink)", color: "var(--surface)",
            display: "grid", placeItems: "center",
          }}>
            <I.Sparkle size={15} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Catat lewat percakapan</div>
            <div className="mono" style={{ fontSize: 9.5, color: "var(--muted)", letterSpacing: "0.16em", textTransform: "uppercase" }}>asisten parsing</div>
          </div>
        </div>
        <button onClick={onClose} style={{
          background: "transparent", border: "none", color: "var(--muted)", padding: 4, display: "inline-flex",
        }}>
          <I.Close size={16} />
        </button>
      </div>

      <div ref={scrollRef} style={{
        flex: 1, padding: "16px 18px", overflowY: "auto",
        display: "flex", flexDirection: "column", gap: 10, minHeight: 200, maxHeight: 360,
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.role === "user" ? "flex-end" : "flex-start",
            maxWidth: "85%",
          }}>
            <div style={{
              padding: "10px 13px",
              borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
              background: m.role === "user" ? "var(--ink)" : "var(--surface-2)",
              color: m.role === "user" ? "var(--surface)" : "var(--ink)",
              fontSize: 13, lineHeight: 1.5,
              border: m.role === "user" ? "none" : "1px solid var(--line-soft)",
            }}>
              {m.text}
            </div>
            {m.items && (
              <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
                {m.items.map((it, j) => (
                  <div key={j} className="mono" style={{
                    fontSize: 10.5, color: "var(--muted)", paddingLeft: 8,
                  }}>
                    · {it.name} — {Math.round(it.kcal)} kcal
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {busy && (
          <div style={{ display: "flex", gap: 4, alignSelf: "flex-start", padding: "10px 13px" }}>
            <span className="dot"></span><span className="dot"></span><span className="dot"></span>
            <style>{`
              .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--muted); animation: bounce 1.2s infinite; }
              .dot:nth-child(2) { animation-delay: .15s; }
              .dot:nth-child(3) { animation-delay: .3s; }
              @keyframes bounce { 0%, 60%, 100% { transform: translateY(0); opacity: .4; } 30% { transform: translateY(-4px); opacity: 1; } }
            `}</style>
          </div>
        )}
      </div>

      <form onSubmit={e => { e.preventDefault(); send(); }} style={{
        padding: 12, borderTop: "1px solid var(--line-soft)",
        display: "flex", gap: 8, alignItems: "center",
        background: "var(--surface)",
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Contoh: 'nasi sedang + ayam goreng + teh manis'"
          style={{
            flex: 1, padding: "10px 14px", border: "1px solid var(--line)",
            borderRadius: 999, background: "var(--bg)", outline: "none",
            fontFamily: "inherit", fontSize: 13, color: "var(--ink)",
          }}
        />
        <button type="submit" disabled={busy || !input.trim()} style={{
          width: 38, height: 38, borderRadius: "50%",
          background: input.trim() ? "var(--clay)" : "var(--line)",
          border: "none", color: "white",
          display: "grid", placeItems: "center", cursor: input.trim() ? "pointer" : "default",
        }}>
          <I.Send size={15} />
        </button>
      </form>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Target modal
// ───────────────────────────────────────────────────────────────

function TargetModal({ open, onClose, target, onSave }) {
  const [local, setLocal] = React.useState(target);
  const [preset, setPreset] = React.useState("custom");
  React.useEffect(() => { setLocal(target); }, [target, open]);

  const presets = [
    { id: "diet",      label: "Defisit ringan",  sub: "fat loss berkelanjutan", v: { calories: 1700, protein: 130, carbs: 160, fat: 55 } },
    { id: "maintain",  label: "Jaga berat",       sub: "maintenance",            v: { calories: 2000, protein: 120, carbs: 200, fat: 65 } },
    { id: "build",     label: "Bangun otot",      sub: "surplus moderat",        v: { calories: 2400, protein: 160, carbs: 260, fat: 75 } },
    { id: "active",    label: "Aktif & olahraga", sub: "kebutuhan tinggi",       v: { calories: 2600, protein: 150, carbs: 300, fat: 80 } },
  ];

  const macroKcal = local.protein * 4 + local.carbs * 4 + local.fat * 9;

  if (!open) return null;

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(40, 25, 15, 0.35)",
      backdropFilter: "blur(6px)",
      display: "grid", placeItems: "center", padding: 20,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "var(--bg)", borderRadius: "var(--r-xl)",
        width: "100%", maxWidth: 580,
        border: "1px solid var(--line-soft)",
        overflow: "hidden",
        maxHeight: "calc(100vh - 40px)",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{ padding: "26px 32px 18px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <Eyebrow>Atur target harian</Eyebrow>
            <h2 className="headline" style={{ margin: "6px 0 0", fontSize: 30, lineHeight: 1.05 }}>
              Niat baikmu, dalam angka.
            </h2>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 6, maxWidth: 380 }}>
              Pilih tujuan, atau sesuaikan setiap angka. Kamu bisa ubah kapan saja.
            </div>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "var(--muted)", padding: 6 }}>
            <I.Close />
          </button>
        </div>

        <div style={{ padding: "0 32px 24px", overflowY: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 22 }}>
            {presets.map(p => {
              const active = preset === p.id;
              return (
                <button key={p.id} onClick={() => { setPreset(p.id); setLocal(p.v); }} style={{
                  textAlign: "left", padding: "14px 16px",
                  background: active ? "var(--surface)" : "transparent",
                  border: `1px solid ${active ? "var(--ink)" : "var(--line)"}`,
                  borderRadius: "var(--r-md)", cursor: "pointer",
                }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500 }}>{p.label}</div>
                  <div className="mono" style={{ fontSize: 10.5, color: "var(--muted)", letterSpacing: "0.06em", marginTop: 2 }}>{p.sub}</div>
                </button>
              );
            })}
          </div>

          <div style={{ marginBottom: 20 }}>
            <Eyebrow>Kalori</Eyebrow>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 8 }}>
              <input
                type="number"
                value={local.calories}
                onChange={e => { setLocal({ ...local, calories: +e.target.value }); setPreset("custom"); }}
                style={{
                  fontFamily: "Newsreader, serif", fontSize: 42, fontWeight: 400,
                  background: "transparent", border: "none", outline: "none",
                  width: 130, color: "var(--ink)", letterSpacing: "-0.02em",
                }}
              />
              <span className="mono" style={{ fontSize: 12, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>kcal / hari</span>
            </div>
            <input
              type="range" min="1200" max="3500" step="50"
              value={local.calories}
              onChange={e => { setLocal({ ...local, calories: +e.target.value }); setPreset("custom"); }}
              style={{ width: "100%", marginTop: 4, accentColor: "var(--clay)" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="mono" style={{ fontSize: 10, color: "var(--muted)" }}>1.200</span>
              <span className="mono" style={{ fontSize: 10, color: "var(--muted)" }}>3.500</span>
            </div>
          </div>

          <Eyebrow>Makronutrien</Eyebrow>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 10 }}>
            {[
              { k: "protein", label: "Protein", color: "var(--c-protein)" },
              { k: "carbs",   label: "Karbo",   color: "var(--c-carb)" },
              { k: "fat",     label: "Lemak",   color: "var(--c-fat)" },
            ].map(m => (
              <div key={m.k} style={{
                padding: 14, background: "var(--surface)", border: "1px solid var(--line-soft)",
                borderRadius: "var(--r-md)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 999, background: m.color }}></span>
                  <span style={{ fontSize: 12, color: "var(--ink-2)" }}>{m.label}</span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <input
                    type="number"
                    value={local[m.k]}
                    onChange={e => { setLocal({ ...local, [m.k]: +e.target.value }); setPreset("custom"); }}
                    style={{
                      fontFamily: "Newsreader, serif", fontSize: 22, fontWeight: 400,
                      background: "transparent", border: "none", outline: "none",
                      width: 60, color: "var(--ink)",
                    }}
                  />
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>g</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 16, padding: "12px 14px",
            background: "var(--surface-2)", border: "1px solid var(--line-soft)",
            borderRadius: "var(--r-md)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>Total dari makro</span>
            <span className="mono" style={{ fontSize: 12, color: Math.abs(macroKcal - local.calories) > 50 ? "var(--plum)" : "var(--ink-2)" }}>
              {macroKcal} kcal {Math.abs(macroKcal - local.calories) > 50 && `· selisih ${Math.abs(macroKcal - local.calories)}`}
            </span>
          </div>
        </div>

        <div style={{
          padding: "16px 32px", borderTop: "1px solid var(--line-soft)",
          display: "flex", justifyContent: "flex-end", gap: 10,
        }}>
          <Btn kind="ghost" onClick={onClose}>Batal</Btn>
          <Btn kind="clay" icon={<I.Check size={15} />} onClick={() => { onSave(local); onClose(); }}>Simpan target</Btn>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Add food modal (manual)
// ───────────────────────────────────────────────────────────────

const FOOD_DB = [
  { name: "Nasi putih",          serving: "1 centong (100g)", kcal: 130, p: 2.7, c: 28,  f: 0.3 },
  { name: "Ayam panggang dada",  serving: "100 g",            kcal: 165, p: 31,  c: 0,   f: 3.6 },
  { name: "Telur rebus",         serving: "1 butir besar",    kcal: 78,  p: 6.3, c: 0.6, f: 5.3 },
  { name: "Tempe goreng",        serving: "2 potong",         kcal: 195, p: 14,  c: 8,   f: 12  },
  { name: "Tahu",                serving: "1 potong sedang",  kcal: 70,  p: 8,   c: 2,   f: 4   },
  { name: "Sayur bayam rebus",   serving: "1 mangkuk",        kcal: 25,  p: 2.9, c: 3.6, f: 0.4 },
  { name: "Pisang ambon",        serving: "1 buah sedang",    kcal: 105, p: 1.3, c: 27,  f: 0.4 },
  { name: "Alpukat",             serving: "1/2 buah",         kcal: 160, p: 2,   c: 9,   f: 15  },
  { name: "Oats kering",         serving: "40 g",             kcal: 150, p: 5,   c: 27,  f: 2.5 },
  { name: "Susu rendah lemak",   serving: "200 ml",           kcal: 100, p: 7,   c: 12,  f: 2.5 },
  { name: "Salmon panggang",     serving: "120 g",            kcal: 250, p: 28,  c: 0,   f: 14  },
  { name: "Kopi hitam",          serving: "1 cangkir",        kcal: 5,   p: 0.3, c: 0,   f: 0   },
  { name: "Teh manis",           serving: "1 gelas",          kcal: 85,  p: 0,   c: 22,  f: 0   },
  { name: "Roti gandum",         serving: "2 lembar",         kcal: 160, p: 8,   c: 28,  f: 2   },
  { name: "Selai kacang",        serving: "1 sdm",            kcal: 95,  p: 4,   c: 3,   f: 8   },
];

function AddFoodModal({ open, meal, onClose, onAdd }) {
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState(null);
  const [qty, setQty] = React.useState(1);

  React.useEffect(() => {
    if (open) { setQuery(""); setSelected(null); setQty(1); }
  }, [open]);

  if (!open) return null;

  const results = FOOD_DB.filter(f =>
    !query.trim() || f.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8);

  function commit() {
    if (!selected) return;
    onAdd({
      id: Math.random().toString(36).slice(2),
      name: selected.name,
      serving: qty === 1 ? selected.serving : `${qty}× ${selected.serving}`,
      kcal: selected.kcal * qty,
      p: selected.p * qty,
      c: selected.c * qty,
      f: selected.f * qty,
      meal,
    });
    onClose();
  }

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(40, 25, 15, 0.35)",
      backdropFilter: "blur(6px)",
      display: "grid", placeItems: "center", padding: 20,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "var(--bg)", borderRadius: "var(--r-xl)",
        width: "100%", maxWidth: 520,
        border: "1px solid var(--line-soft)",
        overflow: "hidden",
      }}>
        <div style={{ padding: "24px 28px 14px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <Eyebrow>Catat untuk · {MEAL_META[meal]?.label || "Hari ini"}</Eyebrow>
            <h2 className="headline" style={{ margin: "4px 0 0", fontSize: 26, lineHeight: 1.05 }}>
              Apa yang baru saja kamu makan?
            </h2>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "var(--muted)", padding: 6 }}>
            <I.Close />
          </button>
        </div>

        <div style={{ padding: "0 28px 18px" }}>
          <div style={{ position: "relative" }}>
            <I.Search size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
            <input
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Cari makanan…"
              style={{
                width: "100%", padding: "12px 14px 12px 38px",
                border: "1px solid var(--line)", borderRadius: 12,
                background: "var(--surface)", outline: "none",
                fontFamily: "inherit", fontSize: 14, color: "var(--ink)",
              }}
            />
          </div>
        </div>

        <div style={{ padding: "0 28px 18px", maxHeight: 280, overflowY: "auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {results.map((f, i) => {
              const active = selected?.name === f.name;
              return (
                <button key={i} onClick={() => setSelected(f)} style={{
                  textAlign: "left", padding: "11px 14px",
                  background: active ? "var(--surface)" : "transparent",
                  border: `1px solid ${active ? "var(--ink)" : "transparent"}`,
                  borderRadius: 10,
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  cursor: "pointer",
                }}>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 500 }}>{f.name}</div>
                    <div className="mono" style={{ fontSize: 10.5, color: "var(--muted)" }}>{f.serving} · P{f.p} K{f.c} L{f.f}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                    <span className="display-num" style={{ fontSize: 18 }}>{f.kcal}</span>
                    <span style={{ fontSize: 10.5, color: "var(--muted)" }}>kcal</span>
                  </div>
                </button>
              );
            })}
            {results.length === 0 && (
              <div style={{ padding: 20, fontSize: 13, color: "var(--muted)", textAlign: "center", fontStyle: "italic" }}>
                Tidak ditemukan. Coba kata lain, atau pakai catatan AI.
              </div>
            )}
          </div>
        </div>

        <div style={{
          padding: "14px 28px", borderTop: "1px solid var(--line-soft)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "var(--surface)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>Jumlah porsi</span>
            <div style={{ display: "flex", alignItems: "center", gap: 0, border: "1px solid var(--line)", borderRadius: 999, overflow: "hidden" }}>
              <button onClick={() => setQty(Math.max(0.5, qty - 0.5))} style={{ width: 28, height: 28, background: "transparent", border: "none", color: "var(--ink-2)" }}>−</button>
              <span className="mono" style={{ width: 36, textAlign: "center", fontSize: 12 }}>{qty}×</span>
              <button onClick={() => setQty(qty + 0.5)} style={{ width: 28, height: 28, background: "transparent", border: "none", color: "var(--ink-2)" }}>+</button>
            </div>
          </div>
          <Btn kind="clay" disabled={!selected} icon={<I.Check size={15} />} onClick={commit} style={{ opacity: selected ? 1 : 0.4 }}>
            Catat {selected && `· ${Math.round(selected.kcal * qty)} kcal`}
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Monthly calendar heatmap
// ───────────────────────────────────────────────────────────────

function MonthlyHeatmap({ data, target, year, month }) {
  // data: { [dayNum]: kcal }
  // month: 0-11
  const firstDow = new Date(year, month, 1).getDay(); // 0=Sun
  // Indonesian week starts Monday — shift so Mon=0
  const offset = (firstDow + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const todayNum = isCurrentMonth ? today.getDate() : -1;

  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  function cellFill(day) {
    if (!data[day]) return "var(--surface-2)";
    const ratio = data[day] / target;
    if (ratio < 0.7)  return "var(--c-under)";
    if (ratio < 0.95) return "var(--c-near)";
    if (ratio < 1.10) return "var(--c-target)";
    return "var(--c-over)";
  }

  return (
    <div>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6,
        marginBottom: 8,
      }}>
        {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map(d => (
          <div key={d} className="mono" style={{
            fontSize: 9.5, letterSpacing: "0.14em", textTransform: "uppercase",
            color: "var(--muted)", textAlign: "center", paddingBottom: 2,
          }}>{d}</div>
        ))}
      </div>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6,
      }}>
        {cells.map((d, i) => {
          if (d === null) return <div key={i} style={{ aspectRatio: "1 / 1" }} />;
          const fill = cellFill(d);
          const has = !!data[d];
          const isToday = d === todayNum;
          const dark = has && data[d] >= target * 0.7;
          return (
            <div key={i}
              title={has ? `${d}: ${Math.round(data[d])} kcal` : `${d}: tidak tercatat`}
              style={{
                aspectRatio: "1 / 1",
                background: fill,
                border: isToday ? "2px solid var(--ink)" : "1px solid var(--line-soft)",
                borderRadius: 8,
                padding: 6,
                display: "flex", flexDirection: "column", justifyContent: "space-between",
                color: dark ? "white" : "var(--ink-2)",
                position: "relative",
                cursor: has ? "pointer" : "default",
                transition: "transform .15s",
              }}>
              <div style={{
                fontSize: 11, fontWeight: 600, lineHeight: 1,
                color: dark ? "white" : has ? "var(--ink)" : "var(--muted)",
              }}>{d}</div>
              {has && (
                <div className="mono" style={{
                  fontSize: 8.5, letterSpacing: "0.04em",
                  opacity: 0.85, lineHeight: 1,
                }}>
                  {(data[d] / 1000).toFixed(1)}k
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{
        marginTop: 18, display: "flex", gap: 16, flexWrap: "wrap",
        fontSize: 11, color: "var(--muted)",
      }}>
        {[
          { label: "Belum tercatat", c: "var(--surface-2)" },
          { label: "Di bawah target", c: "var(--c-under)" },
          { label: "Mendekati",        c: "var(--c-near)" },
          { label: "Pada target",      c: "var(--c-target)" },
          { label: "Melampaui",        c: "var(--c-over)" },
        ].map(l => (
          <span key={l.label} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: l.c, border: "1px solid var(--line-soft)" }}></span>
            {l.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// Trend bars — weekly averages across month
function MonthTrend({ weeks }) {
  const max = Math.max(...weeks.map(w => w.avg), 1);
  return (
    <div style={{ display: "flex", gap: 14, alignItems: "flex-end", height: 120 }}>
      {weeks.map((w, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div className="display-num" style={{ fontSize: 16, lineHeight: 1, color: "var(--ink)" }}>
            {w.avg ? Math.round(w.avg) : "—"}
          </div>
          <div style={{
            width: "100%", maxWidth: 40, height: "100%",
            display: "flex", flexDirection: "column", justifyContent: "flex-end",
          }}>
            <div style={{
              height: `${(w.avg / max) * 100}%`,
              background: "var(--ink)",
              borderRadius: "4px 4px 2px 2px",
              minHeight: 3,
            }} />
          </div>
          <div className="mono" style={{ fontSize: 9.5, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {w.label}
          </div>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { MonthlyHeatmap, MonthTrend });

Object.assign(window, {
  Logo,
  cx, Card, Eyebrow, Pill, Btn,
  Sidebar, CalorieRing, MacroBar, WeeklyChart, MealRow, MEAL_META,
  AIDock, TargetModal, AddFoodModal, FOOD_DB,
});
