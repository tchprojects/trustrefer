"use client";

const brands = [
  { name: "Octopus Energy", src: "/images/link_icons/octopus_energy.png" },
  { name: "Starlink", src: "/images/link_icons/starlink-logo-01.png" },
  { name: "Tesla", src: "/images/link_icons/tesla.png" },
  { name: "Interactive Investor", src: "/images/link_icons/interactiveinvestor.png" },
  { name: "TopCashback", src: "/images/link_icons/topcashback.jpg" },
  { name: "Hostinger", src: "/images/link_icons/hostinger.png" },
  { name: "Rotimatic", src: "/images/link_icons/rotimatic.png" },
];

export function BrandTicker() {
  return (
    <div className="relative my-6 overflow-hidden">
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-black to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-black to-transparent" />

      {/* Outer track — two identical sets side by side, first set animates off-screen then resets */}
      <div className="flex w-max">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1}
            className="flex gap-6 px-3"
            style={{
              animation: "ticker 13.5s linear infinite",
            }}
          >
            {brands.map((brand) => (
              <div
                key={brand.name}
                className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#111] p-1.5"
              >
                <img
                  src={brand.src}
                  alt={brand.name}
                  className="h-full w-full object-contain"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
