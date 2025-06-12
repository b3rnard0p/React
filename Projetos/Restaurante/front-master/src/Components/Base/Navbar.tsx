// src/Components/Navbar/Navbar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../Usuario/Context';
import '../../Style.css';

interface NavbarProps {
    onNewProduct: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNewProduct }) => {
    const { cartItems } = useCart();
    const location = useLocation();

    const handleNewProductClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        onNewProduct();
    };

    return (
        <nav className="bg-black bg-opacity-30 backdrop-blur-sm fixed w-full z-10 border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <Link
                            to="/"
                            className="text-white font-bold text-xl hover:text-red-500 transition-colors duration-300"
                        >
                            Comida <span className="text-red-500">ruim</span>
                        </Link>
                    </div>
                    <div className="actions flex space-x-6">
                        {['/', '/pedidos'].includes(location.pathname) ? (
                            <>
                                <a
                                    href="#"
                                    className="nav-link text-white hover:text-red-500 transition-colors duration-300 font-medium flex items-center"
                                    onClick={handleNewProductClick}
                                >
                                    <span className="mr-1">+</span> Novo Produto
                                </a>
                                <Link
                                    to="/pedidos"
                                    className="nav-link text-white hover:text-red-500 transition-colors duration-300 font-medium"
                                >
                                    Pedidos
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/produtos"
                                    className="nav-link text-white hover:text-red-500 transition-colors duration-300 font-medium"
                                >
                                    Produtos
                                </Link>
                                <Link
                                    to="/carrinho"
                                    className="nav-link text-white hover:text-red-500 transition-colors duration-300 font-medium relative"
                                >
                                    Carrinho
                                    <span className="absolute -top-2 -right-5 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartItems.length}
                                </span>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
