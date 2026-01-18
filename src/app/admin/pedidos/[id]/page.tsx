"use client";

import { useEffect, useState } from "react";
import { FaReceipt, FaArrowLeft } from "react-icons/fa";
import { useParams } from "next/navigation";

export default function PedidoDetalleCliente() {
  const params = useParams();
  const id = params.id as string; // ✅ ESTE ES EL FIX REAL

  const [pedido, setPedido] = useState<any>(null);

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
      }
    };

    fetchPedido();
  }, [id]);

  if (!pedido) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-200">
        <div className="text-xl text-gray-700 animate-pulse">
          Cargando pedido...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200 p-6 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8">

        <div className="flex items-center gap-3 mb-6">
          <FaReceipt size={32} className="text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">
            Detalle del Pedido #{pedido.id}
          </h1>
        </div>

        <div className="bg-gray-50 border rounded-xl p-5 mb-6 space-y-2">
          <p><b>Cliente:</b> {pedido.nombreCliente}</p>

          <p>
            <b>Estado:</b>{" "}
            <span
              className={`px-3 py-1 rounded-full text-white ${
                pedido.estado === "Completado"
                  ? "bg-green-600"
                  : pedido.estado === "Cancelado"
                  ? "bg-red-600"
                  : "bg-yellow-600"
              }`}
            >
              {pedido.estado}
            </span>
          </p>

          <p>
            <b>Método de pago:</b>{" "}
            <span
              className={`px-4 py-1 rounded-full text-white ${
                pedido.metodoPago === "EFECTIVO"
                  ? "bg-green-600"
                  : "bg-purple-600"
              }`}
            >
              {pedido.metodoPago}
            </span>
          </p>

          <p><b>Fecha:</b> {new Date(pedido.fecha).toLocaleString()}</p>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Productos</h2>

        <table className="w-full border">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-2">Producto</th>
              <th className="p-2">Precio</th>
              <th className="p-2">Cantidad</th>
              <th className="p-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {pedido.productos.map((prod: any) => {
              const subtotal =
                prod.PedidoProducto.cantidad * parseFloat(prod.precio);

              return (
                <tr key={prod.id} className="text-center border-b">
                  <td>{prod.nombre}</td>
                  <td>${prod.precio}</td>
                  <td>{prod.PedidoProducto.cantidad}</td>
                  <td>${subtotal.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="flex justify-end mt-6 text-xl font-bold">
          Total: ${pedido.total}
        </div>

        <a
          href="/admin/pedidos"
          className="inline-flex items-center gap-2 mt-6 bg-gray-700 text-white px-5 py-2 rounded-lg"
        >
          <FaArrowLeft /> Volver
        </a>
      </div>
    </div>
  );
}
