export type Produto = {
    id: number
    nome: string
    descricao:string
    preco:number
    imagem:string
    categoria:string
    disponibilidade: boolean
}

export interface ProductFormProps {
    isOpen: boolean;
    onClose: () => void;
}

export interface ProdutoPorPedido {
    id: number;
    produto: Produto;
    quantidade: number;
}

export interface Pedido {
    id: number;
    data: string; // ISO 8601
    produtos: ProdutoPorPedido[];
}
