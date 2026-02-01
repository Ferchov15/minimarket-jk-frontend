"use client";
import { useState, useEffect } from "react";

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
  // 1. Unimos "Todas" al array de categorías para que la lógica de flechas sea uniforme
  const todasLasOpciones = ["todas", ...categorias];
  
  // 2. Estado para el número total de elementos a mostrar (incluyendo "Todas")
  const [limiteVisible, setLimiteVisible] = useState(5);
  const [start, setStart] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setLimiteVisible(2);      // Móvil: Todas + 1 cat
      else if (width < 768) setLimiteVisible(3); // Tablet: Todas + 2 cat
      else if (width < 1024) setLimiteVisible(4); // Desktop pequeño
      else setLimiteVisible(5);                  // Web: Todas + 4 cat
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSelect = (cat: string) => {
    if (typeof onSelect === "function") onSelect(cat);
  };

  // 3. Lógica de paginación sobre el array completo
  const maxIndex = Math.max(todasLasOpciones.length - limiteVisible, 0);
  const visibles = todasLasOpciones.slice(start, start + limiteVisible);

  return (
    <div className="bg-[#b36a5e] flex items-center justify-center gap-1 sm:gap-4 px-3 py-4 rounded-b-[40px] mb-6 shadow-md">
      
      {/* Flecha Izquierda */}
      {todasLasOpciones.length > limiteVisible && (
        <button
          onClick={() => setStart((p) => Math.max(p - 1, 0))}
          className="bg-white/20 hover:bg-white/40 text-white rounded-full w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center shrink-0 transition-transform active:scale-90"
        >
          ‹
        </button>
      )}

      {/* Contenedor de elementos visibles */}
      <div className="flex items-center justify-center overflow-hidden transition-all">
        {visibles.map((cat, index) => (
          <div key={cat} className="flex items-center shrink-0">
            {/* Separador: No se muestra antes del primer elemento visible */}
            {index > 0 && (
              <div className="w-[1px] h-5 bg-white/30 mx-1 sm:mx-2" />
            )}

            <button
              onClick={() => handleSelect(cat)}
              className={`px-3 py-2 font-bold whitespace-nowrap transition-all text-sm sm:text-[1.1rem] capitalize border-b-[3px] shrink-0 ${
                categoriaActiva === cat 
                  ? "border-[#4fc3f7] text-white" 
                  : "border-transparent text-white/70 hover:text-white"
              }`}
            >
              {cat === "todas" ? "Todas" : cat}
            </button>
          </div>
        ))}
      </div>

      {/* Flecha Derecha */}
      {todasLasOpciones.length > limiteVisible && (
        <button
          onClick={() => setStart((p) => Math.min(p + 1, maxIndex))}
          className="bg-white/20 hover:bg-white/40 text-white rounded-full w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center shrink-0 transition-transform active:scale-90"
        >
          ›
        </button>
      )}
    </div>
  );
}