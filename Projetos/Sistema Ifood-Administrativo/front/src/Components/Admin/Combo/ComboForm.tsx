import React, { useEffect, useRef, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ProdutoService } from "../../../server/api";
import "../../../Style.css";
import type { Produto } from "../../../Type";
import { useAdmin } from "../AdminContext";

// FloatingInput igual ao ProductForm
export type FloatingInputProps = {
  id: string;
  type?: string;
  value: string | number;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  label: string;
  placeholder: string;
  autoFocus?: boolean;
  min?: number;
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
    inputProps.className = `$
      {inputProps.className || ""}
    } [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`;
  }

  return (
    <div className="relative mt-6 mb-6">
      {type === "textarea" ? (
        <textarea
          {...inputProps}
          className={`block w-full px-4 py-3 pr-12 rounded-xl border-2 focus:outline-none text-base text-black font-semibold bg-white/80 transition-all duration-200 peer ${
            isActive ? "border-red-600" : "border-red-200"
          }`}
          placeholder=" "
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          rows={3}
        />
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

// FloatingInputAutocomplete FORA do ComboForm para exportação correta
export const FloatingInputAutocomplete: React.FC<{
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  suggestions: Produto[];
  onSelect: (produto: Produto) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  required?: boolean;
  name?: string;
}> = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  suggestions,
  onSelect,
  onBlur,
  onFocus,
  required,
  name,
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const isActive = isFocused || value.length > 0;
  return (
    <div className="relative mt-3 mb-3">
      <input
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus && onFocus();
        }}
        onBlur={(e) => {
          setTimeout(() => setIsFocused(false), 150);
          onBlur && onBlur();
        }}
        className={`block w-full px-4 py-3 pr-12 rounded-xl border-2 focus:outline-none text-base text-black font-semibold bg-white/80 transition-all duration-200 peer ${
          isActive ? "border-red-600" : "border-red-200"
        }`}
        placeholder=" "
        autoComplete="off"
        required={required}
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
      {isFocused && suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border rounded w-full mt-1 max-h-40 overflow-y-auto shadow-lg">
          {suggestions.map((p) => (
            <li
              key={p.id}
              className="px-3 py-2 hover:bg-red-100 cursor-pointer"
              onMouseDown={() => onSelect(p)}
            >
              {p.nome}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

interface ComboFormProps {
  onSave?: () => void;
  combo?: any; // Para edição futura
}

export const ComboForm: React.FC<ComboFormProps> = ({ onSave, combo }) => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    produtoHamburguerId: "",
    produtoBebidaId: "",
    produtoSobremesaId: "",
    precoCombo: "",
    ativo: true,
  });
  const [erro, setErro] = useState<string | null>(null);
  const { adminToken } = useAdmin();
  const [search, setSearch] = useState({
    hamburguer: "",
    bebida: "",
    sobremesa: "",
  });
  const [showSuggestions, setShowSuggestions] = useState({
    hamburguer: false,
    bebida: false,
    sobremesa: false,
  });
  const inputRefs = {
    hamburguer: useRef<HTMLInputElement>(null),
    bebida: useRef<HTMLInputElement>(null),
    sobremesa: useRef<HTMLInputElement>(null),
  };
  const navigate = useNavigate();

  useEffect(() => {
    ProdutoService.listarProdutos().then(setProdutos);
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" && "checked" in e.target
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  }

  function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    try {
      const comboPayload = {
        nome: form.nome,
        descricao: form.descricao,
        produtoHamburguer: { id: Number(form.produtoHamburguerId) },
        produtoBebida: { id: Number(form.produtoBebidaId) },
        produtoSobremesa: { id: Number(form.produtoSobremesaId) },
        precoCombo: Number(form.precoCombo),
        ativo: form.ativo,
      };
      await fetch("http://localhost:8080/api/combos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
        },
        body: JSON.stringify(comboPayload),
      });
      navigate("/admin/combos/list");
      if (onSave) onSave();
      setForm({
        nome: "",
        descricao: "",
        produtoHamburguerId: "",
        produtoBebidaId: "",
        produtoSobremesaId: "",
        precoCombo: "",
        ativo: true,
      });
    } catch (err) {
      setErro("Erro ao salvar combo");
    }
  }

  const hamburgueres = produtos.filter((p) => p.categoria === "HAMBURGUER");
  const bebidas = produtos.filter((p) => p.categoria === "BEBIDA");
  const sobremesas = produtos.filter((p) => p.categoria === "SOBREMESA");

  // Função para filtrar sugestões
  function getSuggestions(tipo: "hamburguer" | "bebida" | "sobremesa") {
    const map = {
      hamburguer: hamburgueres,
      bebida: bebidas,
      sobremesa: sobremesas,
    };
    const texto = search[tipo].toLowerCase();
    return map[tipo].filter((p) => p.nome.toLowerCase().includes(texto));
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center py-12 px-4">
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
              Cadastro
            </h2>
            <div className="ml-auto">
              <button
                type="button"
                className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none shadow-md border-2
                  ${
                    form.ativo
                      ? "bg-green-950 border-green-950"
                      : "bg-red-950 border-red-950"
                  }`}
                onClick={() =>
                  setForm((prev) => ({ ...prev, ativo: !prev.ativo }))
                }
                title={form.ativo ? "Marcar como inativo" : "Marcar como ativo"}
              >
                <span
                  className={`absolute left-1 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white shadow-lg flex items-center justify-center transition-transform duration-300
                    ${form.ativo ? "translate-x-7" : "translate-x-0"}`}
                >
                  {form.ativo ? (
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
            placeholder="Digite o nome do combo"
            value={form.nome ?? ""}
            onChange={handleChange}
          />

          <FloatingInput
            id="descricao"
            name="descricao"
            label="Descrição"
            placeholder="Digite a descrição"
            value={form.descricao ?? ""}
            onChange={handleChange}
            type="textarea"
          />

          <FloatingInput
            id="precoCombo"
            name="precoCombo"
            label="Preço"
            type="number"
            placeholder="Digite o preço"
            value={form.precoCombo === "0" ? "" : form.precoCombo ?? ""}
            onChange={handleChange}
            min={0}
            step="0.01"
          />

          <div className="flex flex-col items-center mt-2 w-full">
            <span className="block text-xs font-semibold text-black uppercase mb-2 tracking-wider">
              Produtos do Combo
            </span>
            <div className="flex flex-col gap-4 w-full">
              <FloatingInputAutocomplete
                id="produtoHamburguerId"
                label="Hambúrguer"
                placeholder="Hambúrguer"
                value={search.hamburguer}
                onChange={(v) => {
                  setSearch((s) => ({ ...s, hamburguer: v }));
                  setForm((f) => ({ ...f, produtoHamburguerId: "" }));
                }}
                suggestions={getSuggestions("hamburguer")}
                onSelect={(p) => {
                  setForm((f) => ({ ...f, produtoHamburguerId: String(p.id) }));
                  setSearch((s) => ({ ...s, hamburguer: p.nome }));
                }}
                required
              />
              <FloatingInputAutocomplete
                id="produtoBebidaId"
                label="Bebida"
                placeholder="Bebida"
                value={search.bebida}
                onChange={(v) => {
                  setSearch((s) => ({ ...s, bebida: v }));
                  setForm((f) => ({ ...f, produtoBebidaId: "" }));
                }}
                suggestions={getSuggestions("bebida")}
                onSelect={(p) => {
                  setForm((f) => ({ ...f, produtoBebidaId: String(p.id) }));
                  setSearch((s) => ({ ...s, bebida: p.nome }));
                }}
                required
              />
              <FloatingInputAutocomplete
                id="produtoSobremesaId"
                label="Sobremesa"
                placeholder="Sobremesa"
                value={search.sobremesa}
                onChange={(v) => {
                  setSearch((s) => ({ ...s, sobremesa: v }));
                  setForm((f) => ({ ...f, produtoSobremesaId: "" }));
                }}
                suggestions={getSuggestions("sobremesa")}
                onSelect={(p) => {
                  setForm((f) => ({ ...f, produtoSobremesaId: String(p.id) }));
                  setSearch((s) => ({ ...s, sobremesa: p.nome }));
                }}
                required
              />
            </div>
          </div>

          <div className="mb-4 flex items-center gap-2">
            <input
              name="ativo"
              type="checkbox"
              checked={form.ativo}
              onChange={handleChange}
              id="ativo"
              className="hidden"
            />
            <label htmlFor="ativo" className="font-semibold hidden">
              Ativo
            </label>
          </div>
          {erro && <div className="text-red-600 mb-2">{erro}</div>}
          <div className="flex mt-6">
            <button
              type="submit"
              className="w-40 mx-auto flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-1.5 px-3 rounded-md transition-all font-bold shadow-lg text-base min-h-[38px] transform hover:-translate-y-1 hover:shadow-2xl duration-300"
            >
              <FaCheck className="text-white text-xl" />
              {"Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
