"use client";

import { colorDisplayLabel } from "@/lib/product-variants";

type Props = {
  colors: string[];
  labels: Record<string, string>;
  value: string;
  onChange: (key: string) => void;
};

export function ProductColorSelector({
  colors,
  labels,
  value,
  onChange,
}: Props) {
  if (colors.length === 0) return null;

  return (
    <div className="mt-6 border-t border-border pt-6">
      <p className="text-sm font-medium tracking-wide text-foreground">
        Color:{" "}
        <span className="font-semibold uppercase text-maroon">
          {colorDisplayLabel(value, labels)}
        </span>
      </p>
      <div className="mt-3 flex flex-wrap gap-2" role="listbox" aria-label="Color del producto">
        {colors.map((key) => {
          const selected = key === value;
          const text = colorDisplayLabel(key, labels);
          return (
            <button
              key={key}
              type="button"
              role="option"
              aria-selected={selected}
              onClick={() => onChange(key)}
              className={`rounded-lg border-2 px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:ring-2 focus-visible:ring-maroon/40 ${
                selected
                  ? "border-maroon bg-maroon/5 text-maroon shadow-sm"
                  : "border-border text-muted hover:border-maroon/40 hover:text-foreground"
              }`}
            >
              {text.toLowerCase()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
