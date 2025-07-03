import React from 'react';
import '../../Style.css';

const Footer: React.FC = () => {
    return (
        <footer className="bottom-0 left-0 w-full z-20 bg-gray-900 text-white py-8 px-4 border-t border-gray-800">
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col md:flex-row justify-center items-center">
                    <p className="text-gray-400 text-sm mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()}{" "}
                        <span className="text-red-500 font-medium">
                            Rango Brabo</span>. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
