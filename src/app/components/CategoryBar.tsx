"use client";
import { useState } from "react";

/* ---------- PROPS ---------- */
interface CategoryBarProps {
  categorias: string[];
  categoriaActiva?: string;
  onSelect?: (categoria: string) => void;
}

/* ---------- COMPONENTE ---------- */
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
    <div style={containerStyle}>
      {categorias.length > VISIBLE && (
        <button
          onClick={() => setStart((p) => Math.max(p - 1, 0))}
          style={arrowStyle}
        >
          ‹
        </button>
      )}

      {/* TODAS */}
      <button
        onClick={() => handleSelect("todas")}
        style={buttonStyle(categoriaActiva === "todas")}
      >
        Todas
      </button>

      {visibles.map((cat) => (
        <div key={cat} style={itemWrapper}>
          <div style={lineSeparator} />

          <button
            onClick={() => handleSelect(cat)}
            style={buttonStyle(categoriaActiva === cat)}
          >
            {cat}
          </button>
        </div>
      ))}

      {categorias.length > VISIBLE && (
        <button
          onClick={() => setStart((p) => Math.min(p + 1, maxIndex))}
          style={arrowStyle}
        >
          ›
        </button>
      )}
    </div>
  );
}

/* ---------- ESTILOS (SIN CAMBIOS) ---------- */
const containerStyle: React.CSSProperties = {
  backgroundColor: "#b36a5e",
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  padding: "0.8rem 1.2rem",
  borderRadius: "0 0 40px 40px",
  marginBottom: "1.2rem",
  justifyContent: "center",
};

const buttonStyle = (activo: boolean): React.CSSProperties => ({
  background: "transparent",
  border: "none",
  color: "white",
  fontWeight: "bold",
  fontSize: "1.2rem",
  cursor: "pointer",
  paddingBottom: "6px",
  borderBottom: activo
    ? "3px solid #4fc3f7"
    : "3px solid transparent",
  whiteSpace: "nowrap",
});

const arrowStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.15)",
  border: "none",
  borderRadius: "50%",
  color: "white",
  fontSize: "1.6rem",
  cursor: "pointer",
  width: "36px",
  height: "36px",
};

const itemWrapper: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.6rem",
};

const lineSeparator: React.CSSProperties = {
  width: "1px",
  height: "24px",
  backgroundColor: "rgba(255,255,255,0.5)",
  margin: "0 0.6rem",
};
