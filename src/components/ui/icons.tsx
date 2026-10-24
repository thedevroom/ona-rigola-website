type IconProps = {
  className?: string;
};

/** Flecha de acción, alineada con los botones de la referencia. */
export function ArrowRight({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="14"
      height="10"
      viewBox="0 0 14 10"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M0 5h12.2M8.4 1 12.6 5l-4.2 4" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

/** Asterisco de cuatro puntas: símbolo de marca. */
export function StarGlyph({ className, size = 16 }: IconProps & { size?: number }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 1.5c.9 5.2 2.9 8.6 10.5 10.5C14.9 13.9 12.9 17.3 12 22.5 11.1 17.3 9.1 13.9 1.5 12 9.1 10.1 11.1 6.7 12 1.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Punto de la etiqueta de actividad profesional. */
export function StatusDot({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="6"
      height="6"
      viewBox="0 0 6 6"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="3" cy="3" r="3" fill="currentColor" />
    </svg>
  );
}

export function MenuIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="22"
      height="14"
      viewBox="0 0 22 14"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M0 1h22M0 7h22M0 13h22" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

/** Flecha ascendente: vuelta al inicio de la página. */
export function ArrowUp({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="10"
      height="14"
      viewBox="0 0 10 14"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5 13V1.6M1 5.4 5 1.2l4 4.2" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
