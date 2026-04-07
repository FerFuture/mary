"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  images: string[];
};

export function CollarPromoRotator({ images }: Props) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = window.setInterval(() => {
      setIdx((i) => (i + 1) % images.length);
    }, 2600);
    return () => window.clearInterval(id);
  }, [images.length]);

  if (images.length === 0) {
    return <div className="h-full w-full bg-cream-dark/70" />;
  }

  return (
    <div className="relative h-full w-full">
      {images.map((src, i) => (
        <Image
          key={`${src}-${i}`}
          src={src}
          alt=""
          fill
          className={`object-cover object-center transition-opacity duration-700 ${
            i === idx ? "opacity-90" : "opacity-0"
          }`}
          sizes="200px"
        />
      ))}
    </div>
  );
}
