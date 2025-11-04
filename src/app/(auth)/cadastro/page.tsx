// src/app/cadastro/page.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { validateRegisterForm } from "@/utils/validation";

export default function CadastroPage() {
  const [values, setValues] = useState({ nome: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValues({ ...values, [e.target.id]: e.target.value });

    // Remove erro ao digitar novamente
    setErrors((prev) => ({ ...prev, [e.target.id]: "" }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = validateRegisterForm(values);

    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }

    setErrors({});
    console.log("✅ Registrando usuário", values);
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-lg shadow-xl pb-6 pl-6 pr-6 space-y-4">
        <img src="/ifro-events-icon.svg" alt="Ifro Events" className="mx-auto h-24 w-24" />

        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Criar Conta</h1>
          <p className="mt-2 text-sm text-gray-600">Preencha os dados para se cadastrar</p>
        </div>

        <form className="space-y-3.5" onSubmit={handleSubmit}>
          
          <div className="space-y-1.5">
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome Completo</label>
            <input
              id="nome"
              type="text"
              className={`w-full px-4 py-2.5 text-gray-900 border rounded-lg focus:outline-none focus:ring-2 placeholder:text-gray-400 transition-all ${
                errors.nome ? "border-red-600 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"
              }`}
              placeholder="Seu Nome Completo"
              value={values.nome}
              onChange={handleChange}
            />
            {errors.nome && <p className="text-red-600 text-sm">{errors.nome}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
            <input
              id="email"
              type="text"
              className={`w-full px-4 py-2.5 text-gray-900 border rounded-lg focus:outline-none focus:ring-2 placeholder:text-gray-400 transition-all ${
                errors.email ? "border-red-600 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"
              }`}
              placeholder="seu@email.com"
              value={values.email}
              onChange={handleChange}
            />
            {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              id="password"
              type="password"
              className={`w-full px-4 py-2.5 text-gray-900 border rounded-lg focus:outline-none focus:ring-2 placeholder:text-gray-400 transition-all ${
                errors.password ? "border-red-600 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"
              }`}
              placeholder="••••••••"
              value={values.password}
              onChange={handleChange}
            />
            {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmar Senha</label>
            <input
              id="confirmPassword"
              type="password"
              className={`w-full px-4 py-2.5 text-gray-900 border rounded-lg focus:outline-none focus:ring-2 placeholder:text-gray-400 transition-all ${
                errors.confirmPassword ? "border-red-600 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"
              }`}
              placeholder="••••••••"
              value={values.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <p className="text-red-600 text-sm">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Criar Conta
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}
