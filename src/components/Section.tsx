import React from "react";

export function Section({
  id,
  children,
  variant = "dark",
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  variant?: "dark" | "light";
  className?: string;
}) {
  const bg =
    variant === "dark"
      ? "bg-black border-t border-white/10"
      : "bg-white/[0.02] border-t border-white/[0.06]";
  return (
    <section id={id} className={`${bg} py-20 md:py-24 ${className}`}>
      <div className="max-w-6xl mx-auto px-4 md:px-6">{children}</div>
    </section>
  );
}
