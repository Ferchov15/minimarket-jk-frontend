"use client";

import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import CategoryBar from "./components/CategoryBar";
import ProductGrid from "./components/ProductGrid";

const API_URL = "https://minimarket-jk-backend.onrender.com/api/productos";

interface Product {
  id: number;
  nombre: string;
  precio: number;
  descripcion?: string;
  imagenUrl?: string;
  stock: number;
  categoria?: string;
  createdAt?: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [categoriaActiva, setCategoriaActiva] = useState("todas");
  const [search, setSearch] = useState("");
  const [orden, setOrden] = useState("recientes");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Error al obtener productos");
        const data = await res.json();
        const productosSeguros: Product[] = Array.isArray(data) ? data : [];
        setProducts(productosSeguros);

        const categoriasUnicas = [
          ...new Set(
            productosSeguros
              .map((p) => p.categoria)
              .filter((c): c is string => typeof c === "string" && c.trim() !== "")
          ),
        ];
        setCategorias(categoriasUnicas);
      } catch (error) {
        console.error("Error:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const productosFiltrados = products
    .filter((p) => {
      const coincideCategoria = categoriaActiva === "todas" || p.categoria === categoriaActiva;
      const coincideBusqueda = p.nombre.toLowerCase().includes(search.toLowerCase());
      return coincideCategoria && coincideBusqueda;
    })
    .sort((a, b) => {
      if (orden === "recientes") return new Date(b.createdAt ?? "").getTime() - new Date(a.createdAt ?? "").getTime();
      if (orden === "antiguos") return new Date(a.createdAt ?? "").getTime() - new Date(b.createdAt ?? "").getTime();
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar search={search} onSearch={setSearch} />
      
      <CategoryBar
        categorias={categorias}
        categoriaActiva={categoriaActiva}
        onSelect={setCategoriaActiva}
      />

      <main className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 md:px-8 mt-6 gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Productos Destacados
          </h2>

          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 bg-white shadow-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="recientes">Más recientes</option>
            <option value="antiguos">Más antiguos</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg animate-pulse text-gray-600">Cargando productos...</p>
          </div>
        ) : (
          <ProductGrid
            products={productosFiltrados.map((p) => ({
              id: p.id,
              name: p.nombre,
              descripcion: p.descripcion,
              stock: p.stock,
              price: p.precio,
              image: p.imagenUrl || "/product-placeholder.png",
            }))}
          />
        )}

        {!loading && productosFiltrados.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No se encontraron productos en esta categoría.</p>
          </div>
        )}
      </main>
    </div>
  );
}