"use client";

import { useState } from "react";

function WhatsAppIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M20.52 3.48C19.05 2.02 17.03 1.2 14.9 1.2C10.55 1.2 7.03 4.73 7.03 9.06C7.03 10.47 7.42 11.86 8.16 13.08L7 21L15.07 19.74C16.33 20.52 17.76 20.94 19.24 20.94C23.57 20.94 27.1 17.41 27.1 13.08C27.1 10.97 26.28 8.94 24.82 7.47"
        fill="#25D366"
        opacity="0.0001"
      />
      <path
        d="M12.05 2.75c-5.1 0-9.25 4.15-9.25 9.25 0 1.63.43 3.23 1.25 4.63L2 22l5.57-1.86c1.36.75 2.92 1.15 4.48 1.15 5.1 0 9.25-4.15 9.25-9.25s-4.15-9.25-9.25-9.25Z"
        fill="#25D366"
      />
      <path
        d="M14.93 13.33c-.17-.08-.97-.48-1.12-.54-.15-.05-.26-.08-.37.08-.11.17-.42.54-.51.65-.1.11-.19.12-.36.04-.17-.08-.72-.27-1.37-.84-.51-.45-.85-1.01-.95-1.18-.1-.17-.01-.27.07-.34.07-.07.17-.19.25-.29.08-.1.11-.17.17-.28.05-.11.03-.2-.01-.28-.05-.08-.37-.91-.5-1.25-.13-.34-.26-.28-.37-.28h-.31c-.11 0-.29.04-.44.2-.15.17-.56.55-.56 1.34s.57 1.57.65 1.67c.08.11 1.12 1.71 2.7 2.4.38.17.68.26.92.33.39.12.75.1 1.03.06.31-.05.97-.4 1.1-.79.14-.38.14-.71.1-.79-.04-.08-.15-.12-.32-.2Z"
        fill="white"
      />
    </svg>
  );
}

export function WhatsAppFloatingButton() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label="WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-maroon shadow-lg ring-1 ring-black/10 transition hover:scale-[1.03]"
      onClick={() => {
        // Por ahora no tenés el link configurado.
        // Esto evita navegar a un destino vacío y te avisa para luego setearlo.
        window.alert(
          "En breve te dejamos el link de WhatsApp. Gracias por tu paciencia."
        );
        setVisible(true);
      }}
    >
      <WhatsAppIcon />
    </button>
  );
}

