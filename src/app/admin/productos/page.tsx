"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = "https://minimarket-jk-backend.onrender.com/api/productos";

const CATEGORIAS = [
  "Bebidas alcohólica",
  "Bebidas no alcohólica",
  "Snacks",
  "Confitería",
  "Abarrotes",
  "Lácteos",
  "Cárnicos",
  "Cárnicos congelados",
  "Verduras",
  "Productos de aseo",
  "Papelería",
  "Productos de aseo de hogar",
];

export default function ProductosAdminPage() {
  const [productos, setProductos] = useState<any[]>([]);
  const [filtroOrden, setFiltroOrden] = useState("recientes");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [cargando, setCargando] = useState(true);

  const router = useRouter();

  // 🔹 CARGAR PRODUCTOS
  const cargarProductos = async () => {
    setCargando(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  // 🔹 FILTROS
  const productosFiltrados = productos
    .slice()
    .sort((a, b) => {
      if (filtroOrden === "recientes") {
        return (
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
        );
      }

      if (filtroOrden === "antiguos") {
        return (
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
        );
      }

      return 0;
    })
    .filter((p) =>
      filtroOrden === "bajo-stock" ? p.stock < 10 : true
    )
    .filter((p) =>
      filtroCategoria === "todas"
        ? true
        : p.categoria === filtroCategoria
    );

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-10">
      <div className="max-w-7xl mx-auto bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-xl">

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 text-center text-gray-800">
          📦 Administración de Productos
        </h1>

        {/* BARRA SUPERIOR RESPONSIVE */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between mb-6 gap-4">
          <Link
            href="/admin/productos/nuevo"
            className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white px-5 py-3 rounded-lg shadow-lg font-semibold text-center transition-all border-b-4 border-green-800 active:border-b-2 active:translate-y-0.5 hover:shadow-xl"
          >
            + Nuevo Producto
          </Link>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* ORDEN */}
            <select
              value={filtroOrden}
              onChange={(e) => setFiltroOrden(e.target.value)}
              className="border-2 border-gray-300 p-3 rounded-lg shadow bg-white text-gray-700 font-semibold focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            >
              <option value="recientes">📅 Más recientes</option>
              <option value="antiguos">🕐 Más antiguos</option>
              <option value="bajo-stock">⚠️ Stock &lt; 10</option>
            </select>

            {/* CATEGORÍAS */}
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="border-2 border-gray-300 p-3 rounded-lg shadow bg-white text-gray-700 font-semibold focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            >
              <option value="todas">🏷️ Todas las categorías</option>
              {CATEGORIAS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4 text-sm text-gray-600 font-medium">
          Mostrando <span className="font-bold text-gray-800">{productosFiltrados.length}</span> producto{productosFiltrados.length !== 1 ? 's' : ''}
          {filtroCategoria !== "todas" && <span> en categoría <span className="font-bold">{filtroCategoria}</span></span>}
        </div>

        <div className="lg:hidden space-y-4">
          {productosFiltrados.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="text-6xl mb-4 opacity-20">📦</div>
              <p className="text-gray-500 text-lg font-medium">
                No hay productos con estos filtros
              </p>
            </div>
          ) : (
            productosFiltrados.map((p) => (
              <div
                key={p.id}
                className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow"
              >
                {/* Header de la card */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800 mb-1">
                      {p.nombre}
                    </h3>
                    <p className="text-sm text-gray-500">
                      ID: {p.id} • {p.categoria || "Sin categoría"}
                    </p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                      p.stock < 10
                        ? "bg-red-100 text-red-700 border-2 border-red-300"
                        : "bg-green-100 text-green-700 border-2 border-green-300"
                    }`}
                  >
                    {p.stock < 10 ? "⚠️" : "✓"} Stock: {p.stock}
                  </div>
                </div>

                {/* Precio */}
                <div className="mb-4">
                  <span className="text-2xl font-black text-gray-800">
                    ${p.precio}
                  </span>
                </div>

                {/* Botones */}
                <div className="flex gap-2">
                  <Link
                    href={`/admin/productos/editar/${p.id}`}
                    className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg font-semibold text-center transition-all border-b-4 border-blue-800 active:border-b-2 active:translate-y-0.5"
                  >
                    Editar
                  </Link>

                  <button
                    className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-lg font-semibold transition-all border-b-4 border-red-800 active:border-b-2 active:translate-y-0.5"
                    onClick={async () => {
                      if (!confirm(`¿Eliminar "${p.nombre}"?`)) return;
                      await fetch(`${API_URL}/${p.id}`, {
                        method: "DELETE",
                      });
                      cargarProductos();
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* VISTA DESKTOP - TABLA */}
        <div className="hidden lg:block overflow-hidden rounded-xl shadow-lg border-2 border-gray-200">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="p-4 text-left font-semibold">ID</th>
                <th className="p-4 text-left font-semibold">Nombre</th>
                <th className="p-4 text-left font-semibold">Precio</th>
                <th className="p-4 text-left font-semibold">Stock</th>
                <th className="p-4 text-left font-semibold">Categoría</th>
                <th className="p-4 text-center font-semibold">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {productosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-10">
                    <div className="text-6xl mb-4 opacity-20">📦</div>
                    <p className="text-gray-500 text-lg font-medium">
                      No hay productos con estos filtros
                    </p>
                  </td>
                </tr>
              ) : (
                productosFiltrados.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-semibold text-gray-600">{p.id}</td>
                    <td className="p-4 font-bold text-gray-800">{p.nombre}</td>
                    <td className="p-4 font-black text-gray-900">${p.precio}</td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-bold ${
                          p.stock < 10
                            ? "bg-red-100 text-red-700 border-2 border-red-300"
                            : "bg-green-100 text-green-700 border-2 border-green-300"
                        }`}
                      >
                        {p.stock < 10 ? "⚠️" : "✓"} {p.stock}
                      </span>
                    </td>

                    <td className="p-4 text-gray-600">
                      {p.categoria || "Sin categoría"}
                    </td>

                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <Link
                          href={`/admin/productos/editar/${p.id}`}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all hover:scale-105"
                        >
                          Editar
                        </Link>

                        <button
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all hover:scale-105"
                          onClick={async () => {
                            if (!confirm(`¿Eliminar "${p.nombre}"?`)) return;
                            await fetch(`${API_URL}/${p.id}`, {
                              method: "DELETE",
                            });
                            cargarProductos();
                          }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={() => router.push("/admin/dashboard")}
          className="mt-8 bg-gray-700 hover:bg-gray-800 active:bg-gray-900 text-white py-3 px-6 rounded-xl text-lg font-semibold transition-all w-full shadow-lg border-b-4 border-gray-900 active:border-b-2 active:translate-y-0.5"
        >
          Volver al Panel Principal
        </button>

      </div>
    </div>
  );
}