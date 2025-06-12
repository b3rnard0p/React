// src/Components/Usuario/UserList.tsx
import { useQuery } from '@tanstack/react-query';
import { api } from '../../server/api.ts';
import type { Produto } from '../../Type.ts';
import '../../Style.css';
import { useCart } from './Context';

export function UserProducts() {
    const { addToCart } = useCart();

    // Busca todos os produtos
    const { data, isError, isLoading } = useQuery<Produto[]>({
        queryKey: ['produtos'],
        queryFn: async () => {
            const response = await api.get('/produtos');
            return response.data;
        },
    });

    if (isLoading) {
        return <p>Carregando produtos...</p>;
    }

    if (isError) {
        return <p>Erro ao carregar produtos.</p>;
    }

    // Filtra apenas produtos com disponibilidade === true
    const disponiveis = data?.filter((produto) => produto.disponibilidade) || [];

    return (
        <div className="container mx-auto px-4 py-27">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Produtos Disponíveis
            </h1>

            {disponiveis.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-600 text-lg">Nenhum produto disponível no momento.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {disponiveis.map((produto) => (
                        <div
                            key={produto.id}
                            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 flex flex-col"
                        >
                            <div className="relative pt-[100%] bg-gray-100">
                                <img
                                    src={produto.imagem}
                                    alt={produto.nome}
                                    className="absolute top-0 left-0 w-full h-full object-cover"
                                />
                            </div>

                            <div className="p-4 flex-grow flex flex-col">
                                <h2 className="text-lg font-semibold text-gray-800 mb-2">{produto.nome}</h2>

                                <div className="text-sm text-gray-600 mb-4 space-y-2 flex-grow">
                                    <p>
                                        <span className="font-medium">Descrição:</span>
                                        <span className="line-clamp-2"> {produto.descricao}</span>
                                    </p>
                                    <p>
                                        <span className="font-medium">Categoria:</span> {produto.categoria}
                                    </p>
                                </div>

                                <div className="mt-auto">
                                    <p className="text-red-600 font-bold text-xl mb-4">
                                        R$ {produto.preco.toFixed(2).replace('.', ',')}
                                    </p>

                                    <button
                                        onClick={() => addToCart(produto)}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors duration-300 font-medium flex items-center justify-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Adicionar ao Carrinho
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}