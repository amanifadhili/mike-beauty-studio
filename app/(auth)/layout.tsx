/**
 * (auth) Route Group Layout
 * =========================
 * Completely isolated shell — no public Navbar, no Footer, no WhatsApp button.
 * Only applies to the /login page (and any future /forgot-password, /reset, etc.)
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Pure pass-through — the login page owns its own full design
  return <>{children}</>;
}
