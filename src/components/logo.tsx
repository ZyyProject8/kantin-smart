import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <img src="/image/logobaru.png" alt="Smart Kantin" className="h-10 w-auto object-contain drop-shadow-sm" />
      <span className="font-display text-lg font-bold tracking-tight">
        Smart<span className="text-primary">Kantin</span>
      </span>
    </Link>
  );
}
