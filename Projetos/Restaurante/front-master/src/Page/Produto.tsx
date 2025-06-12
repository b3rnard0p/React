import { useState } from 'react';
import type { Produto as ProdutoType } from '../Type.ts';
import { ProductForm } from '../Components/Admin/ProductForm.tsx';
import { ProductList } from '../Components/Admin/ProductList';
import { ProductEdit } from '../Components/Admin/ProductEdit';

interface ProdutoProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Produto({ isOpen, onClose }: ProdutoProps) {
    const [selectedProduct, setSelectedProduct] = useState<ProdutoType | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    function handleEditClick(produto: ProdutoType) {
        setSelectedProduct(produto);
        setIsEditOpen(true);
    }

    function closeEditModal() {
        setIsEditOpen(false);
        setSelectedProduct(null);
    }

    return (
        <>
            <ProductForm isOpen={isOpen} onClose={onClose} />

            <ProductList onEdit={handleEditClick} />

            {selectedProduct && (
                <ProductEdit
                    isOpen={isEditOpen}
                    onClose={closeEditModal}
                    produto={selectedProduct}
                />
            )}
        </>
    );
}
