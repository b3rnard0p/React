// src/Components/Produto/ProductEdit.tsx

import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../server/api.ts';
import type { Produto } from '../../Type.ts';
import '../../Style.css';

interface EditProductFormProps {
    isOpen: boolean;
    onClose: () => void;
    produto: Produto;
}

export function ProductEdit({ isOpen, onClose, produto }: EditProductFormProps) {
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState<Omit<Produto, 'id'>>({
        nome: '',
        descricao: '',
        preco: 0,
        imagem: '',
        categoria: '',
        disponibilidade: true,
    });

    useEffect(() => {
        if (produto) {
            setFormData({
                nome: produto.nome,
                descricao: produto.descricao,
                preco: produto.preco,
                imagem: produto.imagem,
                categoria: produto.categoria,
                disponibilidade: produto.disponibilidade,
            });
        }
    }, [produto]);

    const mutation = useMutation({
        mutationFn: async (dadosAtualizados: Omit<Produto, 'id'>) => {
            const response = await api.put(`/produtos/${produto.id}`, dadosAtualizados);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['produtos'] });
            alert('Produto atualizado com sucesso!');
            onClose();
        },
        onError: () => {
            alert('Erro ao atualizar produto.');
        },
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, type, value, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                type === 'checkbox'
                    ? checked
                    : name === 'preco'
                        ? Number(value)
                        : value,
        }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        mutation.mutate(formData);
    }

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto relative border border-gray-200"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-3xl font-light transition-colors duration-200"
                    onClick={onClose}
                    aria-label="Fechar modal"
                >
                    &times;
                </button>

                <form
                    className="p-6 space-y-4"
                    onSubmit={handleSubmit}
                >
                    <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar Produto
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                            <input
                                id="nome"
                                name="nome"
                                placeholder="Nome do produto"
                                value={formData.nome}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                            <input
                                id="descricao"
                                name="descricao"
                                placeholder="Descrição do produto"
                                value={formData.descricao}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="imagem" className="block text-sm font-medium text-gray-700 mb-1">Link Imagem</label>
                            <input
                                id="imagem"
                                name="imagem"
                                placeholder="https://exemplo.com/imagem.jpg"
                                value={formData.imagem}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                            <input
                                id="categoria"
                                name="categoria"
                                placeholder="Categoria do produto"
                                value={formData.categoria}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="preco" className="block text-sm font-medium text-gray-700 mb-1">Preço</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-gray-500">R$</span>
                                <input
                                    id="preco"
                                    name="preco"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    value={formData.preco}
                                    onChange={handleChange}
                                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                id="disponibilidade"
                                name="disponibilidade"
                                type="checkbox"
                                checked={formData.disponibilidade}
                                onChange={handleChange}
                                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                            />
                            <label htmlFor="disponibilidade" className="ml-2 block text-sm text-gray-700">Disponível</label>
                        </div>
                    </div>

                    <div className="pt-4 flex space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex-1"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200 flex-1 flex items-center justify-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Salvar Alterações
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
