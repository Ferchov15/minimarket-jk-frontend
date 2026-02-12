"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";

export default function PedidosCompletados() {
    const [pedidos, setPedidos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const router = useRouter();

    const fetchPedidos = async () => {
        setCargando(true);
        try {
            const res = await fetch("https://minimarket-jk-backend.onrender.com/api/pedidos");
            if (!res.ok) throw new Error("Error al obtener pedidos");

            const data = await res.json();
            const filtrados = data.filter((p: any) => p.estado === "Completado");
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

    if (cargando) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
                    <p className="text-lg font-semibold text-gray-700">Cargando pedidos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-10">
            <main className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-6 text-center">
                    ✅ Pedidos Completados
                </h1>

                {/* Contador */}
                <div className="mb-4 text-sm text-gray-600 font-medium">
                    Total: <span className="font-bold text-gray-800">{pedidos.length}</span> pedido{pedidos.length !== 1 ? 's' : ''} completado{pedidos.length !== 1 ? 's' : ''}
                </div>

                {pedidos.length === 0 ? (
                    <div className="text-center py-16 px-4">
                        <div className="text-6xl mb-4 opacity-20">✅</div>
                        <p className="text-xl text-gray-500 font-medium">
                            No hay pedidos completados.
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                            Los pedidos finalizados aparecerán aquí
                        </p>
                    </div>
                ) : (
                    <>
                        {/* VISTA MOBILE - CARDS */}
                        <div className="lg:hidden space-y-4">
                            {pedidos.map((pedido: any) => (
                                <div
                                    key={pedido.id}
                                    className="bg-white border-2 border-green-300 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow"
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
                                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold border-2 border-green-300">
                                                ✅ Completado
                                            </span>
                                        </div>
                                    </div>

                                    {/* Botón */}
                                    <Link
                                        href={`/admin/pedidos/${pedido.id}`}
                                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-3 rounded-lg font-semibold transition-all border-b-4 border-blue-800 active:border-b-2 active:translate-y-0.5"
                                    >
                                        <FaSearch size={18} /> Ver Detalles
                                    </Link>
                                </div>
                            ))}
                        </div>

                        {/* VISTA DESKTOP - TABLA */}
                        <div className="hidden lg:block overflow-hidden rounded-xl shadow-lg border-2 border-gray-200">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-green-600 text-white">
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
                                                <div className="flex justify-center">
                                                    <Link
                                                        href={`/admin/pedidos/${pedido.id}`}
                                                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105"
                                                    >
                                                        <FaSearch size={16} /> Ver Detalles
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {/* Botón volver */}
                <button
                    onClick={() => router.push("/admin/pedidos")}
                    className="mt-8 w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-6 py-3 rounded-lg shadow-lg font-semibold transition-all border-b-4 border-blue-800 active:border-b-2 active:translate-y-0.5"
                >
                    Volver a Pedidos
                </button>
            </main>
        </div>
    );
}