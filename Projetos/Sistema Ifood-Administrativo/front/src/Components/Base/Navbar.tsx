import React, { useEffect, useRef, useState } from "react";
import { FaShoppingCart, FaSignOutAlt } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PedidoService } from "../../server/api";
import "../../Style.css";
import { useAdmin } from "../Admin/AdminContext";
import { useCart } from "../Usuario/Context";
import { useUser } from "../Usuario/UserContext";

interface NavbarProps {
  onNewProduct: () => void;
}

// Variantes de animação para o menu
const menuVariants = {
  hidden: {
    height: 0,
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeInOut" as const,
      when: "afterChildren",
    },
  },
  visible: {
    height: "auto",
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: "easeInOut" as const,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
};

const Navbar: React.FC = () => {
  const { cartItems } = useCart();
  const { hasUser, user } = useUser();
  const { isAuthenticated, logout } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [underline, setUnderline] = useState({ left: 0, width: 0 });
  const activeUnderline = useRef({ left: 0, width: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const [isMouseInNavbar, setIsMouseInNavbar] = useState(false);
  const [unseenOrders, setUnseenOrders] = useState(0);
  const menuMobileRef = useRef<HTMLDivElement>(null);

  const categorias = ["Hambúrguer", "Bebida", "Sobremesa"];

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target as Node) &&
        menuMobileRef.current &&
        !menuMobileRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (menuRef.current) {
      const logoEl =
        menuRef.current.querySelector<HTMLImageElement>('img[alt="Logo"]');
      if (logoEl) {
        const containerRect = menuRef.current.getBoundingClientRect();
        const rect = logoEl.getBoundingClientRect();
        setUnderline({
          left: rect.left - containerRect.left,
          width: rect.width,
        });
      }
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!menuRef.current) return;
      let selector: HTMLElement | null = null;

      // Sempre tenta encontrar o link ativo
      const links = menuRef.current.querySelectorAll("a, button");
      links.forEach((el) => {
        if (
          (el instanceof HTMLAnchorElement &&
            el.pathname === location.pathname) ||
          (el instanceof HTMLButtonElement && el.dataset.active === "true")
        ) {
          selector = el;
        }
      });

      // Se não achou link ativo OU está em /, /admin ou /monte-seu-hamburguer, underline no logo
      if (
        !selector ||
        location.pathname === "/" ||
        location.pathname === "/admin" ||
        location.pathname === "/monte-seu-hamburguer"
      ) {
        selector = menuRef.current.querySelector('img[alt="Logo"]');
      }

      if (selector) {
        const containerRect = menuRef.current.getBoundingClientRect();
        const rect = selector.getBoundingClientRect();
        const pos = { left: rect.left - containerRect.left, width: rect.width };
        setUnderline(pos);
        activeUnderline.current = pos;
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, [location.pathname]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (!menuRef.current) return;
    setIsMouseInNavbar(true);
    const containerRect = menuRef.current.getBoundingClientRect();
    const targetRect = e.currentTarget.getBoundingClientRect();
    setUnderline({
      left: targetRect.left - containerRect.left,
      width: targetRect.width,
    });
  };

  const handleNavbarMouseLeave = () => {
    setIsMouseInNavbar(false);
    setUnderline(activeUnderline.current);
  };

  const handleNewProductClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate("/admin/insert");
  };

  const handleLogoClick = () => {
    const currentPath = location.pathname;
    if (isAdminRoute) {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  const handleCategoriaClick = (categoria: string) => {
    const id = `categoria-${categoria.toLowerCase().replace(/\s+/g, "-")}`;
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const showTracking = [
    "/",
    "/produtos",
    "/carrinho",
    "/tracking",
    "/perfil",
    "/monte-seu-hamburguer",
  ].includes(location.pathname);

  const handleLogout = () => {
    logout();
    navigate("/admin");
  };

  // Mover o cálculo de isAdminRoute para cá, após todos os hooks
  const isAdminRoute = location.pathname.startsWith("/admin");

  // Atualiza contador de pedidos não vistos
  useEffect(() => {
    async function checkUnseenOrders() {
      if (isAdminRoute) {
        try {
          const pedidos = await PedidoService.listarPedidos();
          const lastSeen = Number(
            localStorage.getItem("admin_last_seen_order_id") || 0
          );
          const maxId =
            pedidos.length > 0 ? Math.max(...pedidos.map((p) => p.id)) : 0;
          const novos = pedidos.filter((p) => p.id > lastSeen).length;
          setUnseenOrders(novos);
        } catch {}
      }
    }
    checkUnseenOrders();
    // Opcional: atualizar a cada X segundos
    const interval = setInterval(checkUnseenOrders, 10000);
    return () => clearInterval(interval);
  }, [isAdminRoute]);

  // Zera contador ao entrar na tela de pedidos
  useEffect(() => {
    if (location.pathname === "/admin/pedidos") {
      PedidoService.listarPedidos().then((pedidos) => {
        const maxId =
          pedidos.length > 0 ? Math.max(...pedidos.map((p) => p.id)) : 0;
        localStorage.setItem("admin_last_seen_order_id", String(maxId));
        setUnseenOrders(0);
      });
    }
  }, [location.pathname]);

  // Só agora, depois de todos os hooks, faz o return condicional
  if (isAdminRoute && !isAuthenticated) {
    return null;
  }

  return (
    <>
      <nav className="w-full z-10 left-0 right-0 ">
        <div
          className="flex items-center justify-between h-20 px-6 relative"
          ref={menuRef}
          onMouseLeave={handleNavbarMouseLeave}
        >
          <span
            className="absolute bottom-5 h-0.5 bg-red-500 transition-all duration-300 hidden md:block"
            style={{ left: underline.left, width: underline.width }}
          />

          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              src="/icon.webp"
              alt="Logo"
              className="h-12 w-auto cursor-pointer transition-transform hover:scale-105"
              onClick={handleLogoClick}
              onMouseEnter={handleMouseEnter}
            />
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center flex-1">
            {isAdminRoute ? (
              <div className="flex items-center justify-center w-full">
                <div className="flex flex-1 justify-center items-center space-x-8">
                  <Link
                    to="/admin/insert"
                    className="nav-link text-white hover:text-red-500 transition-colors duration-300 font-semibold text-lg flex items-center"
                    onClick={handleNewProductClick}
                    onMouseEnter={handleMouseEnter}
                    data-active={location.pathname === "/admin/insert"}
                  >
                    <span className="mr-1 text-xl"></span> Cadastrar Produto
                  </Link>
                  <Link
                    to="/admin/combos"
                    className="nav-link text-white hover:text-red-500 transition-colors duration-300 font-semibold text-lg flex items-center"
                    onMouseEnter={handleMouseEnter}
                    data-active={location.pathname === "/admin/combos"}
                  >
                    Cadastrar Combo
                  </Link>
                  <Link
                    to="/admin/ingredientes/novo"
                    className="nav-link text-white hover:text-red-500 transition-colors duration-300 font-semibold text-lg"
                    onMouseEnter={handleMouseEnter}
                    data-active={
                      location.pathname === "/admin/ingredientes/novo"
                    }
                  >
                    Cadastrar Ingrediente
                  </Link>
                  <Link
                    to="/admin/combos/list"
                    className="nav-link text-white hover:text-red-500 transition-colors duration-300 font-semibold text-lg flex items-center"
                    onMouseEnter={handleMouseEnter}
                    data-active={location.pathname === "/admin/combos/list"}
                  >
                    Combos
                  </Link>
                  <Link
                    to="/admin/ingredientes"
                    className="nav-link text-white hover:text-red-500 transition-colors duration-300 font-semibold text-lg"
                    onMouseEnter={handleMouseEnter}
                    data-active={location.pathname === "/admin/ingredientes"}
                  >
                    Ingredientes
                  </Link>
                  <Link
                    to="/admin/produtos"
                    className="nav-link text-white hover:text-red-500 transition-colors duration-300 font-semibold text-lg"
                    onMouseEnter={handleMouseEnter}
                    data-active={location.pathname === "/admin/produtos"}
                  >
                    Produtos
                  </Link>
                  <Link
                    to="/admin/pedidos"
                    className="nav-link text-white hover:text-red-500 transition-colors duration-300 font-semibold text-lg relative"
                    onMouseEnter={handleMouseEnter}
                    data-active={location.pathname === "/admin/pedidos"}
                  >
                    Pedidos
                    {unseenOrders > 0 && (
                      <span className="absolute -top-2 -right-6 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse shadow-lg">
                        {unseenOrders}
                      </span>
                    )}
                  </Link>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-8 text-white hover:text-red-500 transition-colors duration-300 text-2xl"
                  title="Sair"
                  onMouseEnter={handleMouseEnter}
                >
                  <FaSignOutAlt />
                </button>
              </div>
            ) : (
              <>
                {![
                  "/carrinho",
                  "/tracking",
                  "/perfil",
                  "/monte-seu-hamburguer",
                ].includes(location.pathname) && (
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center w-auto">
                    <div className="flex space-x-9">
                      {categorias.map((categoria) => (
                        <button
                          key={categoria}
                          className="nav-link text-white hover:text-red-500 transition-colors duration-300 font-semibold text-lg whitespace-nowrap bg-transparent border-none"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            const id = `categoria-${categoria
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`;
                            document
                              .getElementById(id)
                              ?.scrollIntoView({ behavior: "smooth" });
                          }}
                        >
                          {categoria}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Links - Lado direito */}
                <div className="flex items-center space-x-6 ml-auto">
                  {showTracking && (
                    <Link
                      to="/tracking"
                      className="nav-link text-white hover:text-red-500 transition-colors duration-300 font-semibold text-lg"
                      onMouseEnter={handleMouseEnter}
                      data-active={location.pathname === "/tracking"}
                      onClick={(e) => {
                        setTimeout(() => setIsMenuOpen(false), 100);
                      }}
                    >
                      Pedidos
                    </Link>
                  )}
                  <Link
                    to="/carrinho"
                    className="nav-link text-white hover:text-red-500 transition-colors duration-300 font-semibold text-lg relative flex items-center justify-center"
                    onMouseEnter={handleMouseEnter}
                    data-active={location.pathname === "/carrinho"}
                  >
                    <FaShoppingCart className="text-2xl" />
                    {cartItems.length > 0 && (
                      <span className="absolute -top-3 -right-6 bg-red-600 text-white text-sm font-bold rounded-full h-6 w-6 flex items-center justify-center">
                        {cartItems.length}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/perfil"
                    className="nav-link text-white hover:text-red-500 transition-colors duration-300 font-semibold text-lg relative flex items-center justify-center"
                    onMouseEnter={handleMouseEnter}
                    data-active={location.pathname === "/perfil"}
                    style={{
                      minWidth: 40,
                      minHeight: 40,
                      top: "-6px",
                      position: "relative",
                    }}
                  >
                    {hasUser && user?.nome ? (
                      <span className="bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg uppercase border-2 border-white shadow">
                        {user.nome.charAt(0)}
                      </span>
                    ) : (
                      <span className="bg-gray-300 text-gray-600 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg uppercase border-2 border-white shadow">
                        ?
                      </span>
                    )}
                    {!hasUser && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                        !
                      </span>
                    )}
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Menu Mobile - Hamburger */}
          <button
            ref={hamburgerRef}
            className="md:hidden hamburger focus:outline-none"
            onClick={toggleMenu}
            aria-label="Menu"
          >
            <span
              className={`block w-7 h-0.5 bg-white my-1.5 transition-all duration-300 ${
                isMenuOpen ? "transform rotate-45 translate-y-2" : ""
              }`}
            ></span>
            <span
              className={`block w-7 h-0.5 bg-white my-1.5 transition-all duration-300 ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`block w-7 h-0.5 bg-white my-1.5 transition-all duration-300 ${
                isMenuOpen ? "transform -rotate-45 -translate-y-2" : ""
              }`}
            ></span>
          </button>
        </div>
      </nav>
      {isMenuOpen && (
        <div
          ref={menuMobileRef}
          className="md:hidden w-full flex flex-col items-center py-6 space-y-6 mb-6"
        >
          {isAdminRoute ? (
            <>
              <Link
                to="/admin/insert"
                className="text-black text-xl font-bold py-2 hover:text-red-400 transition animate-fade-in-down"
                style={{ animationDelay: "0.10s", animationFillMode: "both" }}
                onClick={() => setTimeout(() => setIsMenuOpen(false), 100)}
              >
                Cadastrar Produto
              </Link>
              <Link
                to="/admin/combos"
                className="text-black text-xl font-bold py-2 hover:text-red-400 transition animate-fade-in-down"
                style={{ animationDelay: "0.16s", animationFillMode: "both" }}
                onClick={() => setTimeout(() => setIsMenuOpen(false), 100)}
              >
                Cadastrar Combo
              </Link>
              <Link
                to="/admin/ingredientes/novo"
                className="text-black text-xl font-bold py-2 hover:text-red-400 transition animate-fade-in-down"
                style={{ animationDelay: "0.22s", animationFillMode: "both" }}
                onClick={() => setTimeout(() => setIsMenuOpen(false), 100)}
              >
                Cadastrar Ingrediente
              </Link>
              <Link
                to="/admin/combos/list"
                className="text-black text-xl font-bold py-2 hover:text-red-400 transition animate-fade-in-down"
                style={{ animationDelay: "0.28s", animationFillMode: "both" }}
                onClick={() => setTimeout(() => setIsMenuOpen(false), 100)}
              >
                Combos
              </Link>
              <Link
                to="/admin/ingredientes"
                className="text-black text-xl font-bold py-2 hover:text-red-400 transition animate-fade-in-down"
                style={{ animationDelay: "0.34s", animationFillMode: "both" }}
                onClick={() => setTimeout(() => setIsMenuOpen(false), 100)}
              >
                Ingredientes
              </Link>
              <Link
                to="/admin/produtos"
                className="text-black text-xl font-bold py-2 hover:text-red-400 transition animate-fade-in-down"
                style={{ animationDelay: "0.40s", animationFillMode: "both" }}
                onClick={() => setTimeout(() => setIsMenuOpen(false), 100)}
              >
                Produtos
              </Link>
              <Link
                to="/admin/pedidos"
                className="text-black text-xl font-bold py-2 hover:text-red-400 transition animate-fade-in-down"
                style={{ animationDelay: "0.46s", animationFillMode: "both" }}
                onClick={() => setTimeout(() => setIsMenuOpen(false), 100)}
              >
                Pedidos
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setTimeout(() => setIsMenuOpen(false), 100);
                }}
                className="text-black text-xl font-bold py-2 hover:text-red-400 transition animate-fade-in-down"
                style={{ animationDelay: "0.52s", animationFillMode: "both" }}
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link
                to="/tracking"
                className="text-black text-xl font-bold py-2 hover:text-red-400 transition animate-fade-in-down"
                style={{ animationDelay: "0.18s", animationFillMode: "both" }}
                onClick={(e) => {
                  setTimeout(() => setIsMenuOpen(false), 100);
                }}
              >
                Pedidos
              </Link>
              <Link
                to="/carrinho"
                className="text-black text-xl font-bold py-2 hover:text-red-400 transition animate-fade-in-down"
                style={{ animationDelay: "0.31s", animationFillMode: "both" }}
                onClick={(e) => {
                  setTimeout(() => setIsMenuOpen(false), 100);
                }}
              >
                Carrinho
              </Link>
              <Link
                to="/perfil"
                className="text-black text-xl font-bold py-2 hover:text-red-400 transition animate-fade-in-down"
                style={{ animationDelay: "0.44s", animationFillMode: "both" }}
                onClick={(e) => {
                  setTimeout(() => setIsMenuOpen(false), 100);
                }}
              >
                Perfil
              </Link>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
