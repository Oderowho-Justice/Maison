import styles from "./Brand.module.css";
export function Brand({
  onNavigate,
  className = "",
}: {
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <a
      className={[styles.brand, className].join(" ")}
      href="#/philosophy"
      onClick={onNavigate}
      aria-label="Bellaro Milano home"
    >
      <strong>BELLARO™</strong>
      <span>MILANO</span>
    </a>
  );
}
