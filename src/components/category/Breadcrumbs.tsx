import Link from "next/link";

interface BreadcrumbsProps {
  items: { label: string; href?: string }[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="border-b border-[#e2edf7] bg-white px-4 py-3">
      <div className="mx-auto flex max-w-6xl items-center gap-2 text-xs text-[#7c8fa8]">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <span className="text-[#c4d8f0]">&#62;</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-[#0056a6]">
                {item.label === "Home" ? "🏠" : item.label}
              </Link>
            ) : (
              <span className="font-medium text-[#394b63]">{item.label}</span>
            )}
          </span>
        ))}
      </div>
    </nav>
  );
}
