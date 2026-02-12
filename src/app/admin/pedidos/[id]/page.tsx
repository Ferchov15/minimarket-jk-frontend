"use client";

import { useEffect, useState } from "react";
import { FaReceipt, FaArrowLeft } from "react-icons/fa";
import { useParams, useRouter } from "next/navigation";

export default function PedidoDetalleCliente() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [pedido, setPedido] = useState<any>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPedido = async () => {
      try {
        const res = await fetch(
          `https://minimarket-jk-backend.onrender.com/api/pedidos/${id}`,
          { credentials: "include" }
        );

        if (!res.ok) throw new Error("Error al obtener el pedido");

        const data = await res.json();
        setPedido(data);
      } catch (error) {
        console.error("ERROR:", error);
      } finally {
        setCargando(false);
      }
    };

    fetchPedido();
  }, [id]);

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">Cargando pedido...</p>
        </div>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-xl text-gray-600">Pedido no encontrado</p>
          <button
            onClick={() => router.push("/admin/pedidos")}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 sm:p-6 lg:p-10 flex justify-center items-start">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 border-2 border-gray-200 my-8">

        {/* Encabezado */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <FaReceipt size={28} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Pedido #{pedido.id}
            </h1>
            <p className="text-gray-500 text-sm">Detalle completo del pedido</p>
          </div>
        </div>

        {/* Información del pedido */}
        <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-5 mb-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Cliente */}
            <div>
              <p className="text-sm text-gray-500 font-semibold mb-1">Cliente</p>
              <p className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span>👤</span> {pedido.nombreCliente}
              </p>
            </div>

            {/* Estado */}
            <div>
              <p className="text-sm text-gray-500 font-semibold mb-1">Estado</p>
              <span
                className={`inline-block px-4 py-2 rounded-full text-white font-bold ${
                  pedido.estado === "Completado"
                    ? "bg-green-600"
                    : pedido.estado === "Cancelado"
                    ? "bg-red-600"
                    : "bg-yellow-600"
                }`}
              >
                {pedido.estado === "Completado" ? "✅" : pedido.estado === "Cancelado" ? "❌" : "⏳"} {pedido.estado}
              </span>
            </div>

            {/* Método de pago */}
            <div>
              <p className="text-sm text-gray-500 font-semibold mb-1">Método de Pago</p>
              <span
                className={`inline-block px-4 py-2 rounded-full text-white font-bold ${
                  pedido.metodoPago === "EFECTIVO"
                    ? "bg-green-600"
                    : "bg-purple-600"
                }`}
              >
                {pedido.metodoPago === "EFECTIVO" ? "💵" : "💳"} {pedido.metodoPago}
              </span>
            </div>

            {/* Fecha */}
            <div>
              <p className="text-sm text-gray-500 font-semibold mb-1">Fecha del Pedido</p>
              <p className="text-base font-bold text-gray-800 flex items-center gap-2">
                <span>📅</span> {new Date(pedido.fecha).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Productos */}
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">📦 Productos</h2>

        {/* VISTA MOBILE - CARDS */}
        <div className="sm:hidden space-y-3 mb-6">
          {pedido.productos.map((prod: any, index: number) => (
            <div
              key={index}
              className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-800">{prod.nombre}</h3>
                <span className="text-lg font-black text-gray-900">${prod.precio}</span>
              </div>
              <p className="text-sm text-gray-500">
                Cantidad: <span className="font-bold text-gray-700">{prod.PedidoProducto.cantidad}</span>
              </p>
              <div className="mt-2 pt-2 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Subtotal: <span className="font-bold text-gray-800">${(prod.precio * prod.PedidoProducto.cantidad).toFixed(2)}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden sm:block overflow-hidden rounded-xl shadow-lg border-2 border-gray-200 mb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-6 py-4 text-left font-semibold">Producto</th>
                <th className="px-6 py-4 text-center font-semibold">Cantidad</th>
                <th className="px-6 py-4 text-right font-semibold">Precio Unit.</th>
                <th className="px-6 py-4 text-right font-semibold">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pedido.productos.map((prod: any, index: number) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-800">{prod.nombre}</td>
                  <td className="px-6 py-4 text-center font-semibold text-gray-700">
                    {prod.PedidoProducto.cantidad}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-800">
                    ${prod.precio}
                  </td>
                  <td className="px-6 py-4 text-right font-black text-gray-900">
                    ${(prod.precio * prod.PedidoProducto.cantidad).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mb-6">
          <div className="bg-gray-800 text-white px-8 py-4 rounded-xl shadow-lg border-b-4 border-blue-600">
            <p className="text-gray-300 text-sm font-semibold mb-1">Total a Pagar</p>
            <p className="text-3xl font-black">
              ${pedido.total}
            </p>
          </div>
        </div>

        <button
          onClick={() => router.push("/admin/pedidos")}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-800 active:bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transition-all border-b-4 border-gray-900 active:border-b-2 active:translate-y-0.5"
        >
          <FaArrowLeft /> Volver a Pedidos
        </button>
      </div>
    </div>
  );
}