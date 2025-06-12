import { useEffect, useState } from 'react';
import { api } from '../../server/api.ts';
import type { Pedido } from '../../Type.ts';
import '../../Style.css';

function PedidoList() {
    const [orders, setOrders] = useState<Pedido[]>([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/pedidos');
                console.log('Resposta de /pedidos:', response.data);

                const data = response.data;
                if (Array.isArray(data)) {
                    setOrders(data);
                }
                else if (Array.isArray(data.pedidos)) {
                    setOrders(data.pedidos);
                } else {
                    console.error("Formato inesperado:", data);
                    setOrders([]);
                }

            } catch (err) {
                console.error('Erro ao buscar pedidos:', err);
            }
        };
        fetchOrders();
    }, []);


    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Pedidos
            </h2>

            {orders.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-500 text-lg">Nenhum pedido encontrado.</p>
                </div>
            ) : (
                <ul className="space-y-4">
                    {orders.map(order => (
                        <li key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                            <div className="px-5 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                                <span className="font-semibold text-red-600">Pedido #{order.id}</span>
                                <span className="text-sm text-gray-500">
                                {new Date(order.data).toLocaleString('pt-BR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                            </div>

                            <ul className="divide-y divide-gray-100">
                                {order.produtos.map(ppp => (
                                    <li key={ppp.id} className="px-5 py-3 flex justify-between items-center">
                                        <span className="text-gray-800">{ppp.produto.nome}</span>
                                        <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                                        x{ppp.quantidade}
                                    </span>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default PedidoList;

