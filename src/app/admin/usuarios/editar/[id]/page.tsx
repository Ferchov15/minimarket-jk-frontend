"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditarUsuarioPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { id } = params;

  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    contraseña: "",
  });

  useEffect(() => {
    if (!id) return;

    const cargarUsuario = async () => {
      const res = await fetch(
        `https://minimarket-jk-backend.onrender.com/api/usuarios/${id}`
      );
      const data = await res.json();

      setForm({
        nombre: data.nombre,
        correo: data.correo,
        contraseña: "",
      });
    };

    cargarUsuario();
  }, [id]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch(
      `https://minimarket-jk-backend.onrender.com/api/usuarios/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );

    if (res.ok) {
      alert("Usuario actualizado correctamente");
      router.push("/admin/usuarios");
    } else {
      alert("Error al actualizar usuario");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl p-10 border border-gray-200">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800">
          Editar Usuario
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Nombre */}
          <div>
            <label className="font-semibold text-gray-700 block mb-1">
              Nombre
            </label>
            <input
              name="nombre"
              placeholder="Nombre"
              className="border border-gray-300 p-3 rounded-xl w-full shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>

          {/* Correo */}
          <div>
            <label className="font-semibold text-gray-700 block mb-1">
              Correo
            </label>
            <input
              name="correo"
              type="email"
              placeholder="Correo"
              className="border border-gray-300 p-3 rounded-xl w-full shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition"
              value={form.correo}
              onChange={handleChange}
              required
            />
          </div>

          {/* Contraseña */}
          <div>
            <label className="font-semibold text-gray-700 block mb-1">
              Nueva contraseña (opcional)
            </label>
            <input
              name="contraseña"
              type="password"
              placeholder="*******"
              className="border border-gray-300 p-3 rounded-xl w-full shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition"
              value={form.contraseña}
              onChange={handleChange}
            />
          </div>

          <button className="bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition w-full shadow-md">
            Guardar Cambios
          </button>

          <button
            type="button"
            onClick={() => router.push("/admin/usuarios")}
            className="bg-gray-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-gray-700 transition w-full shadow-sm"
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}
