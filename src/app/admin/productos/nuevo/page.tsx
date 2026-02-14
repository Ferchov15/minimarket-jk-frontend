"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface FormProducto {
  nombre: string;
  descripcion: string;
  precio: string;
  stock: string;
  categoria: string;
}

export default function CrearProductoPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormProducto>({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    categoria: "",
  });

  const [imagen, setImagen] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImage = (file: File) => {
    setImagen(file);
    setPreview(URL.createObjectURL(file));
  };

  const CATEGORIAS = [
    "Bebidas alcohólica",
    "Bebidas no alcohólica",
    "Snacks",
    "Confitería",
    "Abarrotes",
    "Lácteos",
    "Helados",
    "Cárnicos congelados",
    "Verduras",
    "Productos de aseo",
    "Papelería",
    "Productos de aseo de hogar",
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      data.append(key, value);
    });

    if (imagen) data.append("imagen", imagen);

    try {
      const res = await fetch(
        "https://minimarket-jk-backend.onrender.com/api/productos",
        {
          method: "POST",
          body: data,
        }
      );

      if (res.ok) {
        alert("✅ Producto registrado correctamente");
        router.push("/admin/productos");
      } else {
        alert("❌ Error al crear producto");
      }
    } catch {
      alert("❌ Error de servidor");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-100 p-4 sm:p-6 lg:p-10 flex justify-center items-start sm:items-center">
      <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-2xl shadow-2xl max-w-2xl w-full border-2 border-gray-200 my-8">
        {/* Encabezado */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">📦</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Crear Nuevo Producto
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Complete la información del producto para agregarlo al inventario
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label 
              htmlFor="nombre" 
              className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"
            >
              <span className="text-green-600">📝</span>
              Nombre del Producto
            </label>
            <input
              id="nombre"
              name="nombre"
              placeholder="Ej: Coca Cola 2L"
              className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-gray-50 text-gray-800 font-medium"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label 
              htmlFor="descripcion" 
              className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"
            >
              <span className="text-green-600">📄</span>
              Descripción (Opcional)
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              placeholder="Descripción detallada del producto..."
              className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-gray-50 text-gray-800 font-medium h-24 resize-none"
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Precio */}
            <div>
              <label 
                htmlFor="precio" 
                className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"
              >
                <span className="text-green-600">💲</span>
                Precio
              </label>
              <input
                id="precio"
                name="precio"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-gray-50 text-gray-800 font-medium"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label 
                htmlFor="stock" 
                className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"
              >
                <span className="text-green-600">📊</span>
                Stock
              </label>
              <input
                id="stock"
                name="stock"
                type="number"
                placeholder="0"
                className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-gray-50 text-gray-800 font-medium"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label 
              htmlFor="categoria" 
              className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"
            >
              <span className="text-green-600">🏷️</span>
              Categoría
            </label>
            <select
              id="categoria"
              name="categoria"
              className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-gray-50 text-gray-800 font-medium"
              value={form.categoria}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una categoría</option>
              {CATEGORIAS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <span className="text-green-600">🖼️</span>
              Imagen del Producto (Opcional)
            </label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-green-500 transition-all"
              onClick={() =>
                (document.getElementById("fileInput") as HTMLInputElement)?.click()
              }
              onDrop={(e: React.DragEvent<HTMLDivElement>) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file) handleImage(file);
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              {preview ? (
                <div className="space-y-3">
                  <img
                    src={preview}
                    className="w-48 h-48 object-cover mx-auto rounded-lg shadow-lg border-4 border-green-200"
                    alt="Preview"
                  />
                  <p className="text-sm text-green-600 font-semibold">
                    ✓ Imagen seleccionada
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-6xl opacity-30">📷</div>
                  <p className="text-gray-600 font-medium">
                    Arrastra una imagen aquí
                  </p>
                  <p className="text-gray-400 text-sm">
                    o haz clic para seleccionar
                  </p>
                </div>
              )}

              <input
                type="file"
                className="hidden"
                id="fileInput"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImage(file);
                }}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.push("/admin/productos")}
              className="w-full sm:w-1/3 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-700 font-bold py-3 px-6 rounded-lg transition-all border-2 border-gray-300 hover:border-gray-400"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="w-full sm:w-2/3 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all border-b-4 border-green-800 active:border-b-2 active:translate-y-0.5 hover:shadow-xl"
            >
              Crear Producto
            </button>
          </div>
        </form>

        <div className="mt-8 p-4 bg-green-50 border-l-4 border-green-600 rounded-lg">
          <p className="text-sm text-gray-700 flex items-start gap-2">
            <span className="text-green-600 mt-0.5">💡</span>
            <span>
              <strong>Consejo:</strong> Asegúrate de ingresar información precisa. 
              Los campos con asterisco son obligatorios.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}