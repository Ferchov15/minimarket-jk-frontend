"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CrearUsuarioPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    contraseña: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "https://minimarket-jk-backend.onrender.com/api/usuarios/registrar",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) throw new Error("Error al registrar usuario");

      alert("✅ Usuario registrado correctamente");
      router.push("/admin/usuarios");
    } catch (error) {
      console.error(error);
      alert("❌ Error al registrar el usuario");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4 sm:p-5">
      <div className="bg-white w-full max-w-xl shadow-2xl p-6 sm:p-8 lg:p-10 rounded-2xl border-2 border-gray-200">
        {/* Encabezado */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">👤</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Crear Nuevo Usuario
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Registra un nuevo usuario administrativo en el sistema
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="nombre" 
              className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"
            >
              <span className="text-blue-600">👤</span>
              Nombre Completo
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              placeholder="Ej: Juan Pérez"
              value={form.nombre}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-gray-50 text-gray-800 placeholder-gray-400 font-medium"
            />
          </div>

          <div>
            <label 
              htmlFor="correo" 
              className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"
            >
              <span className="text-blue-600">✉️</span>
              Correo Electrónico
            </label>
            <input
              id="correo"
              name="correo"
              type="email"
              placeholder="Ej: usuario@ejemplo.com"
              value={form.correo}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-gray-50 text-gray-800 placeholder-gray-400 font-medium"
            />
          </div>

          <div>
            <label 
              htmlFor="contraseña" 
              className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"
            >
              <span className="text-blue-600">🔒</span>
              Contraseña
            </label>
            <input
              id="contraseña"
              name="contraseña"
              type="password"
              placeholder="Ingrese una contraseña segura"
              value={form.contraseña}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-gray-50 text-gray-800 placeholder-gray-400 font-medium"
            />
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <span>ℹ️</span>
              La contraseña debe tener al menos 6 caracteres
            </p>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.push("/admin/usuarios")}
              className="w-full sm:w-1/3 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-700 font-bold py-3 px-6 rounded-lg transition-all border-2 border-gray-300 hover:border-gray-400"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="w-full sm:w-2/3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all border-b-4 border-blue-800 active:border-b-2 active:translate-y-0.5 hover:shadow-xl"
            >
              Crear Usuario
            </button>
          </div>
        </form>

        <div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-600 rounded-lg">
          <p className="text-sm text-gray-700 flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">💡</span>
            <span>
              <strong>Nota:</strong> El usuario creado tendrá permisos administrativos 
              para gestionar el sistema del Mini Market F.J
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}