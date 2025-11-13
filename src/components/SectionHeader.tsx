import React from "react";

export function SectionHeader({
  title,
  subtitle,
  center = true,
}: {
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "text-center mb-12" : "mb-12"}>
      <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-white">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
