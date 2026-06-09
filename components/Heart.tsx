"use client";

// Small filled heart, in the spirit of Medium's clap/heart affordance.
export default function Heart({ size = 18 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-full bg-ember/10 hover:bg-ember/20 transition-colors"
      style={{ width: size + 12, height: size + 12 }}
      title="Made with love"
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#f54e00" aria-hidden>
        <path d="M12 21s-6.7-4.35-9.33-7.51C.9 11.2 1.06 8.2 3.1 6.6c1.86-1.45 4.4-1 5.9.86L12 11l3-3.54c1.5-1.86 4.04-2.31 5.9-.86 2.04 1.6 2.2 4.6.43 6.89C18.7 16.65 12 21 12 21z" />
      </svg>
    </span>
  );
}
