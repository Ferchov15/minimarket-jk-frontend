"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_URL } from "@/lib/api";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ correo, contrasena }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.mensaje || "Credenciales incorrectas");
        return;
      }

      document.cookie = "admin_auth=true; path=/; max-age=7200";

      router.push("/admin/dashboard");
    } catch (err) {
      setError("Error en el servidor");
    }
  };

  return (
    <div className="bg-[var(--neutral-50)] text-[var(--neutral-800)] min-h-screen flex">
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-20 xl:px-32">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-[var(--neutral-200)]">
            <h1 className="text-2xl font-bold text-center text-[var(--neutral-900)]">
              Mini Market F.J
            </h1>

            <h2 className="text-2xl font-bold text-center mb-2">
              Iniciar Sesión
            </h2>

            <p className="text-center text-[var(--neutral-600)] mb-8">
              Accede con tus credenciales de Usuario Administrador del Mini Market
            </p>

            <form onSubmit={handleLogin} className="space-y-6">
              <input
                type="email"
                placeholder="Correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
                className="block w-full rounded-md border px-4 py-3"
              />

              <input
                type="password"
                placeholder="Contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
                className="block w-full rounded-md border px-4 py-3"
              />

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 bg-[var(--primary-600)] text-white rounded-md"
              >
                Ingresar
              </button>
            </form>

            <div className="mt-4">
              <Link href="/">
                <button
                  type="button"
                  className="w-full py-3 px-4 bg-red-500 text-white rounded-md"
                >
                  Regresar a la Página Principal
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block relative flex-1">
        <Image
          src="/imagenes/fondo1.avif"
          alt="Imagen de fondo"
          fill // Esto hace que ocupe todo el contenedor relativo
          priority // Carga la imagen con prioridad (importante para el login)
          className="object-cover"
          sizes="50vw" // Le dice a Next que la imagen ocupará la mitad del ancho
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary-700)] to-transparent opacity-50"></div>
      </div>
    </div>
  );
}
