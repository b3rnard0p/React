import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../server/api.ts';
import type { Produto } from '../../Type.ts';
import '../../Style.css';

interface ProductFormProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ProductForm({ isOpen, onClose }: ProductFormProps) {
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState<Omit<Produto, 'id'>>({
        nome: '',
        descricao: '',
        preco: 0,
        imagem: '',
        categoria: '',
        disponibilidade: true,
    });

    const mutation = useMutation({
        mutationFn: async (novoProduto: Omit<Produto, 'id'>) => {
            const response = await api.post('/produtos', novoProduto);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['produtos'] });
            alert('Produto cadastrado com sucesso!');
            onClose();
        },
        onError: () => {
            alert('Erro ao cadastrar produto.');
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
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-3xl font-light transition-colors duration-200"
                    onClick={onClose}
                >
                    &times;
                </button>

                <form
                    className="p-6 space-y-4"
                    onSubmit={handleSubmit}
                >
                    <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Cadastrar Novo Produto</h2>

                    <div className="space-y-1">
                        <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome</label>
                        <input
                            id="nome"
                            name="nome"
                            placeholder="Nome"
                            value={formData.nome}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">Descrição</label>
                        <input
                            id="descricao"
                            name="descricao"
                            placeholder="Descrição"
                            value={formData.descricao}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="imagem" className="block text-sm font-medium text-gray-700">Link Imagem</label>
                        <input
                            id="imagem"
                            name="imagem"
                            placeholder="URL da Imagem"
                            value={formData.imagem}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">Categoria</label>
                        <input
                            id="categoria"
                            name="categoria"
                            placeholder="Categoria"
                            value={formData.categoria}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="preco" className="block text-sm font-medium text-gray-700">Preço</label>
                        <input
                            id="preco"
                            name="preco"
                            type="number"
                            placeholder="Preço"
                            value={formData.preco}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            id="disponibilidade"
                            name="disponibilidade"
                            type="checkbox"
                            checked={formData.disponibilidade}
                            onChange={handleChange}
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <label htmlFor="disponibilidade" className="block text-sm font-medium text-gray-700">Disponível</label>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors duration-300 font-medium"
                    >
                        Cadastrar
                    </button>
                </form>
            </div>
        </div>
    );
}
