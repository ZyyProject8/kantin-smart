import { Link } from "@tanstack/react-router";
import { UtensilsCrossed } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <div className="grid h-9 w-9 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-soft">
        <UtensilsCrossed className="h-5 w-5" />
      </div>
      <span className="font-display text-lg font-bold tracking-tight">
        Smart<span className="text-primary">Kantin</span>
      </span>
    </Link>
  );
}
