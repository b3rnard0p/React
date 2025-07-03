import axios from "axios";
import type {
  CreatePedidoRequest,
  CreateProdutoRequest,
  CreateUsuarioRequest,
  Pedido,
  Produto,
  UpdateProdutoRequest,
  UpdateStatusPedidoRequest,
  UpdateUsuarioRequest,
  Usuario,
} from "../Type";

export const api = axios.create({
  baseURL: "http://localhost:8080",
});

// Interceptor para adicionar token de admin nas requisições
api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem("adminToken");
  // Só adiciona o token se a rota for de admin
  if (adminToken && config.url && config.url.startsWith("/api/admin/")) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }
  return config;
});

export const PedidoService = {
  listarPedidos: async (): Promise<Pedido[]> => {
    const response = await api.get("/api/admin/pedidos");
    return Array.isArray(response.data) ? response.data : response.data.pedidos;
  },

  listarPedidosCliente: async (usuarioId: number): Promise<Pedido[]> => {
    const response = await api.get(
      `/api/cliente/pedidos?usuarioId=${usuarioId}`
    );
    return response.data;
  },

  criarPedido: async (pedido: CreatePedidoRequest): Promise<Pedido> => {
    const response = await api.post("/api/cliente/pedidos", pedido);
    return response.data;
  },
  atualizarStatus: async (
    pedidoId: number,
    status: UpdateStatusPedidoRequest
  ): Promise<void> => {
    try {
      const response = await api.patch(
        `/api/admin/pedidos/${pedidoId}/status`,
        status
      );
    } catch (error: any) {
      console.error("❌ Erro ao atualizar status:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
        },
      });
      throw error;
    }
  },
};

export const ProdutoService = {
  criarProduto: async (produto: CreateProdutoRequest): Promise<void> => {
    await api.post("/api/admin/produtos", produto);
  },

  atualizarProduto: async (
    id: number,
    dadosAtualizados: UpdateProdutoRequest
  ): Promise<Produto> => {
    const response = await api.put(
      `/api/admin/produtos/${id}`,
      dadosAtualizados
    );
    return response.data;
  },

  excluirProduto: async (id: number): Promise<void> => {
    await api.delete(`/api/admin/produtos/${id}`);
  },
  listarProdutos: async (): Promise<Produto[]> => {
    const response = await api.get("/api/cliente/produtos");
    return response.data;
  },

  getProdutoById: async (id: number): Promise<Produto> => {
    const response = await api.get(`/api/admin/produtos/${id}`);
    return response.data;
  },

  getProdutoByIdAdmin: async (id: number): Promise<Produto> => {
    const response = await api.get(`/api/admin/produtos/${id}`);
    return response.data;
  },
};

export const UsuarioService = {
  buscarPorId: async (id: number): Promise<Usuario> => {
    const response = await api.get(`/api/cliente/usuarios/${id}`);
    return response.data;
  },

  buscarPorEmail: async (email: string): Promise<Usuario> => {
    const response = await api.get(`/api/cliente/usuarios/email/${email}`);
    return response.data;
  },

  criarUsuario: async (usuario: CreateUsuarioRequest): Promise<Usuario> => {
    const response = await api.post("/api/cliente/usuarios", usuario);
    return response.data;
  },

  buscarPorToken: async (): Promise<Usuario> => {
    const response = await api.get("/api/cliente/usuarios/token", {
      withCredentials: true,
    });
    return response.data;
  },

  atualizarUsuario: async (
    id: number,
    dadosAtualizados: UpdateUsuarioRequest
  ): Promise<Usuario> => {
    const response = await api.put(
      `/api/cliente/usuarios/${id}`,
      dadosAtualizados
    );
    return response.data;
  },

  deletarUsuario: async (id: number): Promise<void> => {
    await api.delete(`/api/admin/usuarios/${id}`);
  },
};

export const AuthService = {
  login: async (username: string, password: string) => {
    const response = await api.post("/api/auth/login", { username, password });
    return response.data;
  },
};

export const ComboService = {
  listarCombos: async (): Promise<any[]> => {
    const response = await api.get("/api/cliente/combos/ativos");
    return response.data;
  },
  excluirCombo: async (id: number): Promise<void> => {
    await api.delete(`/api/admin/combos/${id}`);
  },
  getComboById: async (id: number): Promise<any> => {
    const response = await api.get(`/api/admin/combos/${id}`);
    return response.data;
  },
  listarTodosCombosAdmin: async (): Promise<any[]> => {
    const response = await api.get("/api/admin/combos");
    return response.data;
  },
};

export const IngredienteService = {
  listarIngredientes: async (): Promise<any[]> => {
    const response = await api.get("/api/cliente/ingredientes");
    return response.data;
  },
  listarIngredientesAdmin: async (): Promise<any[]> => {
    const response = await api.get("/api/admin/ingredientes");
    return response.data;
  },
  getIngredienteByIdAdmin: async (id: number): Promise<any> => {
    const response = await api.get(`/api/admin/ingredientes/${id}`);
    return response.data;
  },
};
