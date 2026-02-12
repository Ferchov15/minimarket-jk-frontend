"use client";

import { FaSearch, FaCheck, FaTimes } from "react-icons/fa";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPedidos() {
    const [pedidos, setPedidos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const router = useRouter();

    // Obtener pedidos con estado "En proceso"
    const fetchPedidos = async () => {
        setCargando(true);
        try {
            const res = await fetch("https://minimarket-jk-backend.onrender.com/api/pedidos");
            if (!res.ok) throw new Error("No se pudo obtener los pedidos");
            const data = await res.json();

            // Filtrar solo pedidos en proceso
            const filtrados = data.filter((p: any) => p.estado === "En proceso");
            setPedidos(filtrados);
        } catch (error) {
            console.error("ERROR:", error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        fetchPedidos();
    }, []);

    // Cambiar estado del pedido
    const actualizarEstado = async (id: string, nuevoEstado: string) => {
        try {
            const res = await fetch(`https://minimarket-jk-backend.onrender.com/api/pedidos/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ estado: nuevoEstado }),
            });

            if (!res.ok) throw new Error("No se pudo actualizar el pedido");

            // Recargar pedidos actualizados
            fetchPedidos();
        } catch (error) {
            console.error("ERROR:", error);
        }
    };

    if (cargando) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-600 mx-auto mb-4"></div>
                    <p className="text-lg font-semibold text-gray-700">Cargando pedidos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-10">
            {/* BOTÓN FLOTANTE para regresar al dashboard */}
            <button
                onClick={() => router.push("/admin/dashboard")}
                className="fixed bottom-6 right-6 z-50 bg-gray-800 hover:bg-gray-900 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 border-4 border-white"
                title="Regresar al Dashboard"
            >
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            </button>

            <main className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-6 text-center">
                    📦 Pedidos en Proceso
                </h1>

                <div className="mb-4 text-sm text-gray-600 font-medium">
                    Total: <span className="font-bold text-gray-800">{pedidos.length}</span> pedido{pedidos.length !== 1 ? 's' : ''} en proceso
                </div>

                {pedidos.length === 0 ? (
                    <div className="text-center py-16 px-4">
                        <div className="text-6xl mb-4 opacity-20">📦</div>
                        <p className="text-xl text-gray-500 font-medium">
                            No hay pedidos en proceso.
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                            Los nuevos pedidos aparecerán aquí
                        </p>
                    </div>
                ) : (
                    <>

                        <div className="lg:hidden space-y-4">
                            {pedidos.map((pedido: any) => (
                                <div
                                    key={pedido.id}
                                    className="bg-white border-2 border-yellow-300 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow"
                                >
                                    {/* Info del pedido */}
                                    <div className="mb-4">
                                        <h3 className="font-bold text-lg text-gray-800 mb-2">
                                            👤 {pedido.nombreCliente}
                                        </h3>
                                        <div className="flex justify-between items-center">
                                            <span className="text-2xl font-black text-gray-800">
                                                ${pedido.total}
                                            </span>
                                            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-bold border-2 border-yellow-300">
                                                ⏳ En proceso
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Link
                                            href={`/admin/pedidos/${pedido.id}`}
                                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-3 rounded-lg font-semibold transition-all border-b-4 border-blue-800 active:border-b-2 active:translate-y-0.5"
                                        >
                                            <FaSearch size={18} /> Ver Detalles
                                        </Link>

                                        <button
                                            onClick={() => actualizarEstado(pedido.id, "Completado")}
                                            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white px-4 py-3 rounded-lg font-semibold transition-all border-b-4 border-green-800 active:border-b-2 active:translate-y-0.5"
                                        >
                                            <FaCheck size={18} /> Marcar Completado
                                        </button>

                                        <button
                                            onClick={() => actualizarEstado(pedido.id, "Cancelado")}
                                            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-4 py-3 rounded-lg font-semibold transition-all border-b-4 border-red-800 active:border-b-2 active:translate-y-0.5"
                                        >
                                            <FaTimes size={18} /> Cancelar Pedido
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="hidden lg:block overflow-hidden rounded-xl shadow-lg border-2 border-gray-200">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-yellow-600 text-white">
                                        <th className="p-4 text-left font-semibold">Cliente</th>
                                        <th className="p-4 text-left font-semibold">Total</th>
                                        <th className="p-4 text-center font-semibold">Acciones</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200">
                                    {pedidos.map((pedido: any) => (
                                        <tr key={pedido.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4 font-bold text-gray-800">{pedido.nombreCliente}</td>
                                            <td className="p-4 font-black text-gray-900">${pedido.total}</td>

                                            <td className="p-4">
                                                <div className="flex justify-center gap-2 flex-wrap">
                                                    <Link
                                                        href={`/admin/pedidos/${pedido.id}`}
                                                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105"
                                                    >
                                                        <FaSearch size={16} /> Ver
                                                    </Link>

                                                    <button
                                                        onClick={() => actualizarEstado(pedido.id, "Completado")}
                                                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105"
                                                    >
                                                        <FaCheck size={16} /> Completar
                                                    </button>

                                                    <button
                                                        onClick={() => actualizarEstado(pedido.id, "Cancelado")}
                                                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105"
                                                    >
                                                        <FaTimes size={16} /> Cancelar
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

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <Link
                        href="/admin/pedidos/completados"
                        className="flex-1 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold px-6 py-3 rounded-lg shadow-lg text-center transition-all border-b-4 border-green-800 active:border-b-2 active:translate-y-0.5"
                    >
                        Ver Completados
                    </Link>

                    <Link
                        href="/admin/pedidos/cancelados"
                        className="flex-1 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold px-6 py-3 rounded-lg shadow-lg text-center transition-all border-b-4 border-red-800 active:border-b-2 active:translate-y-0.5"
                    >
                        Ver Cancelados
                    </Link>
                </div>

                {/* Botón regresar al final */}
                <button
                    onClick={() => router.push("/admin/dashboard")}
                    className="mt-6 w-full bg-gray-700 hover:bg-gray-800 active:bg-gray-900 text-white py-3 px-6 rounded-xl text-lg font-semibold transition-all shadow-lg border-b-4 border-gray-900 active:border-b-2 active:translate-y-0.5"
                >
                    Volver al Panel Principal
                </button>
            </main>
        </div>
    );
}