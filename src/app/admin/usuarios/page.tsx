"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Usuario {
  id: number;
  nombre: string;
  correo: string;
}

export default function UsuariosAdminPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    traerUsuarios();
  }, []);

  const traerUsuarios = async (): Promise<void> => {
    try {
      const res = await fetch(
        "https://minimarket-jk-backend.onrender.com/api/usuarios/listar"
      );
      const data: Usuario[] = await res.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al obtener usuarios", error);
    } finally {
      setCargando(false);
    }
  };

  const eliminarUsuario = async (id: number): Promise<void> => {
    if (!confirm("¿Seguro deseas eliminar este usuario?")) return;

    try {
      const res = await fetch(
        `https://minimarket-jk-backend.onrender.com/api/usuarios/${id}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        setUsuarios((prev) => prev.filter((u) => u.id !== id));
      }
    } catch (error) {
      console.error("Error al eliminar usuario", error);
    }
  };

  if (cargando)
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
        Cargando usuarios...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Administración de Usuarios
        </h1>

        <Link
          href="/admin/usuarios/crear"
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg shadow"
        >
          + Registrar Usuario
        </Link>
      </div>

      {/* Contenedor */}
      <div className="bg-white w-full max-w-3xl mx-auto shadow-xl rounded-xl p-6">
        {usuarios.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            No hay usuarios registrados.
          </p>
        ) : (
          <div className="divide-y">
            {usuarios.map((u) => (
              <div
                key={u.id}
                className="flex justify-between items-center py-4 hover:bg-gray-50 transition"
              >
                <div>
                  <p className="font-semibold text-lg">{u.nombre}</p>
                  <p className="text-gray-500 text-sm">{u.correo}</p>
                </div>

                <div className="flex gap-3">
                  {/* Editar */}
                  <button
                    onClick={() =>
                      router.push(`/admin/usuarios/editar/${u.id}`)
                    }
                    className="px-3 py-1 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
                  >
                    Editar
                  </button>

                  {/* Eliminar */}
                  <button
                    onClick={() => eliminarUsuario(u.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded-md shadow hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botón regresar */}
      <div className="flex justify-center mt-10">
        <Link
          href="/admin/dashboard"
          className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-lg shadow"
        >
          Regresar al Panel
        </Link>
      </div>
    </div>
  );
}
