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

      alert("Usuario registrado correctamente");
      router.push("/admin/usuarios");
    } catch (error) {
      console.error(error);
      alert("Error al registrar el usuario");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-5">
      <div className="bg-white w-full max-w-xl shadow-2xl p-10 rounded-2xl border">
        <h1 className="text-3xl font-bold text-center mb-6">
          Crear Nuevo Usuario Administrativo
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />

          <input
            name="correo"
            type="email"
            value={form.correo}
            onChange={handleChange}
            required
          />

          <input
            name="contraseña"
            type="password"
            value={form.contraseña}
            onChange={handleChange}
            required
          />

          <button type="submit">Crear Usuario</button>
        </form>

        <button onClick={() => router.push("/admin/usuarios")}>
          Regresar
        </button>
      </div>
    </div>
  );
}
