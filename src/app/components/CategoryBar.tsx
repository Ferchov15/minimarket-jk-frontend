"use client";
import { useState } from "react";

interface CategoryBarProps {
  categorias: string[];
  categoriaActiva?: string;
  onSelect?: (categoria: string) => void;
}

export default function CategoryBar({
  categorias,
  categoriaActiva = "todas",
  onSelect,
}: CategoryBarProps) {
  const VISIBLE = 4;
  const [start, setStart] = useState(0);

  const handleSelect = (cat: string) => {
    if (typeof onSelect === "function") onSelect(cat);
  };

  const maxIndex = Math.max(categorias.length - VISIBLE, 0);
  const visibles = categorias.slice(start, start + VISIBLE);

  return (
    /* Contenedor principal con tu color y centrado */
    <div className="bg-[#b36a5e] flex items-center justify-center gap-2 sm:gap-4 px-2 py-3 sm:px-6 rounded-b-[40px] mb-5 shadow-md">
      
      {/* Flecha Izquierda */}
      {categorias.length > VISIBLE && (
        <button
          onClick={() => setStart((p) => Math.max(p - 1, 0))}
          className="bg-white/20 border-none rounded-full text-white text-xl cursor-pointer w-9 h-9 flex items-center justify-center shrink-0 hover:bg-white/30 transition-colors"
        >
          ‹
        </button>
      )}

      {/* BOTÓN TODAS */}
      <button
        onClick={() => handleSelect("todas")}
        className={`bg-transparent border-none font-bold cursor-pointer pb-1.5 whitespace-nowrap transition-all text-sm sm:text-[1.2rem] border-b-[3px] ${
          categoriaActiva === "todas" 
            ? "border-[#4fc3f7] text-white" 
            : "border-transparent text-white/80"
        }`}
      >
        Todas
      </button>

      {/* CATEGORÍAS DINÁMICAS */}
      {visibles.map((cat) => (
        <div key={cat} className="flex items-center gap-2 sm:gap-3">
          {/* Línea separadora vertical (se adapta al tamaño en móvil) */}
          <div className="w-[1px] h-5 bg-white/40 mx-0.5 sm:mx-1" />

          <button
            onClick={() => handleSelect(cat)}
            className={`bg-transparent border-none font-bold cursor-pointer pb-1.5 whitespace-nowrap transition-all text-sm sm:text-[1.2rem] capitalize border-b-[3px] ${
              categoriaActiva === cat 
                ? "border-[#4fc3f7] text-white" 
                : "border-transparent text-white/80"
            }`}
          >
            {cat}
          </button>
        </div>
      ))}

      {/* Flecha Derecha */}
      {categorias.length > VISIBLE && (
        <button
          onClick={() => setStart((p) => Math.min(p + 1, maxIndex))}
          className="bg-white/20 border-none rounded-full text-white text-xl cursor-pointer w-9 h-9 flex items-center justify-center shrink-0 hover:bg-white/30 transition-colors"
        >
          ›
        </button>
      )}
    </div>
  );
}