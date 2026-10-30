import logo from "../../assets/astroid.svg";
import MetallicPaint from "./MetallicPaint";

export default function AstroidMark({ className, style }) {
  return (
    <div
      className={["astroid-mark", className].filter(Boolean).join(" ")}
      aria-hidden="true"
      style={{ position: "relative", width: "100%", aspectRatio: "1 / 1", ...style }}
    >
      <span
        className="astroid-mark__fallback"
        style={{ "--astroid-image": `url("${logo}")` }}
      />
      <MetallicPaint
        imageSrc={logo}
        color="#f2c46b"
        dispersion={0.15}
        scale={1}
        intro={false}
        style={{ position: "relative", zIndex: 1 }}
      />
    </div>
  );
}
