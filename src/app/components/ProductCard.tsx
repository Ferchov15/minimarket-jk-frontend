"use client";
import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";

interface Product {
  id?: number;
  name: string;
  descripcion?: string;
  price: number | string;
  descuento?: number | string;
  image: string;
  stock?: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, cartItems } = useCart();
  const priceNumber = Number(product.price) || 0;
  const descuentoNumber = Number(product.descuento) || 0;
  const productId = Number(product.id);

  const precioFinal = descuentoNumber > 0 
    ? priceNumber - (priceNumber * descuentoNumber) / 100 
    : priceNumber;

  const imageSrc = product.image?.trim() ? product.image : "/product-placeholder.png";
  const [stockVisible, setStockVisible] = useState(product.stock ?? 0);

  useEffect(() => {
    const enCarrito = cartItems.find((p: any) => Number(p.id) === productId)?.quantity || 0;
    const restante = (product.stock ?? 0) - enCarrito;
    setStockVisible(restante >= 0 ? restante : 0);
  }, [cartItems, product.stock, productId]);

  const handleAdd = () => {
    if (stockVisible <= 0) return;
    addToCart({
      id: productId,
      name: product.name,
      price: precioFinal,
      stock: product.stock ?? 0,
      image: product.image,
    });
    setStockVisible((prev) => (prev > 0 ? prev - 1 : 0));
  };

  return (
    <div className="bg-[#4dd0e1] p-3 sm:p-4 rounded-xl shadow-md flex flex-col items-center text-center transition-transform hover:scale-[1.02] h-full">
      <div className="relative w-full h-32 sm:h-40 mb-2">
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-full object-contain"
        />
      </div>

      <h3 className="font-bold text-sm sm:text-base capitalize mb-1 line-clamp-1">
        {product.name}
      </h3>

      <div className="w-full border-b border-black/20 mb-2 pb-2">
        <p className="font-bold text-sm sm:text-lg">
          {descuentoNumber > 0 && (
            <span className="line-through mr-2 text-xs text-gray-700 opacity-70">
              ${priceNumber.toFixed(2)}
            </span>
          )}
          ${precioFinal.toFixed(2)} 
          <span className="text-[10px] ml-1 font-normal">Inc. IVA</span>
        </p>
        
        {descuentoNumber > 0 && (
          <p className="text-red-800 font-bold text-[10px] sm:text-xs">
            🔥 {descuentoNumber}% OFF
          </p>
        )}
      </div>

      <div className="flex-grow w-full mb-3">
        <p className="text-xs text-gray-800 line-clamp-2 mb-2 italic">
          {product.descripcion || "Sin descripción"}
        </p>
        <p className="text-[10px] sm:text-xs">
          Stock: <span className={stockVisible > 0 ? "text-green-700 font-bold" : "text-red-600 font-bold"}>
            {stockVisible > 0 ? `${stockVisible} un.` : "Agotado"}
          </span>
        </p>
      </div>

      <button
        disabled={stockVisible === 0}
        onClick={handleAdd}
        className={`w-full py-2 rounded-lg font-bold text-white text-sm transition-colors ${
          stockVisible === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-[#0288d1] hover:bg-[#01579b]"
        }`}
      >
        {stockVisible === 0 ? "Sin stock" : "+ Agregar"}
      </button>
    </div>
  );
}