import React, { useLayoutEffect, useRef, useState } from "react";
import { FaKey, FaLock, FaLockOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../server/api";

interface LoginAdminProps {
  onLogin: (token: string) => void;
}

type FloatingInputProps = {
  id: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  autoFocus?: boolean;
  onFocus?: () => void;
};

const FloatingInput: React.FC<FloatingInputProps> = ({
  id,
  type,
  value,
  onChange,
  label,
  autoFocus = false,
  onFocus,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [labelWidth, setLabelWidth] = useState(0);
  useLayoutEffect(() => {
    if (labelRef.current) {
      const width = labelRef.current.offsetWidth;
      if (width !== labelWidth) setLabelWidth(width);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [label, value, isFocused]);
  const isActive = isFocused || value.length > 0;
  return (
    <div className="relative mt-6 mb-6">
      <input
        id={id}
        name={id}
        type={type}
        autoFocus={autoFocus}
        value={value}
        onChange={onChange}
        required
        className={`block w-full px-4 py-3 rounded-xl border-2 focus:outline-none text-lg text-black font-semibold bg-transparent transition-all duration-200 peer ${
          isActive ? "border-red-600" : "border-black"
        }`}
        placeholder=" "
        onFocus={(e) => {
          setIsFocused(true);
          if (onFocus) onFocus();
        }}
        onBlur={() => setIsFocused(false)}
      />
      <span
        className={`absolute top-0 left-3 right-3 h-0.5 transition-all duration-200 ${
          isActive ? "bg-red-600" : "bg-black"
        }`}
      />
      <span
        className={`absolute bottom-0 left-3 right-3 h-0.5 transition-all duration-200 ${
          isActive ? "bg-red-600" : "bg-black"
        }`}
      />
      <span
        ref={labelRef}
        className={`absolute left-6 transition-all duration-200 font-semibold pointer-events-none px-3
          ${
            isActive
              ? "text-xs text-red-600 bg-white"
              : "text-base text-gray-500 bg-transparent"
          }
        `}
        style={{
          top: isActive ? -6 : "50%",
          transform: isActive ? "translateY(0)" : "translateY(-50%)",
          zIndex: 2,
          lineHeight: 1,
          boxShadow: isActive ? "0 0 0 6px #fff" : undefined,
        }}
      >
        {label}
      </span>
      {isActive && (
        <span
          className="absolute"
          style={{
            left: 24,
            top: 0,
            width: labelWidth,
            height: 2,
            background: "#fff",
            zIndex: 1,
            transition: "all 0.2s",
          }}
        />
      )}
    </div>
  );
};

const LoginAdmin: React.FC<LoginAdminProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [hasAutoFocused, setHasAutoFocused] = useState(false);
  const [keyInserted, setKeyInserted] = useState(false);
  const [lockOpen, setLockOpen] = useState(false);
  const [keyTurned, setKeyTurned] = useState(false);
  const [keyErrorShake, setKeyErrorShake] = useState(false);
  const showKey = username.length > 0;
  const lockLookKey = showKey;

  React.useEffect(() => {
    if (password.length > 0 && username.length > 0) {
      setKeyInserted(true);
    } else {
      setKeyInserted(false);
      setKeyTurned(false);
    }
  }, [password, username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLockOpen(true);
    setKeyTurned(true);
    setTimeout(async () => {
      try {
        const data = await AuthService.login(username, password);
        localStorage.setItem("adminToken", data.token);
        onLogin(data.token);
        navigate("/admin");
      } catch (error) {
        setError("Não sabe teu login maluco?");
        setKeyErrorShake(true);
        setTimeout(() => {
          setKeyTurned(false);
          setKeyErrorShake(false);
        }, 700);
      } finally {
        setTimeout(() => {
          setLockOpen(false);
          setKeyTurned(false);
        }, 1000);
      }
    }, 700);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-white py-12 px-4"
      style={{ position: "relative" }}
    >
      {/* Boneco SVG aparece atrás do card quando há erro */}
      {error && (
        <>
          <div
            style={{
              position: "absolute",
              top: "220px",
              left: "40%",
              transform: "translateX(-30%)",
              zIndex: 20,
              pointerEvents: "none",
            }}
          >
            <svg
              width="90"
              height="90"
              viewBox="0 0 90 90"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="45"
                cy="45"
                r="40"
                fill="#e11d1d"
                stroke="#222"
                stroke-width="4"
              />
              <path
                d="M25 32 Q32 25 39 32"
                stroke="#222"
                stroke-width="3"
                fill="none"
                stroke-linecap="round"
              />
              <path
                d="M51 34 Q58 32 65 34"
                stroke="#222"
                stroke-width="3"
                fill="none"
                stroke-linecap="round"
              />
              <ellipse
                cx="33"
                cy="43"
                rx="7"
                ry="10"
                fill="#fff"
                stroke="#222"
                stroke-width="2"
              />
              <ellipse
                cx="57"
                cy="43"
                rx="7"
                ry="10"
                fill="#fff"
                stroke="#222"
                stroke-width="2"
              />
              <circle cx="36" cy="46" r="3" fill="#222" />
              <circle cx="60" cy="46" r="3" fill="#222" />
              <path
                d="M35 65 Q45 60 55 65"
                stroke="#222"
                stroke-width="3"
                fill="none"
                stroke-linecap="round"
              />
              <rect
                x="20"
                y="70"
                width="10"
                height="15"
                rx="5"
                fill="#e11d1d"
                stroke="#222"
                stroke-width="2"
              />
              <rect
                x="60"
                y="70"
                width="10"
                height="15"
                rx="5"
                fill="#e11d1d"
                stroke="#222"
                stroke-width="2"
              />
            </svg>
            {/* Balão de fala */}
            <div
              style={{
                position: "absolute",
                left: "90%",
                top: "-90px",
                marginLeft: 0,
                background: "#fff",
                color: "#e11d1d",
                border: "2px solid #e11d1d",
                borderRadius: 12,
                padding: "8px 18px",
                fontWeight: 700,
                fontSize: 16,
                minWidth: 120,
                boxShadow: "0 2px 8px #0002",
                zIndex: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {error}
              {/* Triângulo do balão */}
              <span
                style={{
                  position: "absolute",
                  left: -7,
                  top: 78,
                  width: 0,
                  height: 0,
                  borderLeft: "10px solid transparent",
                  borderRight: "10px solid transparent",
                  borderTop: "18px solid #fff",
                  transform: "rotate(30deg)",
                }}
              />
            </div>
          </div>
        </>
      )}
      <div
        className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center animate-fadeIn"
        style={{
          boxShadow:
            "0 8px 32px 0 rgba(31, 38, 135, 0.18), 0 1.5px 8px 0 rgba(0,0,0,0.10)",
          border: "1.5px solid #f3f3f3",
          backdropFilter: "blur(0.5px)",
        }}
      >
        <div className="flex flex-col items-center mb-6 relative h-16">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              position: "relative",
              width: 90,
              justifyContent: "center",
            }}
          >
            <span
              style={{
                display: "inline-block",
                transition: "transform 0.5s cubic-bezier(0.2,0.8,0.4,1)",
                transform: lockOpen
                  ? "rotate(-25deg) scale(1.15)"
                  : lockLookKey
                  ? "rotate(20deg)"
                  : "none",
              }}
            >
              {lockOpen ? (
                <FaLockOpen
                  className="text-red-600 text-4xl mb-2"
                  style={{ zIndex: 2 }}
                />
              ) : (
                <FaLock
                  className={`text-red-600 text-4xl mb-2 ${
                    !lockLookKey ? "animate-bounce-slow" : ""
                  }`}
                  style={{ zIndex: 2 }}
                />
              )}
            </span>
            {showKey && (
              <FaKey
                className={`text-black text-3xl mb-2 ${
                  showKey ? "animate-key-fall" : ""
                }`}
                style={{
                  position: "absolute",
                  left: keyInserted ? 45 : 80,
                  top: "0%",
                  transform: keyTurned
                    ? "rotate(100deg) scaleX(0.2)"
                    : "rotate(40deg) scaleX(1)",
                  transformOrigin: "left 90%",
                  opacity: 1,
                  transition:
                    "left 0.6s cubic-bezier(0.2,0.8,0.4,1), top 0.6s cubic-bezier(0.2,0.8,0.4,1), transform 0.5s cubic-bezier(0.2,0.8,0.4,1)",
                  zIndex: 1,
                  animation: keyErrorShake ? "shake-key 0.7s" : "none",
                }}
              />
            )}
          </div>
        </div>
        <form className="w-full space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <FloatingInput
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              label="Usuário"
              autoFocus={!hasAutoFocused}
              onFocus={() => setHasAutoFocused(true)}
            />
            <div style={{ position: "relative" }}>
              <FloatingInput
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                label="Senha"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 rounded-xl text-lg font-bold text-white bg-gradient-to-r from-red-500 to-red-700 shadow-lg hover:scale-105 transition-all duration-200 tracking-wide uppercase"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.7s cubic-bezier(0.2,0.8,0.4,1); }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .animate-bounce-slow { animation: bounce-slow 1.2s infinite; }
        @keyframes key-fall {
          0% { opacity: 0; transform: translateY(-120px) rotate(40deg); }
          60% { opacity: 1; transform: translateY(10px) rotate(40deg); }
          80% { transform: translateY(-10px) rotate(40deg); }
          100% { opacity: 1; transform: translateY(0) rotate(40deg); }
        }
        .animate-key-fall { animation: key-fall 0.7s cubic-bezier(0.2,0.8,0.4,1); }
        @keyframes shake-key {
          0% { transform: translateY(-50%) rotate(40deg); }
          20% { transform: translateY(-50%) rotate(40deg) translateX(-5px); }
          40% { transform: translateY(-50%) rotate(40deg) translateX(5px); }
          60% { transform: translateY(-50%) rotate(40deg) translateX(-5px); }
          80% { transform: translateY(-50%) rotate(40deg) translateX(5px); }
          100% { transform: translateY(-50%) rotate(40deg); }
        }
      `}</style>
    </div>
  );
};

export default LoginAdmin;
