"use client";

export function FlowerBackground() {
  return (
    <div
      className="fixed inset-0 -z-10"
      aria-hidden
      style={{
        backgroundColor: "var(--cream)",
        backgroundImage: "url(/background2.jpeg)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    />
  );
}
