import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AdminProvider } from "./Components/Admin/AdminContext";
import AdminHome from "./Components/Admin/AdminHome";
import ComboEdit from "./Components/Admin/Combo/ComboEdit";
import { ComboForm } from "./Components/Admin/Combo/ComboForm";
import ComboList from "./Components/Admin/Combo/ComboList";
import IngredienteEdit from "./Components/Admin/Ingrediente/IngredienteEdit";
import IngredienteForm from "./Components/Admin/Ingrediente/IngredienteForm";
import IngredienteList from "./Components/Admin/Ingrediente/IngredienteList";
import PedidoList from "./Components/Admin/PedidoList";
import ProductEdit from "./Components/Admin/Produto/ProductEdit";
import ProductForm from "./Components/Admin/Produto/ProductForm";
import ProductList from "./Components/Admin/Produto/ProductList.tsx";
import ProtectedRoute from "./Components/Admin/ProtectedRoute";
import Navbar from "./Components/Base/Navbar";
import { Cart } from "./Components/Usuario/Cart";
import { CartProvider } from "./Components/Usuario/Context";
import CustomBurgerBuilder from "./Components/Usuario/CustomBurgerBuilder";
import OrderTracking from "./Components/Usuario/OrderTracking.tsx";
import { Profile } from "./Components/Usuario/Profile";
import { UserProvider } from "./Components/Usuario/UserContext";
import { Cliente } from "./Page/Cliente.tsx";

import "./Style.css";

const AppRoutes = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === "/admin";
  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Cliente />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/carrinho" element={<Cart />} />
        <Route path="/tracking" element={<OrderTracking />} />
        <Route path="/monte-seu-hamburguer" element={<CustomBurgerBuilder />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/produtos"
          element={
            <ProtectedRoute>
              <ProductList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/insert"
          element={
            <ProtectedRoute>
              <ProductForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/edit/:id"
          element={
            <ProtectedRoute>
              <ProductEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/pedidos"
          element={
            <ProtectedRoute>
              <PedidoList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/combos"
          element={
            <ProtectedRoute>
              <ComboForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/combos/list"
          element={
            <ProtectedRoute>
              <ComboList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/combos/edit/:id"
          element={
            <ProtectedRoute>
              <ComboEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/ingredientes"
          element={
            <ProtectedRoute>
              <IngredienteList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/ingredientes/novo"
          element={
            <ProtectedRoute>
              <IngredienteForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/ingredientes/editar/:id"
          element={
            <ProtectedRoute>
              <IngredienteEdit />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

const App: React.FC = () => (
  <UserProvider>
    <AdminProvider>
      <CartProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </CartProvider>
    </AdminProvider>
  </UserProvider>
);

export default App;
