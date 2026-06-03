// Login uses Logo from components.jsx (loaded in Login.html before login.jsx)

// ───────────────────────────────────────────────────────────────
// Login screen
// ───────────────────────────────────────────────────────────────

function Login({ onLogin }) {
  const [mode, setMode] = React.useState("signin"); // signin | signup
  const [email, setEmail] = React.useState("");
  const [pw, setPw] = React.useState("");
  const [name, setName] = React.useState("");
  const [showPw, setShowPw] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState("");

  function submit(e) {
    e.preventDefault();
    setErr("");
    if (!email.trim() || !pw.trim() || (mode === "signup" && !name.trim())) {
      setErr("Mohon lengkapi semua kolom.");
      return;
    }
    if (!email.includes("@")) {
      setErr("Format email tidak valid.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin({
        name: mode === "signup" ? name : (email.split("@")[0] || "Marcos"),
        email,
      });
    }, 700);
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      background: "var(--bg)",
    }}>
      {/* LEFT — dark brand panel */}
      <div style={{
        position: "relative",
        color: "#fff",
        padding: "44px 52px",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        overflow: "hidden",
        minHeight: 640,
        backgroundImage: `
          linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.30) 25%, rgba(0,0,0,0.30) 60%, rgba(0,0,0,0.85) 100%),
          url(assets/hero-gym.jpg)
        `,
        backgroundSize: "cover",
        backgroundPosition: "center 40%",
      }}>
        {/* Subtle film grain */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `repeating-linear-gradient(115deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 4px)`,
          mixBlendMode: "overlay",
        }} />

        {/* Top: logo */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo size={36} color="light" />
          <div className="mono" style={{
            fontSize: 10.5, letterSpacing: "0.18em", textTransform: "uppercase",
            opacity: 0.55,
          }}>
            kalori · daily ritual
          </div>
        </div>

        {/* (photo replaces the placeholder) */}

        {/* Bottom: tagline */}
        <div style={{ position: "relative", maxWidth: 540 }}>
          <div className="display" style={{
            fontSize: 76, lineHeight: 0.95, marginBottom: 14,
            textShadow: "0 2px 24px rgba(0,0,0,0.4)",
          }}>
            Reconnect.<br />Rebuild.<br />Become you.
          </div>
          <div className="script" style={{
            fontSize: 22, lineHeight: 1.3, color: "#fff", opacity: 0.95,
            marginTop: 10, marginLeft: 2,
            textShadow: "0 2px 18px rgba(0,0,0,0.45)",
          }}>
            satu ritual kecil setiap hari
          </div>
          <div style={{
            marginTop: 26, paddingTop: 18,
            borderTop: "1px solid rgba(255,255,255,0.22)",
            fontSize: 12.5, opacity: 0.82, maxWidth: 400, lineHeight: 1.6,
          }}>
            "Tubuhmu adalah rumah yang perlu dirawat, bukan dihukum.
            Kekuatan sejati tumbuh dari konsistensi yang sadar."
          </div>
        </div>
      </div>

      {/* RIGHT — form */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "48px 32px",
      }}>
        <form onSubmit={submit} style={{
          width: "100%", maxWidth: 380,
          display: "flex", flexDirection: "column", gap: 22,
        }}>
          <div>
            <div className="display" style={{ fontSize: 11, letterSpacing: "0.22em", color: "var(--clay)" }}>
              {mode === "signin" ? "Masuk" : "Daftar"}
            </div>
            <h1 className="headline" style={{
              fontSize: 34, margin: "8px 0 6px",
              lineHeight: 1.05,
            }}>
              {mode === "signin" ? "Selamat datang kembali." : "Mulai versi terbaikmu."}
            </h1>
            <div style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.5 }}>
              {mode === "signin"
                ? "Lanjutkan ritual harianmu — pelan, tapi konsisten."
                : "Tanpa tekanan. Tanpa perbandingan. Sesuai ritmemu."}
            </div>
          </div>

          {mode === "signup" && (
            <FormField label="Nama" value={name} onChange={setName} placeholder="Marcos" />
          )}
          <FormField label="Email" type="email" value={email} onChange={setEmail} placeholder="kamu@email.com" />
          <FormField
            label="Password"
            type={showPw ? "text" : "password"}
            value={pw} onChange={setPw}
            placeholder="••••••••"
            suffix={
              <button type="button" onClick={() => setShowPw(v => !v)} style={{
                background: "transparent", border: "none", color: "var(--muted)",
                fontSize: 12, padding: 0, fontFamily: "inherit",
              }}>
                {showPw ? "Sembunyi" : "Lihat"}
              </button>
            }
          />

          {err && (
            <div style={{
              padding: "10px 12px", fontSize: 12.5,
              background: "oklch(0.94 0.04 25)", color: "var(--plum)",
              borderRadius: 8, border: "1px solid oklch(0.85 0.05 25)",
            }}>
              {err}
            </div>
          )}

            {mode === "signin" && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: -8, gap: 12, flexWrap: "wrap" }}>
              <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--ink-2)", cursor: "pointer" }}>
                <input type="checkbox" defaultChecked style={{ accentColor: "var(--clay)" }} />
                Ingat saya
              </label>
              <a href="#" onClick={e => e.preventDefault()} style={{ fontSize: 12.5, color: "var(--ink-2)", textDecoration: "underline", textUnderlineOffset: 3, whiteSpace: "nowrap" }}>
                Lupa password?
              </a>
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            padding: "14px 18px", border: "none",
            background: "var(--ink)", color: "var(--surface)",
            borderRadius: 999, fontFamily: "Archivo Black, system-ui, sans-serif",
            fontSize: 12.5, letterSpacing: "0.18em", textTransform: "uppercase",
            cursor: loading ? "wait" : "pointer",
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            {loading
              ? <><span className="spin" style={{
                  width: 12, height: 12, border: "2px solid currentColor", borderRightColor: "transparent",
                  borderRadius: "50%", display: "inline-block",
                }} /> Memuat</>
              : mode === "signin" ? "Masuk" : "Buat akun"}
            <style>{`@keyframes sp { to { transform: rotate(360deg); } } .spin { animation: sp .8s linear infinite; }`}</style>
          </button>

          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            fontSize: 11, color: "var(--muted)",
            textTransform: "uppercase", letterSpacing: "0.16em",
          }}>
            <span style={{ flex: 1, height: 1, background: "var(--line)" }}></span>
            atau
            <span style={{ flex: 1, height: 1, background: "var(--line)" }}></span>
          </div>

          <button type="button" onClick={() => onLogin({ name: "Marcos", email: "tamu@kalori.app" })} style={{
            padding: "12px 18px",
            background: "var(--surface)", color: "var(--ink)",
            border: "1px solid var(--line)", borderRadius: 999,
            fontFamily: "inherit", fontSize: 13, fontWeight: 500,
            cursor: "pointer",
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
          }}>
            <GoogleG /> Lanjut dengan Google
          </button>

          <div style={{
            textAlign: "center", fontSize: 13, color: "var(--muted)", marginTop: 4,
          }}>
            {mode === "signin" ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
            <button type="button" onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setErr(""); }} style={{
              background: "transparent", border: "none", color: "var(--ink)",
              fontFamily: "inherit", fontSize: 13, fontWeight: 600,
              textDecoration: "underline", textUnderlineOffset: 3, padding: 0,
            }}>
              {mode === "signin" ? "Daftar di sini" : "Masuk"}
            </button>
          </div>

          <div style={{
            marginTop: 18, paddingTop: 18, borderTop: "1px solid var(--line-soft)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            fontSize: 11, color: "var(--muted)",
          }}>
            <span>© Better You · 2026</span>
            <div style={{ display: "flex", gap: 14 }}>
              <a href="#" onClick={e => e.preventDefault()} style={{ color: "inherit" }}>Privasi</a>
              <a href="#" onClick={e => e.preventDefault()} style={{ color: "inherit" }}>Bantuan</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormField({ label, value, onChange, placeholder, type = "text", suffix }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span className="mono" style={{
        fontSize: 10.5, letterSpacing: "0.16em", textTransform: "uppercase",
        color: "var(--muted)",
      }}>{label}</span>
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "12px 14px",
        background: "var(--surface)",
        border: `1px solid ${focus ? "var(--ink)" : "var(--line)"}`,
        borderRadius: 12,
        transition: "border-color .15s",
      }}>
        <input
          type={type} value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          placeholder={placeholder}
          style={{
            flex: 1, background: "transparent", border: "none", outline: "none",
            fontFamily: "inherit", fontSize: 14, color: "var(--ink)",
          }}
        />
        {suffix}
      </div>
    </label>
  );
}

function GoogleG() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.6 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.5 39.7 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.1 4-3.9 5.4l6.2 5.2C42 35 44 30 44 24c0-1.2-.1-2.4-.4-3.5z" />
    </svg>
  );
}

Object.assign(window, { Login });
