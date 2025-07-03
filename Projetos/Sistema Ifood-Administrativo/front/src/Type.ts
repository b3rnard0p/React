import type { ReactNode } from "react";

export type Produto = {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagem: string;
  categoria: string;
  disponibilidade: boolean;
};

export interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface EditProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  produto: Produto;
}

export interface ProductListProps {
  onEdit: (produto: Produto) => void;
}

export interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  children: ReactNode;
}

export interface ProdutoPorPedido {
  id: number;
  pedidoId: number;
  produtoId: number;
  produtoNome: string;
  precoUnitario: number;
  quantidade: number;
  customBurgerId?: number;
  customBurgerNome?: string;
  customBurgerIngredientes?: string[];
}

export interface Pedido {
  id: number;
  data: string;
  total: number;
  produtos: ProdutoPorPedido[];
  status: "PENDENTE" | "PREPARANDO" | "PRONTO" | "A_CAMINHO" | "ENTREGUE";
  nomeCliente: string;
  telefoneCliente: string;
  enderecoCliente: string;
  formaPagamento: "CARTAO" | "PIX" | "DINHEIRO";
}

export interface PedidoListProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ProdutoPedidoRequest {
  produtoId: number;
  quantidade: number;
  precoUnitario: number;
  customBurgerId?: number;
}

export interface CreatePedidoRequest {
  produtos: ProdutoPedidoRequest[];
  total: number;
  usuarioId: number;
  formaPagamento: "CARTAO" | "PIX" | "DINHEIRO";
}

export interface UpdateStatusPedidoRequest {
  status: "PENDENTE" | "PREPARANDO" | "PRONTO" | "A_CAMINHO" | "ENTREGUE";
}

export interface CreateProdutoRequest {
  nome: string;
  descricao: string;
  preco: number;
  imagem: string;
  categoria: string;
  disponibilidade: boolean;
}

export interface UpdateProdutoRequest {
  nome?: string;
  descricao?: string;
  preco?: number;
  imagem?: string;
  categoria?: string;
  disponibilidade?: boolean;
}

export interface GroupedItem {
  produto: Produto;
  quantidade: number;
}

export interface ComboCartItem {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagem: string;
  type: "combo";
  produtos: [Produto, Produto, Produto];
}

export interface CustomBurgerCartItem {
  id: string;
  nome: string;
  preco: number;
  quantidade: number;
  tipo: "custom-burger";
  customBurgerId: number;
  ingredientes: Ingrediente[];
}

export interface Ingrediente {
  id: number;
  nome: string;
  tipo: string;
  preco: number;
  estoque: number;
  ativo: boolean;
}

export type CartItem = Produto | ComboCartItem | CustomBurgerCartItem;

export interface CartContextData {
  cartItems: CartItem[];
  cartTotal: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number | string) => void;
  clearCart: () => void;
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  rua: string;
  numero: string;
  complemento: string;
  cidade: string;
  estado: string;
  cep: string;
  token?: string;
}

export interface CreateUsuarioRequest {
  nome: string;
  email: string;
  telefone: string;
  rua: string;
  numero: string;
  complemento: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface UpdateUsuarioRequest {
  nome?: string;
  email?: string;
  telefone?: string;
  rua?: string;
  numero?: string;
  complemento?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
}

export type Combo = {
  id: number;
  nome: string;
  descricao: string;
  produtoHamburguer: Produto;
  produtoBebida: Produto;
  produtoSobremesa: Produto;
  precoCombo: number;
  dataInicio?: string;
  dataFim?: string;
  ativo: boolean;
};
