"use client";

import Link from "next/link";
import { useState } from "react";
import { validatePassword } from "@/utils/validation"; 

export default function NovaSenhaPage() {
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.id]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    // valida senha com teu validador
    const pw = validatePassword(form.password);
    if (!pw.isValid) Object.assign(newErrors, pw.errors);

    // valida confirmação
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Confirme sua senha.";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "As senhas não conferem.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Senha redefinida com sucesso, chama API aqui!");
      // Aqui depois tu manda pra rota no backend
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-lg shadow-xl p-6 space-y-4">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span>Voltar</span>
        </Link>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Definir Nova Senha</h1>
          <p className="mt-3 text-sm text-gray-600">
            Escolha uma senha forte para proteger sua conta
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Nova Senha
            </label>
            <input
              id="password"
              type="password"
              className={`w-full px-4 py-2.5 text-gray-900 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirmar Senha
            </label>
            <input
              id="confirmPassword"
              type="password"
              className={`w-full px-4 py-2.5 text-gray-900 border ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Redefinir Senha
          </button>
        </form>
      </div>
    </div>
  );
}
