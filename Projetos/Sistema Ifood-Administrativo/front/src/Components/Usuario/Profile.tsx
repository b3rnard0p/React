import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { UsuarioService } from "../../server/api";
import "../../Style.css";
import type {
  CreateUsuarioRequest,
  UpdateUsuarioRequest,
  Usuario,
} from "../../Type";
import { FloatingInput } from "../Admin/Produto/ProductForm";
import Footer from "../Base/Footer";
import { setCookie, useUser } from "./UserContext";

export const Profile: React.FC = () => {
  const { user, setUser, hasUser, checkUser } = useUser();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Usuario>>({});
  const [errors, setErrors] = useState<Partial<CreateUsuarioRequest>>({});

  useEffect(() => {
    carregarUsuario();
  }, [user, hasUser]);

  const carregarUsuario = async () => {
    try {
      if (hasUser && user) {
        setFormData(user);
      } else {
        setFormData({
          nome: "",
          email: "",
          telefone: "",
          rua: "",
          numero: "",
          complemento: "",
          cidade: "",
          estado: "",
          cep: "",
        });
      }
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
    }
  };

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateUsuarioRequest> = {};

    if (!formData.nome?.trim()) {
      newErrors.nome = "Nome é obrigatório";
    }
    if (!formData.email?.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }
    if (!formData.telefone?.trim()) {
      newErrors.telefone = "Telefone é obrigatório";
    }
    if (!formData.rua?.trim()) {
      newErrors.rua = "Rua é obrigatória";
    }
    if (!formData.numero?.trim()) {
      newErrors.numero = "Número é obrigatório";
    }
    if (!formData.cidade?.trim()) {
      newErrors.cidade = "Cidade é obrigatória";
    }
    if (!formData.estado?.trim()) {
      newErrors.estado = "Estado é obrigatório";
    }
    if (!formData.cep?.trim()) {
      newErrors.cep = "CEP é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      if (hasUser && user) {
        // Atualizar usuário existente
        const dadosAtualizados: UpdateUsuarioRequest = {
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone,
          rua: formData.rua,
          numero: formData.numero,
          complemento: formData.complemento,
          cidade: formData.cidade,
          estado: formData.estado,
          cep: formData.cep,
        };

        try {
          // Tentar salvar na API
          const usuarioAtualizado = await UsuarioService.atualizarUsuario(
            user.id,
            dadosAtualizados
          );
          setUser(usuarioAtualizado);
          // Atualizar o cookie se vier um novo token
          if (usuarioAtualizado.token) {
            setCookie("user_token", usuarioAtualizado.token, 180);
          }
        } catch (apiError) {
          console.warn("API não disponível, salvando localmente:", apiError);
          // Fallback: salvar localmente se a API não estiver disponível
          setUser(formData as Usuario);
        }
      } else {
        // Criar novo usuário
        const novoUsuario: CreateUsuarioRequest = {
          nome: formData.nome!,
          email: formData.email!,
          telefone: formData.telefone!,
          rua: formData.rua!,
          numero: formData.numero!,
          complemento: formData.complemento!,
          cidade: formData.cidade!,
          estado: formData.estado!,
          cep: formData.cep!,
        };

        try {
          // Tentar criar usuário na API
          const newUser = await UsuarioService.criarUsuario(novoUsuario);
          setUser(newUser);
          // Salvar token no cookie por 6 meses
          if (newUser.token) {
            setCookie("user_token", newUser.token, 180);
          }
        } catch (apiError) {
          console.warn("API não disponível, salvando localmente:", apiError);
          // Criar usuário localmente se a API não estiver disponível
          const localUser = {
            id: 1,
            ...novoUsuario,
          };
          setUser(localUser);
        }
      }

      await checkUser(); // Re-verificar se há usuário após salvar
      setEditingField(null); // Esconde botões e volta ícone de editar
    } catch (error) {
      console.error("Erro ao salvar:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasUser && user) {
      setFormData(user);
    } else {
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        rua: "",
        numero: "",
        complemento: "",
        cidade: "",
        estado: "",
        cep: "",
      });
    }
    setErrors({});
    setEditingField(null); // Esconde botões e volta ícone de editar
  };

  const renderFloatingInput = (
    id: string,
    label: string,
    placeholder: string,
    value: string,
    error?: string
  ) => (
    <div>
      <FloatingInput
        id={id}
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        autoFocus={false}
        readOnly={false}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );

  const renderEditableInputs = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderFloatingInput(
          "nome",
          "Nome Completo *",
          "Seu nome completo",
          formData.nome || "",
          errors.nome
        )}
        {renderFloatingInput(
          "email",
          "Email *",
          "seu@email.com",
          formData.email || "",
          errors.email
        )}
        {renderFloatingInput(
          "telefone",
          "Telefone *",
          "(11) 99999-9999",
          formData.telefone || "",
          errors.telefone
        )}
        {renderFloatingInput(
          "cep",
          "CEP *",
          "01234-567",
          formData.cep || "",
          errors.cep
        )}
      </div>
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {renderFloatingInput(
            "rua",
            "Rua *",
            "Rua",
            formData.rua || "",
            errors.rua
          )}
          {renderFloatingInput(
            "cidade",
            "Cidade *",
            "Cidade",
            formData.cidade || "",
            errors.cidade
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {renderFloatingInput(
            "numero",
            "Número *",
            "Número",
            formData.numero || "",
            errors.numero
          )}
          {renderFloatingInput(
            "complemento",
            "Complemento",
            "Complemento (opcional)",
            formData.complemento || "",
            errors.complemento
          )}
          {renderFloatingInput(
            "estado",
            "Estado *",
            "Estado",
            formData.estado || "",
            errors.estado
          )}
        </div>
      </div>

      {/* Botão de salvar para usuários não cadastrados */}
      <div className="flex justify-center mt-8">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed shadow-lg"
        >
          {saving ? "Salvando..." : "Salvar Perfil"}
        </button>
      </div>
    </>
  );

  const renderProfileInputs = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FloatingInput
            id="nome"
            label="Nome Completo *"
            placeholder="Seu nome completo"
            value={formData.nome || ""}
            onChange={handleInputChange}
            autoFocus={editingField === "nome"}
            readOnly={editingField !== "nome"}
            onEditClick={() => setEditingField("nome")}
            rightIcon={
              editingField === "nome" ? (
                <>
                  <button
                    type="button"
                    className="p-1 group focus:outline-none"
                    onClick={handleSave}
                    tabIndex={-1}
                    title="Salvar"
                  >
                    <FaCheck
                      className="transition-all duration-200 text-black group-hover:text-green-600 group-hover:-translate-y-1"
                      size={18}
                    />
                  </button>
                  <button
                    type="button"
                    className="p-1 group focus:outline-none"
                    onClick={handleCancel}
                    tabIndex={-1}
                    title="Cancelar"
                  >
                    <FaTimes
                      className="transition-all duration-200 text-black group-hover:text-red-600 group-hover:-translate-y-1"
                      size={18}
                    />
                  </button>
                </>
              ) : undefined
            }
          />
          {errors.nome && (
            <p className="text-red-500 text-sm mt-1">{errors.nome}</p>
          )}
        </div>
        <div>
          <FloatingInput
            id="email"
            label="Email *"
            placeholder="seu@email.com"
            value={formData.email || ""}
            onChange={handleInputChange}
            readOnly={editingField !== "email"}
            onEditClick={() => setEditingField("email")}
            rightIcon={
              editingField === "email" ? (
                <>
                  <button
                    type="button"
                    className="p-1 group focus:outline-none"
                    onClick={handleSave}
                    tabIndex={-1}
                    title="Salvar"
                  >
                    <FaCheck
                      className="transition-all duration-200 text-black group-hover:text-green-600 group-hover:-translate-y-1"
                      size={18}
                    />
                  </button>
                  <button
                    type="button"
                    className="p-1 group focus:outline-none"
                    onClick={handleCancel}
                    tabIndex={-1}
                    title="Cancelar"
                  >
                    <FaTimes
                      className="transition-all duration-200 text-black group-hover:text-red-600 group-hover:-translate-y-1"
                      size={18}
                    />
                  </button>
                </>
              ) : undefined
            }
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
        <div>
          <FloatingInput
            id="telefone"
            label="Telefone *"
            placeholder="(11) 99999-9999"
            value={formData.telefone || ""}
            onChange={handleInputChange}
            readOnly={editingField !== "telefone"}
            onEditClick={() => setEditingField("telefone")}
            rightIcon={
              editingField === "telefone" ? (
                <>
                  <button
                    type="button"
                    className="p-1 group focus:outline-none"
                    onClick={handleSave}
                    tabIndex={-1}
                    title="Salvar"
                  >
                    <FaCheck
                      className="transition-all duration-200 text-black group-hover:text-green-600 group-hover:-translate-y-1"
                      size={18}
                    />
                  </button>
                  <button
                    type="button"
                    className="p-1 group focus:outline-none"
                    onClick={handleCancel}
                    tabIndex={-1}
                    title="Cancelar"
                  >
                    <FaTimes
                      className="transition-all duration-200 text-black group-hover:text-red-600 group-hover:-translate-y-1"
                      size={18}
                    />
                  </button>
                </>
              ) : undefined
            }
          />
          {errors.telefone && (
            <p className="text-red-500 text-sm mt-1">{errors.telefone}</p>
          )}
        </div>
        <div>
          <FloatingInput
            id="cep"
            label="CEP *"
            placeholder="01234-567"
            value={formData.cep || ""}
            onChange={handleInputChange}
            readOnly={editingField !== "cep"}
            onEditClick={() => setEditingField("cep")}
            rightIcon={
              editingField === "cep" ? (
                <>
                  <button
                    type="button"
                    className="p-1 group focus:outline-none"
                    onClick={handleSave}
                    tabIndex={-1}
                    title="Salvar"
                  >
                    <FaCheck
                      className="transition-all duration-200 text-black group-hover:text-green-600 group-hover:-translate-y-1"
                      size={18}
                    />
                  </button>
                  <button
                    type="button"
                    className="p-1 group focus:outline-none"
                    onClick={handleCancel}
                    tabIndex={-1}
                    title="Cancelar"
                  >
                    <FaTimes
                      className="transition-all duration-200 text-black group-hover:text-red-600 group-hover:-translate-y-1"
                      size={18}
                    />
                  </button>
                </>
              ) : undefined
            }
          />
          {errors.cep && (
            <p className="text-red-500 text-sm mt-1">{errors.cep}</p>
          )}
        </div>
      </div>
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <FloatingInput
            id="rua"
            label="Rua *"
            placeholder="Rua"
            value={formData.rua || ""}
            onChange={handleInputChange}
            readOnly={editingField !== "rua"}
            onEditClick={() => setEditingField("rua")}
            rightIcon={
              editingField === "rua" ? (
                <>
                  <button
                    type="button"
                    className="p-1 group focus:outline-none"
                    onClick={handleSave}
                    tabIndex={-1}
                    title="Salvar"
                  >
                    <FaCheck
                      className="transition-all duration-200 text-black group-hover:text-green-600 group-hover:-translate-y-1"
                      size={18}
                    />
                  </button>
                  <button
                    type="button"
                    className="p-1 group focus:outline-none"
                    onClick={handleCancel}
                    tabIndex={-1}
                    title="Cancelar"
                  >
                    <FaTimes
                      className="transition-all duration-200 text-black group-hover:text-red-600 group-hover:-translate-y-1"
                      size={18}
                    />
                  </button>
                </>
              ) : undefined
            }
          />
          {errors.rua && (
            <p className="text-red-500 text-sm mt-1">{errors.rua}</p>
          )}
          <FloatingInput
            id="cidade"
            label="Cidade *"
            placeholder="Cidade"
            value={formData.cidade || ""}
            onChange={handleInputChange}
            readOnly={editingField !== "cidade"}
            onEditClick={() => setEditingField("cidade")}
            rightIcon={
              editingField === "cidade" ? (
                <>
                  <button
                    type="button"
                    className="p-1 group focus:outline-none"
                    onClick={handleSave}
                    tabIndex={-1}
                    title="Salvar"
                  >
                    <FaCheck
                      className="transition-all duration-200 text-black group-hover:text-green-600 group-hover:-translate-y-1"
                      size={18}
                    />
                  </button>
                  <button
                    type="button"
                    className="p-1 group focus:outline-none"
                    onClick={handleCancel}
                    tabIndex={-1}
                    title="Cancelar"
                  >
                    <FaTimes
                      className="transition-all duration-200 text-black group-hover:text-red-600 group-hover:-translate-y-1"
                      size={18}
                    />
                  </button>
                </>
              ) : undefined
            }
          />
          {errors.cidade && (
            <p className="text-red-500 text-sm mt-1">{errors.cidade}</p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <FloatingInput
            id="numero"
            label="Número *"
            placeholder="Número"
            value={formData.numero || ""}
            onChange={handleInputChange}
            readOnly={editingField !== "numero"}
            onEditClick={() => setEditingField("numero")}
            rightIcon={
              editingField === "numero" ? (
                <>
                  <button
                    type="button"
                    className="p-1 group focus:outline-none"
                    onClick={handleSave}
                    tabIndex={-1}
                    title="Salvar"
                  >
                    <FaCheck
                      className="transition-all duration-200 text-black group-hover:text-green-600 group-hover:-translate-y-1"
                      size={18}
                    />
                  </button>
                  <button
                    type="button"
                    className="p-1 group focus:outline-none"
                    onClick={handleCancel}
                    tabIndex={-1}
                    title="Cancelar"
                  >
                    <FaTimes
                      className="transition-all duration-200 text-black group-hover:text-red-600 group-hover:-translate-y-1"
                      size={18}
                    />
                  </button>
                </>
              ) : undefined
            }
          />
          {errors.numero && (
            <p className="text-red-500 text-sm mt-1">{errors.numero}</p>
          )}
          <FloatingInput
            id="complemento"
            label="Complemento"
            placeholder="Complemento (opcional)"
            value={formData.complemento || ""}
            onChange={handleInputChange}
            readOnly={editingField !== "complemento"}
            onEditClick={() => setEditingField("complemento")}
            rightIcon={
              editingField === "complemento" ? (
                <>
                  <button
                    type="button"
                    className="p-1 group focus:outline-none"
                    onClick={handleSave}
                    tabIndex={-1}
                    title="Salvar"
                  >
                    <FaCheck
                      className="transition-all duration-200 text-black group-hover:text-green-600 group-hover:-translate-y-1"
                      size={18}
                    />
                  </button>
                  <button
                    type="button"
                    className="p-1 group focus:outline-none"
                    onClick={handleCancel}
                    tabIndex={-1}
                    title="Cancelar"
                  >
                    <FaTimes
                      className="transition-all duration-200 text-black group-hover:text-red-600 group-hover:-translate-y-1"
                      size={18}
                    />
                  </button>
                </>
              ) : undefined
            }
          />
          {errors.complemento && (
            <p className="text-red-500 text-sm mt-1">{errors.complemento}</p>
          )}
          <FloatingInput
            id="estado"
            label="Estado *"
            placeholder="Estado"
            value={formData.estado || ""}
            onChange={handleInputChange}
            readOnly={editingField !== "estado"}
            onEditClick={() => setEditingField("estado")}
            rightIcon={
              editingField === "estado" ? (
                <>
                  <button
                    type="button"
                    className="p-1 group focus:outline-none"
                    onClick={handleSave}
                    tabIndex={-1}
                    title="Salvar"
                  >
                    <FaCheck
                      className="transition-all duration-200 text-black group-hover:text-green-600 group-hover:-translate-y-1"
                      size={18}
                    />
                  </button>
                  <button
                    type="button"
                    className="p-1 group focus:outline-none"
                    onClick={handleCancel}
                    tabIndex={-1}
                    title="Cancelar"
                  >
                    <FaTimes
                      className="transition-all duration-200 text-black group-hover:text-red-600 group-hover:-translate-y-1"
                      size={18}
                    />
                  </button>
                </>
              ) : undefined
            }
          />
          {errors.estado && (
            <p className="text-red-500 text-sm mt-1">{errors.estado}</p>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="relative pt-5">
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow flex justify-center">
          <div className="w-full max-w-4xl p-6 space-y-8">
            {/* Header fora do card: seta à esquerda e título centralizado */}
            <div
              className="relative flex items-center mb-8"
              style={{ minHeight: "48px" }}
            >
              <a
                href="/"
                className="absolute left-0 top-1/2 -translate-y-1/2 text-red-700 hover:text-red-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
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
              <h2 className="w-full text-3xl font-extrabold text-gray-800 text-center select-none">
                Meu Perfil
              </h2>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 ring-1 ring-red-100"
            >
              {/* Avatar centralizado no topo do card */}
              <div className="flex flex-col items-center pt-10 pb-4">
                <div className="relative group">
                  <span
                    className={`bg-red-600 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-2xl uppercase border-2 border-white shadow`}
                  >
                    {user?.nome?.charAt(0) || "?"}
                  </span>
                </div>
              </div>

              <div className="p-6">
                {/* Dados Pessoais */}
                <div className="">
                  {hasUser ? renderProfileInputs() : renderEditableInputs()}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};
