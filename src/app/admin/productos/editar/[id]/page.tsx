"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

const API_URL = "https://minimarket-jk-backend.onrender.com/api/productos";

export default function EditarProducto() {
    const { id } = useParams();
    const router = useRouter();

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

    const [form, setForm] = useState({
        nombre: "",
        precio: "",
        descripcion: "",
        stock: "",
        categoria: "",
        imagenActual: "",
    });

    const [nuevaImagen, setNuevaImagen] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const getProduct = async () => {
            try {
                const res = await fetch(`${API_URL}/${id}`);
                const data = await res.json();

                setForm({
                    nombre: data.nombre,
                    precio: data.precio,
                    descripcion: data.descripcion ?? "",
                    stock: data.stock,
                    categoria: data.categoria ?? "",
                    imagenActual: data.imagenUrl || "",
                });
            } catch (error) {
                console.error("Error al cargar producto:", error);
                alert("❌ Error al cargar el producto");
            } finally {
                setCargando(false);
            }
        };

        if (id) getProduct();
    }, [id]);

    const handleImage = (file: File | null) => {
        if (!file) return;
        setNuevaImagen(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("nombre", form.nombre);
        formData.append("precio", form.precio);
        formData.append("descripcion", form.descripcion);
        formData.append("stock", form.stock);
        formData.append("categoria", form.categoria);

        if (nuevaImagen) {
            formData.append("imagen", nuevaImagen);
        }

        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                body: formData,
            });

            if (res.ok) {
                alert("✅ Producto actualizado correctamente");
                router.push("/admin/productos");
            } else {
                alert("❌ Error al actualizar el producto");
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
                    <p className="text-lg font-semibold text-gray-700">Cargando producto...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 sm:p-6 lg:p-10 flex justify-center items-start sm:items-center">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 border-2 border-gray-200 my-8">
                {/* Encabezado */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">✏️</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                        Editar Producto
                    </h1>
                    <p className="text-gray-500 text-sm sm:text-base">
                        Actualice la información del producto en el inventario
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Nombre */}
                    <div>
                        <label 
                            htmlFor="nombre"
                            className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"
                        >
                            <span className="text-blue-600">📝</span>
                            Nombre del Producto
                        </label>
                        <input
                            id="nombre"
                            type="text"
                            value={form.nombre}
                            onChange={(e) =>
                                setForm({ ...form, nombre: e.target.value })
                            }
                            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-gray-50 text-gray-800 font-medium"
                            required
                        />
                    </div>

                    {/* Precio y Stock en Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Precio */}
                        <div>
                            <label 
                                htmlFor="precio"
                                className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"
                            >
                                <span className="text-blue-600">💲</span>
                                Precio ($)
                            </label>
                            <input
                                id="precio"
                                type="number"
                                step="0.01"
                                value={form.precio}
                                onChange={(e) =>
                                    setForm({ ...form, precio: e.target.value })
                                }
                                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-gray-50 text-gray-800 font-medium"
                                required
                            />
                        </div>

                        {/* Stock */}
                        <div>
                            <label 
                                htmlFor="stock"
                                className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"
                            >
                                <span className="text-blue-600">📊</span>
                                Stock
                            </label>
                            <input
                                id="stock"
                                type="number"
                                value={form.stock}
                                onChange={(e) =>
                                    setForm({ ...form, stock: e.target.value })
                                }
                                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-gray-50 text-gray-800 font-medium"
                                required
                            />
                        </div>
                    </div>

                    {/* Categoría */}
                    <div>
                        <label 
                            htmlFor="categoria"
                            className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"
                        >
                            <span className="text-blue-600">🏷️</span>
                            Categoría
                        </label>
                        <select
                            id="categoria"
                            value={form.categoria}
                            onChange={(e) =>
                                setForm({ ...form, categoria: e.target.value })
                            }
                            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-gray-50 text-gray-800 font-medium"
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
                        <label 
                            htmlFor="descripcion"
                            className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"
                        >
                            <span className="text-blue-600">📄</span>
                            Descripción (Opcional)
                        </label>
                        <textarea
                            id="descripcion"
                            value={form.descripcion}
                            onChange={(e) =>
                                setForm({ ...form, descripcion: e.target.value })
                            }
                            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-gray-50 text-gray-800 font-medium h-24 resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                            <span className="text-blue-600">🖼️</span>
                            Imagen del Producto (Opcional)
                        </label>

                        <div
                            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-blue-500 transition-all"
                            onDrop={(e) => {
                                e.preventDefault();
                                handleImage(e.dataTransfer.files[0]);
                            }}
                            onDragOver={(e) => e.preventDefault()}
                            onClick={() =>
                                document.getElementById("fileInput")?.click()
                            }
                        >
                            {preview ? (
                                <div className="space-y-3">
                                    <img
                                        src={preview}
                                        className="w-48 h-48 object-cover mx-auto rounded-lg shadow-lg border-4 border-blue-200"
                                        alt="Nueva imagen"
                                    />
                                    <p className="text-sm text-blue-600 font-semibold">
                                        ✓ Nueva imagen seleccionada
                                    </p>
                                </div>
                            ) : form.imagenActual ? (
                                <div className="space-y-3">
                                    <img
                                        src={form.imagenActual}
                                        className="w-48 h-48 object-cover mx-auto rounded-lg shadow-lg border-4 border-gray-200"
                                        alt="Imagen actual"
                                    />
                                    <p className="text-sm text-gray-600 font-medium">
                                        Imagen actual (haz clic para cambiar)
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
                                id="fileInput"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) =>
                                    handleImage(e.target.files?.[0] || null)
                                }
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
                            className="w-full sm:w-2/3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all border-b-4 border-blue-800 active:border-b-2 active:translate-y-0.5 hover:shadow-xl"
                        >
                            💾 Guardar Cambios
                        </button>
                    </div>
                </form>

                <div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-600 rounded-lg">
                    <p className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">💡</span>
                        <span>
                            <strong>Nota:</strong> Los cambios se aplicarán inmediatamente después de guardar.
                            {nuevaImagen && " Se reemplazará la imagen actual."}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}