"use client";

import { FaWhatsapp, FaShoppingCart } from "react-icons/fa";
import Link from "next/link";
import { useCart } from "../../context/CartContext";

interface NavbarProps {
  search: string;
  onSearch: (value: string) => void;
}

export default function Navbar({ search, onSearch }: NavbarProps) {
  const { getTotalItems } = useCart();

  return (
    <header
      style={{
        backgroundColor: "#e53935", 
        padding: "0.8rem 1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        color: "white",
        flexWrap: "wrap",
      }}
    >
      {/* LOGO */}
      <Link
        href="/"
        className="text-white font-bold text-2xl hover:text-yellow-300 transition"
      >
        MINIMARKET F.J
      </Link>

      
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          flexGrow: 1,
          justifyContent: "center",
          maxWidth: "500px",
        }}
      >
        <input
          type="text"
          placeholder="Buscar producto"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          style={{
            padding: "0.4rem 0.8rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            width: "70%",
            backgroundColor: "#fff",
            color: "#000",
          }}
        />

      </div>

      {/*  CARRITO */}
      <Link href="/carrito" className="relative">
        <FaShoppingCart
          size={36}
          className="text-white hover:text-gray-200 cursor-pointer"
        />
        <span
          className="absolute -top-2 -right-2 bg-white text-black text-xs font-bold rounded-full px-1"
          style={{ minWidth: "18px", textAlign: "center" }}
        >
          {getTotalItems()}
        </span>
      </Link>

      {/*  ADMIN */}
      <Link
        href="/admin/login"
        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition"
      >
        Iniciar Sesión
      </Link>
    </header>
  );
}
