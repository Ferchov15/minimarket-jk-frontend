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

  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!id) return;

    const cargarUsuario = async () => {
      try {
        const res = await fetch(
          `https://minimarket-jk-backend.onrender.com/api/usuarios/${id}`
        );
        const data = await res.json();

        setForm({
          nombre: data.nombre,
          correo: data.correo,
          contraseña: "",
        });
      } catch (error) {
        console.error("Error al cargar usuario:", error);
        alert("❌ Error al cargar los datos del usuario");
      } finally {
        setCargando(false);
      }
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

    try {
      const res = await fetch(
        `https://minimarket-jk-backend.onrender.com/api/usuarios/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (res.ok) {
        alert("✅ Usuario actualizado correctamente");
        router.push("/admin/usuarios");
      } else {
        alert("❌ Error al actualizar usuario");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Error de servidor");
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">Cargando datos del usuario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4 sm:p-6">
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-2xl p-6 sm:p-8 lg:p-10 border-2 border-gray-200">
        
        {/* Encabezado */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">✏️</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Editar Usuario
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Actualiza la información del usuario administrativo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Nombre */}
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
              className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-gray-50 text-gray-800 font-medium"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>

          {/* Correo */}
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
              className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-gray-50 text-gray-800 font-medium"
              value={form.correo}
              onChange={handleChange}
              required
            />
          </div>

          {/* Contraseña */}
          <div>
            <label 
              htmlFor="contraseña"
              className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"
            >
              <span className="text-blue-600">🔒</span>
              Nueva Contraseña (Opcional)
            </label>
            <input
              id="contraseña"
              name="contraseña"
              type="password"
              placeholder="Dejar en blanco para mantener la actual"
              className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-gray-50 text-gray-800 font-medium"
              value={form.contraseña}
              onChange={handleChange}
            />
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <span>ℹ️</span>
              Solo ingresa una nueva contraseña si deseas cambiarla
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
              💾 Guardar Cambios
            </button>
          </div>
        </form>

        {/* Información adicional */}
        <div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-600 rounded-lg">
          <p className="text-sm text-gray-700 flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">💡</span>
            <span>
              <strong>Nota:</strong> Si no deseas cambiar la contraseña, 
              simplemente deja ese campo vacío y se mantendrá la contraseña actual.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}