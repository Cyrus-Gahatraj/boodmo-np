export function HomeFooter() {
  return (
    <footer className="bg-white py-5">
        <div className="mt-8 border-t border-[var(--boodmo-border)] pt-6 text-center text-xs text-[var(--boodmo-text-muted)]">
          © {new Date().getFullYear()} boodmo. All rights reserved.
        </div>
    </footer>
  );
}
