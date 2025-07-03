import React from "react";
import {
  FaBoxOpen,
  FaClipboardList,
  FaLayerGroup,
  FaLeaf,
  FaPlus,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "./AdminContext";

const adminLinks = [
  {
    label: "Produtos",
    icon: <FaBoxOpen size={36} className="text-red-600" />,
    to: "/admin/produtos",
    color: "from-red-100 to-red-200",
  },
  {
    label: "Pedidos",
    icon: <FaClipboardList size={36} className="text-red-600" />,
    to: "/admin/pedidos",
    color: "from-green-100 to-green-200",
  },
  {
    label: "Ingredientes",
    icon: <FaLeaf size={36} className="text-red-600" />,
    to: "/admin/ingredientes",
    color: "from-yellow-100 to-yellow-200",
  },
  {
    label: "Combos",
    icon: <FaLayerGroup size={36} className="text-red-600" />,
    to: "/admin/combos/list",
    color: "from-blue-100 to-blue-200",
  },
  {
    label: "Cadastrar Produto",
    icon: <FaPlus size={36} className="text-red-600" />,
    to: "/admin/insert",
    color: "from-purple-100 to-purple-200",
  },
  {
    label: "Cadastrar Combo",
    icon: <FaPlus size={36} className="text-red-600" />,
    to: "/admin/combos",
    color: "from-pink-100 to-pink-200",
  },
  {
    label: "Cadastrar Ingrediente",
    icon: <FaPlus size={36} className="text-red-600" />,
    to: "/admin/ingredientes/novo",
    color: "from-orange-100 to-orange-200",
  },
];

const AdminHome: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAdmin();
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black to-white">
      {/* Topbar igual ao Navbar */}
      <div className="w-full flex items-center justify-between h-20 px-6 relative z-10">
        <div className="flex-shrink-0">
          <img
            src="/icon.webp"
            alt="Logo"
            className="h-12 w-auto cursor-pointer transition-transform hover:scale-105"
            onClick={() => navigate("/admin")}
          />
        </div>
        <button
          onClick={() => {
            logout();
            navigate("/admin");
          }}
          className="ml-8 text-white hover:text-red-500 transition-colors duration-300 text-2xl"
          title="Sair"
        >
          <FaSignOutAlt />
        </button>
      </div>
      {/* Grid de cards centralizado */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {/* Card de Pedidos centralizado acima */}
        <div className="w-full max-w-5xl mb-10 px-4">
          {adminLinks
            .filter((link) => link.label === "Pedidos")
            .map((link) => (
              <button
                key={link.to}
                onClick={() => navigate(link.to)}
                className="flex flex-col items-center justify-center p-8 rounded-3xl shadow-2xl bg-white border-2 border-red-200 hover:shadow-red-200 hover:scale-105 transition-all duration-200 group focus:outline-none focus:ring-4 focus:ring-green-200 min-h-[220px] w-full"
              >
                <div className="mb-4 drop-shadow-lg">{link.icon}</div>
                <span className="text-xl font-bold text-gray-800 group-hover:text-red-700 transition-colors duration-200 text-center">
                  {link.label}
                </span>
              </button>
            ))}
        </div>
        {/* Os outros 6 cards em grid 3x2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 w-full max-w-5xl px-4">
          {adminLinks
            .filter((link) => link.label !== "Pedidos")
            .map((link) => (
              <button
                key={link.to}
                onClick={() => navigate(link.to)}
                className="flex flex-col items-center justify-center p-8 rounded-3xl shadow-2xl bg-white border-2 border-red-200 hover:shadow-red-200 hover:scale-105 transition-all duration-200 group focus:outline-none focus:ring-4 focus:ring-red-200 min-h-[220px]"
              >
                <div className="mb-4 drop-shadow-lg">{link.icon}</div>
                <span className="text-xl font-bold text-gray-800 group-hover:text-red-700 transition-colors duration-200 text-center">
                  {link.label}
                </span>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
