import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import {
  FaCheck,
  FaGlassMartiniAlt,
  FaHamburger,
  FaIceCream,
  FaTimes,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { ProdutoService } from "../../../server/api.ts";
import "../../../Style.css";
import type { UpdateProdutoRequest } from "../../../Type.ts";

// FloatingInput igual ao LoginAdmin
type FloatingInputProps = {
  id: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  placeholder: string;
  autoFocus?: boolean;
  min?: number;
  step?: string | number;
};

const FloatingInput: React.FC<FloatingInputProps> = ({
  id,
  type = "text",
  value,
  onChange,
  label,
  placeholder,
  autoFocus = false,
  min,
  step,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const isActive =
    isFocused || (typeof value === "string" ? value.length > 0 : value !== 0);
  return (
    <div className="relative mt-6 mb-6">
      <input
        id={id}
        name={id}
        type={type}
        autoFocus={autoFocus}
        value={value}
        onChange={onChange}
        required
        min={min}
        step={step}
        className={`block w-full px-4 py-3 rounded-xl border-2 focus:outline-none text-base text-black font-semibold bg-white/80 transition-all duration-200 peer ${
          isActive ? "border-red-600" : "border-red-200"
        }`}
        placeholder=" "
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <span
        className={`absolute left-6 transition-all duration-200 font-semibold pointer-events-none px-3
          ${
            isActive
              ? "text-xs text-red-600 bg-white"
              : "text-base text-gray-500 bg-transparent"
          }
        `}
        style={{
          top: isActive ? -6 : "50%",
          transform: isActive ? "translateY(0)" : "translateY(-50%)",
          zIndex: 2,
          lineHeight: 1,
          boxShadow: isActive ? "0 0 0 6px #fff" : undefined,
        }}
      >
        {label}
      </span>
    </div>
  );
};

export default function ProductEdit() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState<Omit<UpdateProdutoRequest, "id">>({
    nome: "",
    descricao: "",
    preco: 0,
    imagem: "",
    categoria: "",
    disponibilidade: true,
  });

  useEffect(() => {
    // Buscar produto pelo id se necessário (pode ser melhorado para buscar do cache)
    async function fetchProduto() {
      if (!id) return;
      const produto = await ProdutoService.getProdutoByIdAdmin(Number(id));
      setFormData({
        nome: produto.nome,
        descricao: produto.descricao,
        preco: produto.preco,
        imagem: produto.imagem,
        categoria: produto.categoria,
        disponibilidade: produto.disponibilidade,
      });
    }
    fetchProduto();
  }, [id]);

  const mutation = useMutation({
    mutationFn: (dadosAtualizados: UpdateProdutoRequest) =>
      ProdutoService.atualizarProduto(Number(id), dadosAtualizados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
      navigate("/admin/produtos");
    }
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "preco"
          ? Number(value)
          : value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate(formData);
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center py-12 px-4">
      {/* Seta de voltar */}
      <div className="flex items-center justify-between w-full max-w-md mb-6">
        <a
          href="/admin"
          className="text-white hover:text-red-600 transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </a>
        <div className="flex-1"></div>
      </div>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center">
        <form className="w-full space-y-5" onSubmit={handleSubmit}>
          <div className="relative flex items-center mb-4 pb-2 border-b min-h-[40px]">
            <h2 className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold text-red-700 text-center w-max">
              Edição
            </h2>
            <div className="ml-auto">
              <button
                type="button"
                className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none shadow-md border-2
                  ${
                    formData.disponibilidade
                      ? "bg-green-950 border-green-950"
                      : "bg-red-950 border-red-950"
                  }`}
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    disponibilidade: !prev.disponibilidade,
                  }))
                }
                title={
                  formData.disponibilidade
                    ? "Marcar como indisponível"
                    : "Marcar como disponível"
                }
              >
                <span
                  className={`absolute left-1 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white shadow-lg flex items-center justify-center transition-transform duration-300
                    ${
                      formData.disponibilidade
                        ? "translate-x-7"
                        : "translate-x-0"
                    }`}
                >
                  {formData.disponibilidade ? (
                    <FaCheck className="text-green-500" size={16} />
                  ) : (
                    <FaTimes className="text-red-500" size={16} />
                  )}
                </span>
              </button>
            </div>
          </div>

          <FloatingInput
            id="nome"
            label="Nome"
            placeholder="Digite o nome do produto"
            value={formData.nome ?? ""}
            onChange={handleChange}
          />

          <FloatingInput
            id="descricao"
            label="Descrição"
            placeholder="Digite a descrição"
            value={formData.descricao ?? ""}
            onChange={handleChange}
          />

          <FloatingInput
            id="imagem"
            label="Link da Imagem"
            placeholder="URL da imagem do produto"
            value={formData.imagem ?? ""}
            onChange={handleChange}
          />

          <FloatingInput
            id="preco"
            label="Preço"
            placeholder="Digite o preço"
            type="number"
            value={formData.preco === 0 ? "" : formData.preco ?? ""}
            onChange={handleChange}
            min={0}
            step="0.01"
          />

          <div className="flex flex-col items-center mt-2">
            <span className="block text-xs font-semibold text-black uppercase mb-2 tracking-wider">
              CATEGORIA
            </span>
            <div className="flex gap-6 justify-center">
              <button
                type="button"
                className={`flex flex-col items-center justify-center text-3xl p-2 rounded-full border-2 transition-all duration-200 ${
                  formData.categoria === "HAMBURGUER"
                    ? "text-red-600 border-red-600 bg-red-50"
                    : "text-gray-400 border-gray-200 bg-white"
                }`}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, categoria: "HAMBURGUER" }))
                }
                title="Hambúrguer"
              >
                <FaHamburger />
              </button>
              <button
                type="button"
                className={`flex flex-col items-center justify-center text-3xl p-2 rounded-full border-2 transition-all duration-200 ${
                  formData.categoria === "BEBIDA"
                    ? "text-red-600 border-red-600 bg-red-50"
                    : "text-gray-400 border-gray-200 bg-white"
                }`}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, categoria: "BEBIDA" }))
                }
                title="Bebida"
              >
                <FaGlassMartiniAlt />
              </button>
              <button
                type="button"
                className={`flex flex-col items-center justify-center text-3xl p-2 rounded-full border-2 transition-all duration-200 ${
                  formData.categoria === "SOBREMESA"
                    ? "text-red-600 border-red-600 bg-red-50"
                    : "text-gray-400 border-gray-200 bg-white"
                }`}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, categoria: "SOBREMESA" }))
                }
                title="Sobremesa"
              >
                <FaIceCream />
              </button>
            </div>
          </div>

          <div className="flex mt-6">
            <button
              type="submit"
              className="w-40 mx-auto flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-1.5 px-3 rounded-md transition-all font-bold shadow-lg text-base min-h-[38px] transform hover:-translate-y-1 hover:shadow-2xl duration-300"
            >
              <FaCheck className="text-white text-xl" />
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
