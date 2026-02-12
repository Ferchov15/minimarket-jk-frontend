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
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">Cargando usuarios...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
          👥 Administración de Usuarios
        </h1>

        <Link
          href="/admin/usuarios/crear"
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 active:bg-green-800 text-white px-5 py-3 rounded-lg shadow-lg font-semibold text-center transition-all hover:shadow-xl border-b-4 border-green-800 active:border-b-2 active:translate-y-0.5"
        >
          <span className="sm:hidden">+ Nuevo Usuario</span>
          <span className="hidden sm:inline">+ Registrar Usuario</span>
        </Link>
      </div>

      {/* Contenedor Principal */}
      <div className="bg-white w-full max-w-5xl mx-auto shadow-xl rounded-2xl overflow-hidden">
        {usuarios.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="text-6xl mb-4 opacity-20">👤</div>
            <p className="text-gray-500 text-lg font-medium">
              No hay usuarios registrados.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Comienza registrando tu primer usuario
            </p>
          </div>
        ) : (
          <>
            {/* Vista Mobile - Cards */}
            <div className="sm:hidden divide-y divide-gray-200">
              {usuarios.map((u) => (
                <div
                  key={u.id}
                  className="p-5 hover:bg-gray-50 transition-colors"
                >
                  {/* Info del usuario */}
                  <div className="mb-4">
                    <p className="font-bold text-lg text-gray-800 mb-1 flex items-center gap-2">
                      <span className="text-blue-600">👤</span>
                      {u.nombre}
                    </p>
                    <p className="text-gray-500 text-sm flex items-center gap-2">
                      <span>✉️</span>
                      {u.correo}
                    </p>
                  </div>

                  {/* Botones */}
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        router.push(`/admin/usuarios/editar/${u.id}`)
                      }
                      className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 active:bg-blue-800 font-semibold transition-all border-b-4 border-blue-800 active:border-b-2 active:translate-y-0.5"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => eliminarUsuario(u.id)}
                      className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 active:bg-red-800 font-semibold transition-all border-b-4 border-red-800 active:border-b-2 active:translate-y-0.5"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden sm:block">
              <table className="w-full">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-sm lg:text-base">
                      Usuario
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-sm lg:text-base hidden md:table-cell">
                      Correo Electrónico
                    </th>
                    <th className="px-6 py-4 text-center font-semibold text-sm lg:text-base">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {usuarios.map((u) => (
                    <tr
                      key={u.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-base lg:text-lg text-gray-800">
                            {u.nombre}
                          </p>
                          <p className="text-gray-500 text-xs lg:text-sm md:hidden">
                            {u.correo}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-gray-600 text-sm lg:text-base hidden md:table-cell">
                        {u.correo}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2 lg:gap-3">
                          <button
                            onClick={() =>
                              router.push(`/admin/usuarios/editar/${u.id}`)
                            }
                            className="px-3 lg:px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-all text-sm lg:text-base font-semibold hover:scale-105"
                          >
                            <span className="lg:hidden">✏️</span>
                            <span className="hidden lg:inline">Editar</span>
                          </button>

                          <button
                            onClick={() => eliminarUsuario(u.id)}
                            className="px-3 lg:px-4 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700 transition-all text-sm lg:text-base font-semibold hover:scale-105"
                          >
                            <span className="lg:hidden">🗑️</span>
                            <span className="hidden lg:inline">Eliminar</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {usuarios.length > 0 && (
        <div className="text-center mt-4 text-gray-600 text-sm">
          Total: <span className="font-bold text-gray-800">{usuarios.length}</span> usuario{usuarios.length !== 1 ? 's' : ''} registrado{usuarios.length !== 1 ? 's' : ''}
        </div>
      )}

      <div className="flex justify-center mt-8 lg:mt-10">
        <Link
          href="/admin/dashboard"
          className="w-full sm:w-auto bg-gray-700 hover:bg-gray-800 active:bg-gray-900 text-white px-8 py-3 rounded-lg shadow-lg font-semibold transition-all hover:shadow-xl text-center border-b-4 border-gray-900 active:border-b-2 active:translate-y-0.5"
        >
          ← Regresar al Panel
        </Link>
      </div>
    </div>
  );
}