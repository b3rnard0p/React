import React, { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaBreadSlice,
  FaCarrot,
  FaCheck,
  FaCheese,
  FaDrumstickBite,
  FaEllipsisH,
  FaPepperHot,
  FaTimes,
  FaWineBottle,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { api, IngredienteService } from "../../../server/api";
import "../../../Style.css";

interface Ingrediente {
  id?: number;
  nome: string;
  tipo: string;
  preco: number | null;
  estoque: number | null;
  ativo: boolean;
}

// FloatingInput igual ao ComboForm
export type FloatingInputProps = {
  id: string;
  type?: string;
  value: string | number;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  label: string;
  placeholder: string;
  autoFocus?: boolean;
  min?: string | number;
  step?: string | number;
  readOnly?: boolean;
  name?: string;
};

export const FloatingInput: React.FC<FloatingInputProps> = ({
  id,
  type = "text",
  value,
  onChange,
  label,
  placeholder,
  autoFocus = false,
  min,
  step,
  readOnly = false,
  name,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const isActive =
    isFocused || (typeof value === "string" ? value.length > 0 : value !== 0);

  const inputProps: any = {
    id,
    name,
    type,
    autoFocus,
    value,
    onChange,
    required: true,
    min,
    step,
    readOnly,
  };
  if (type === "number") {
    inputProps.onWheel = (e: React.WheelEvent<HTMLInputElement>) =>
      e.currentTarget.blur();
    inputProps.className = `${
      inputProps.className || ""
    } [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`;
  }

  return (
    <div className="relative mt-6 mb-6">
      {type === "select" ? (
        <select
          {...inputProps}
          className={`block w-full px-4 py-3 pr-12 rounded-xl border-2 focus:outline-none text-base text-black font-semibold bg-white/80 transition-all duration-200 peer ${
            isActive ? "border-red-600" : "border-red-200"
          }`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          <option value="">Selecione um tipo</option>
          <option value="carne">Carne</option>
          <option value="pão">Pão</option>
          <option value="queijo">Queijo</option>
          <option value="molho">Molho</option>
          <option value="vegetal">Vegetal</option>
          <option value="tempero">Tempero</option>
          <option value="outro">Outro</option>
        </select>
      ) : (
        <input
          {...inputProps}
          className={`block w-full px-4 py-3 pr-12 rounded-xl border-2 focus:outline-none text-base text-black font-semibold bg-white/80 transition-all duration-200 peer ${
            isActive ? "border-red-600" : "border-red-200"
          } ${
            type === "number"
              ? "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              : ""
          }`}
          placeholder=" "
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      )}
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

const IngredienteForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ingrediente, setIngrediente] = useState<Ingrediente>({
    nome: "",
    tipo: "",
    preco: null,
    estoque: null,
    ativo: true,
  });

  useEffect(() => {
    if (id) {
      fetchIngrediente();
    }
  }, [id]);

  const fetchIngrediente = async () => {
    try {
      const response = await IngredienteService.getIngredienteByIdAdmin(
        Number(id)
      );
      setIngrediente(response.data ?? response);
    } catch (error) {
      console.error("Erro ao buscar ingrediente:", error);
      navigate("/admin/ingredientes");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dadosParaEnviar = {
        ...ingrediente,
        preco: ingrediente.preco || 0,
        estoque: ingrediente.estoque || 0,
      };

      if (id) {
        await api.put(`/api/admin/ingredientes/${id}`, dadosParaEnviar);
      } else {
        await api.post("/api/admin/ingredientes", dadosParaEnviar);
      }
      navigate("/admin/ingredientes");
    } catch (error) {
      console.error("Erro ao salvar ingrediente:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setIngrediente((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? value === ""
            ? null
            : parseFloat(value) || 0
          : value,
    }));
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center py-12 px-4">
      <div className="flex items-center justify-between w-full max-w-md mb-6">
        <button
          onClick={() => navigate("/admin/ingredientes")}
          className="text-white hover:text-red-600 transition-colors duration-200"
        >
          <FaArrowLeft size={24} />
        </button>
        <div className="flex-1"></div>
      </div>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center">
        <form className="w-full space-y-5" onSubmit={handleSubmit}>
          <div className="relative flex items-center mb-4 pb-2 border-b min-h-[40px]">
            <h2 className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold text-red-700 text-center w-max">
              {id ? "Edição" : "Cadastro"}
            </h2>
            <div className="ml-auto">
              <button
                type="button"
                className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none shadow-md border-2
                  ${
                    ingrediente.ativo
                      ? "bg-green-950 border-green-950"
                      : "bg-red-950 border-red-950"
                  }`}
                onClick={() =>
                  setIngrediente((prev) => ({
                    ...prev,
                    ativo: !prev.ativo,
                  }))
                }
                title={
                  ingrediente.ativo
                    ? "Marcar como inativo"
                    : "Marcar como ativo"
                }
              >
                <span
                  className={`absolute left-1 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white shadow-lg flex items-center justify-center transition-transform duration-300
                    ${ingrediente.ativo ? "translate-x-7" : "translate-x-0"}`}
                >
                  {ingrediente.ativo ? (
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
            name="nome"
            label="Nome"
            placeholder="Ex: Carne de Hambúrguer"
            value={ingrediente.nome}
            onChange={handleChange}
            autoFocus
          />

          <div className="grid grid-cols-2 gap-4">
            <FloatingInput
              id="preco"
              name="preco"
              type="number"
              label="Preço (R$)"
              placeholder="0.00"
              value={ingrediente.preco?.toString() || ""}
              onChange={handleChange}
              min="0"
              step="0.01"
            />

            <FloatingInput
              id="estoque"
              name="estoque"
              type="number"
              label="Estoque"
              placeholder="0"
              value={ingrediente.estoque?.toString() || ""}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="flex flex-col items-center mt-2">
            <span className="block text-xs font-semibold text-black uppercase mb-2 tracking-wider">
              Tipo
            </span>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                type="button"
                className={`flex flex-col items-center justify-center text-2xl p-3 rounded-full border-2 transition-all duration-200 ${
                  ingrediente.tipo === "carne"
                    ? "text-red-600 border-red-600 bg-red-50"
                    : "text-gray-400 border-gray-200 bg-white"
                }`}
                onClick={() =>
                  setIngrediente((prev) => ({ ...prev, tipo: "carne" }))
                }
                title="Carne"
              >
                <FaDrumstickBite />
              </button>
              <button
                type="button"
                className={`flex flex-col items-center justify-center text-2xl p-3 rounded-full border-2 transition-all duration-200 ${
                  ingrediente.tipo === "pão"
                    ? "text-red-600 border-red-600 bg-red-50"
                    : "text-gray-400 border-gray-200 bg-white"
                }`}
                onClick={() =>
                  setIngrediente((prev) => ({ ...prev, tipo: "pão" }))
                }
                title="Pão"
              >
                <FaBreadSlice />
              </button>
              <button
                type="button"
                className={`flex flex-col items-center justify-center text-2xl p-3 rounded-full border-2 transition-all duration-200 ${
                  ingrediente.tipo === "queijo"
                    ? "text-red-600 border-red-600 bg-red-50"
                    : "text-gray-400 border-gray-200 bg-white"
                }`}
                onClick={() =>
                  setIngrediente((prev) => ({ ...prev, tipo: "queijo" }))
                }
                title="Queijo"
              >
                <FaCheese />
              </button>
              <button
                type="button"
                className={`flex flex-col items-center justify-center text-2xl p-3 rounded-full border-2 transition-all duration-200 ${
                  ingrediente.tipo === "molho"
                    ? "text-red-600 border-red-600 bg-red-50"
                    : "text-gray-400 border-gray-200 bg-white"
                }`}
                onClick={() =>
                  setIngrediente((prev) => ({ ...prev, tipo: "molho" }))
                }
                title="Molho"
              >
                <FaWineBottle />
              </button>
              <button
                type="button"
                className={`flex flex-col items-center justify-center text-2xl p-3 rounded-full border-2 transition-all duration-200 ${
                  ingrediente.tipo === "vegetal"
                    ? "text-red-600 border-red-600 bg-red-50"
                    : "text-gray-400 border-gray-200 bg-white"
                }`}
                onClick={() =>
                  setIngrediente((prev) => ({ ...prev, tipo: "vegetal" }))
                }
                title="Vegetal"
              >
                <FaCarrot />
              </button>
              <button
                type="button"
                className={`flex flex-col items-center justify-center text-2xl p-3 rounded-full border-2 transition-all duration-200 ${
                  ingrediente.tipo === "tempero"
                    ? "text-red-600 border-red-600 bg-red-50"
                    : "text-gray-400 border-gray-200 bg-white"
                }`}
                onClick={() =>
                  setIngrediente((prev) => ({ ...prev, tipo: "tempero" }))
                }
                title="Tempero"
              >
                <FaPepperHot />
              </button>
              <button
                type="button"
                className={`flex flex-col items-center justify-center text-2xl p-3 rounded-full border-2 transition-all duration-200 ${
                  ingrediente.tipo === "outro"
                    ? "text-red-600 border-red-600 bg-red-50"
                    : "text-gray-400 border-gray-200 bg-white"
                }`}
                onClick={() =>
                  setIngrediente((prev) => ({ ...prev, tipo: "outro" }))
                }
                title="Outro"
              >
                <FaEllipsisH />
              </button>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              className="w-40 mx-auto flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-1.5 px-3 rounded-md transition-all font-bold shadow-lg text-base min-h-[38px] transform hover:-translate-y-1 hover:shadow-2xl duration-300"
            >
              <FaCheck className="text-white text-xl" />
              {"Cadastrar"}
            </button>
            {id && (
              <button
                type="button"
                onClick={() => navigate("/admin/ingredientes")}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default IngredienteForm;
