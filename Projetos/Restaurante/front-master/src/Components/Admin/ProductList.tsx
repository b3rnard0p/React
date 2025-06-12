import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../server/api.ts';
import type { Produto } from '../../Type.ts';
import '../../Style.css';

interface ProductListProps {
    onEdit: (produto: Produto) => void;
}

export function ProductList({ onEdit }: ProductListProps) {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/produtos/${id}`);
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['produtos'] });
            alert('Produto excluído com sucesso!');
        },
        onError: () => {
            alert('Erro ao excluir produto.');
        },
    });

    const { data, isError } = useQuery<Produto[]>({
        queryKey: ['produtos'],
        queryFn: async () => {
            const response = await api.get('/produtos');
            return response.data;
        },
    });

    if (isError) {
        return <p>Erro ao carregar produtos</p>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-2">Produtos</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data?.map((produto) => (
                    <div
                        key={produto.id}
                        className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200"
                    >
                        <img
                            src={produto.imagem}
                            alt={produto.nome}
                            className="w-full h-48 object-cover"
                        />

                        <div className="p-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">{produto.nome}</h2>

                            <div className="space-y-2 text-gray-600 mb-4">
                                <p><span className="font-medium">Descrição:</span> {produto.descricao}</p>
                                <p><span className="font-medium">Categoria:</span> {produto.categoria}</p>
                                <p className="text-red-600 font-bold text-lg">R$ {produto.preco.toFixed(2)}</p>
                                <p className={produto.disponibilidade ? "text-green-600" : "text-red-600"}>
                                    <span className="font-medium">Disponível:</span> {produto.disponibilidade ? 'Sim' : 'Não'}
                                </p>
                            </div>

                            <div className="flex space-x-2">
                                <button
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors duration-300"
                                    onClick={() => onEdit(produto)}
                                >
                                    Editar
                                </button>

                                <button
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors duration-300"
                                    onClick={() => {
                                        if (window.confirm(`Tem certeza que deseja excluir "${produto.nome}"?`)) {
                                            deleteMutation.mutate(produto.id);
                                        }
                                    }}
                                >
                                    Excluir
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
