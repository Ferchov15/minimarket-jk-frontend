"use client";

import { FaShoppingCart } from "react-icons/fa";
import Link from "next/link";
import { useCart } from "../../context/CartContext";

interface NavbarProps {
  search: string;
  onSearch: (value: string) => void;
}

export default function Navbar({ search, onSearch }: NavbarProps) {
  const { getTotalItems } = useCart();

  return (
    <header className="bg-[#e53935] p-4 flex flex-wrap items-center justify-between gap-4 text-white shadow-md">
      {/* LOGO */}
      <Link 
        href="/" 
        className="font-bold text-xl sm:text-2xl hover:text-yellow-300 transition shrink-0"
      >
        MINIMARKET F.J
      </Link>

      {/* BUSCADOR: bg-white asegura el fondo blanco */}
      <div className="order-3 md:order-2 w-full md:w-auto flex-grow max-w-lg">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border-none bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
        />
      </div>

      {/* ICONOS Y LOGIN */}
      <div className="order-2 md:order-3 flex items-center gap-3 sm:gap-5">
        <Link href="/carrito" className="relative p-1">
          <FaShoppingCart size={28} className="hover:text-yellow-300 transition cursor-pointer" />
          {getTotalItems() > 0 && (
            <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-[#e53935]">
              {getTotalItems()}
            </span>
          )}
        </Link>

        <Link
          href="/admin/login"
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition whitespace-nowrap shadow-sm"
        >
          Iniciar Sesión
        </Link>
      </div>
    </header>
  );
}