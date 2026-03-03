import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Credenciais pré-definidas

const ADMIN_USER = "admin";
const ADMIN_PASS = "ctfoco2025";

export function LoginPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [mounted, setMounted] = useState(false);
  const userRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // animação de entrada
    setTimeout(() => setMounted(true), 50);
    userRef.current?.focus();

    // se já estiver logado, vai direto para o admin
    if (sessionStorage.getItem("ctfoco_auth") === "true") {
      navigate("/admin", { replace: true });
    }
  }, []);

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!user || !pass) {
      setError("Preencha usuário e senha.");
      triggerShake();
      return;
    }

    setLoading(true);
    setError("");

    
    await new Promise(r => setTimeout(r, 600));

    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      // salva na sessão
      sessionStorage.setItem("ctfoco_auth", "true");
      navigate("/admin", { replace: true });
    } else {
      setError("Usuário ou senha incorretos.");
      setPass("");
      setLoading(false);
      triggerShake();
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden relative" style={{ fontFamily: "'Barlow', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;900&family=Barlow:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Barlow Condensed', sans-serif; }

        /* entrada do card */
        .login-card {
          transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1);
        }
        .login-card.hidden-card {
          opacity: 0;
          transform: translateY(32px);
        }
        .login-card.shown-card {
          opacity: 1;
          transform: translateY(0);
        }

        /* shake no erro */
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%      { transform: translateX(-8px); }
          40%      { transform: translateX(8px); }
          60%      { transform: translateX(-6px); }
          80%      { transform: translateX(6px); }
        }
        .shake { animation: shake 0.45s ease; }

        /* scanline sutil no fundo */
        .scanlines::before {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255,255,255,0.015) 2px,
            rgba(255,255,255,0.015) 4px
          );
          pointer-events: none;
          z-index: 0;
        }

        /* input focus */
        .input-login {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
        }
        .input-login:focus {
          outline: none;
          border-color: #dc2626;
          background: rgba(220,38,38,0.06);
          box-shadow: 0 0 0 3px rgba(220,38,38,0.12);
        }
        .input-login::placeholder { color: rgba(255,255,255,0.2); }

        /* botão */
        .btn-login {
          background: #dc2626;
          transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
        }
        .btn-login:hover:not(:disabled) {
          background: #b91c1c;
          box-shadow: 0 8px 32px rgba(220,38,38,0.45);
          transform: translateY(-1px);
        }
        .btn-login:active:not(:disabled) { transform: translateY(0); }
        .btn-login:disabled { opacity: 0.6; cursor: not-allowed; }

        /* linhas decorativas do fundo */
        @keyframes lineMove {
          from { transform: translateY(-100%); }
          to   { transform: translateY(100vh); }
        }
        .bg-line {
          position: absolute;
          width: 1px;
          height: 120px;
          background: linear-gradient(to bottom, transparent, rgba(220,38,38,0.4), transparent);
          animation: lineMove linear infinite;
          pointer-events: none;
        }
      `}</style>

      {/*Fundo com linhas*/}
      <div className="scanlines absolute inset-0">
        {[15, 30, 50, 68, 82].map((left, i) => (
          <div
            key={i}
            className="bg-line"
            style={{
              left: `${left}%`,
              animationDuration: `${4 + i * 1.3}s`,
              animationDelay: `${i * 0.8}s`,
            }}
          />
        ))}
        {/* vinheta */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.85) 100%)"
        }} />
      </div>

      {/* ── form de login*/}
      <div
        className={`login-card relative z-10 w-full max-w-sm mx-4 ${shake ? "shake" : ""} ${mounted ? "shown-card" : "hidden-card"}`}
      >
        {/* borda vermelha topo */}
        <div className="h-0.5 bg-red-600 w-full" />

        <div className="bg-neutral-950 border border-neutral-800 border-t-0 px-8 py-10">

          {/* Logo */}
          <div className="text-center mb-10">
            <div className="font-display font-black text-4xl tracking-widest mb-1">
              CT <span className="text-red-600">FOCO</span>
            </div>
            <p className="text-gray-600 text-xs tracking-[0.3em] uppercase">Painel Administrativo</p>
            <div className="flex items-center gap-3 mt-5">
              <div className="flex-1 h-px bg-neutral-800" />
              <span className="text-neutral-600 text-xs tracking-widest uppercase">Acesso Restrito</span>
              <div className="flex-1 h-px bg-neutral-800" />
            </div>
          </div>

          {/* Formulário */}
          <div className="space-y-4">

            {/* Usuário */}
            <div>
              <label className="block text-xs tracking-widest uppercase text-gray-500 mb-1.5">
                Usuário
              </label>
              <input
                ref={userRef}
                className="input-login w-full px-4 py-3 text-sm rounded-none"
                type="text"
                placeholder="Digite seu usuário"
                value={user}
                onChange={e => { setUser(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                autoComplete="username"
              />
            </div>

            {/* Senha */}
            <div>
              <label className="block text-xs tracking-widest uppercase text-gray-500 mb-1.5">
                Senha
              </label>
              <div className="relative">
                <input
                  className="input-login w-full px-4 py-3 pr-11 text-sm rounded-none"
                  type={showPass ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={pass}
                  onChange={e => { setPass(e.target.value); setError(""); }}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  autoComplete="current-password"
                />
                {/* Botão mostrar/ocultar senha */}
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPass ? (
                    // olho fechado
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    // olho aberto
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Mensagem de erro */}
            {error && (
              <div className="flex items-center gap-2 bg-red-950/40 border border-red-900/60 px-3 py-2.5">
                <svg className="w-3.5 h-3.5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-red-400 text-xs">{error}</p>
              </div>
            )}

            {/* Botão entrar */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="cursor-pointer btn-login w-full py-3 text-sm font-medium tracking-widest uppercase text-white flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Verificando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Entrar
                </>
              )}
            </button>
          </div>
        </div>
        <div className="h-0.5 bg-gradient-to-r from-transparent via-red-600 to-transparent" />
      </div>
    </div>
  );
}