import Link from "next/link";
import { IconHome } from "@/components/ui/Icons";

interface BreadcrumbsProps {
  items: { label: string; href?: string }[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="border-b border-[var(--boodmo-border)] bg-white px-4 py-3">
      <div className="boodmo-container flex items-center gap-2 text-xs text-[var(--boodmo-text-muted)]">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <span style={{ color: "var(--boodmo-border)" }}>&#62;</span>}
            {item.href ? (
              <Link href={item.href} className="hover:opacity-80" style={{ color: "var(--boodmo-blue)" }}>
                {item.label === "Home" ? 
					<IconHome/>: item.label}
              </Link>
            ) : (
              <span className="font-medium" style={{ color: "var(--boodmo-text)" }}>{item.label}</span>
            )}
          </span>
        ))}
      </div>
    </nav>
  );
}
