import React from "react";

const blobs = [
  {
    top: "-8%",
    left: "-10%",
    width: "48%",
    height: "34%",
    rotate: "-6deg",
    delay: "0s",
  },
  {
    top: "55%",
    left: "-6%",
    width: "54%",
    height: "36%",
    rotate: "8deg",
    delay: "4s",
  },
  {
    top: "8%",
    right: "-10%",
    width: "45%",
    height: "32%",
    rotate: "10deg",
    delay: "2s",
  },
  {
    bottom: "-10%",
    right: "-5%",
    width: "50%",
    height: "36%",
    rotate: "-8deg",
    delay: "6s",
  },
];
const particles = Array.from({ length: 90 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  size: Math.random() * 3 + 1,
  opacity: Math.random() * 0.5 + 0.2,
  delay: `${Math.random() * 6}s`,
}));
const contours = [
  {
    top: "5%",
    left: "-12%",
    width: "55%",
    height: "38%",
    rotate: "-10deg",
  },
  {
    top: "55%",
    left: "-8%",
    width: "48%",
    height: "34%",
    rotate: "8deg",
  },
  {
    top: "8%",
    right: "-10%",
    width: "48%",
    height: "34%",
    rotate: "12deg",
  },
  {
    bottom: "-8%",
    right: "-8%",
    width: "55%",
    height: "40%",
    rotate: "-8deg",
  },
];
const PageBackground = () => {
  return (
    <>
      <style>{`
@keyframes floatLuxury{
  0%,100%{
    transform:translateY(0px) rotate(var(--rotate));
  }
  50%{
    transform:translateY(-18px) rotate(calc(var(--rotate) + 2deg));
  }
}

@keyframes particleFloat{
  0%,100%{
    transform:translateY(0px);
    opacity:.35;
  }

  50%{
    transform:translateY(-12px);
    opacity:1;
  }
}
  @keyframes contourFloat {

  0%,
  100% {
    transform: translateY(0px) rotate(var(--r));
  }

  50% {
    transform: translateY(-14px) rotate(calc(var(--r) + 1deg));
  }
}

.contour {
  animation: contourFloat 26s ease-in-out infinite;
}

.luxury-shape{
  animation:floatLuxury 22s ease-in-out infinite;
  animation-delay:var(--delay);
}

.gold-particle{
  animation:particleFloat 7s ease-in-out infinite;
}
`}</style>

      <div className="fixed inset-0 -z-50 overflow-hidden bg-[#071018] pointer-events-none">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#08131c] via-[#061019] to-[#03060b]" />

        {/* Center Glow */}
        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300/5 blur-[170px]" />

        {blobs.map((blob, index) => (
          <div
            key={index}
            className="luxury-shape absolute overflow-hidden rounded-[45%]"
            style={{
              ...blob,
              border: "1px solid rgba(226,180,90,.12)",
              background:
                "radial-gradient(circle at center,rgba(255,195,90,.03),transparent 70%)",
              backdropFilter: "blur(2px)",
              "--rotate": blob.rotate,
              "--delay": blob.delay,
            }}
          >
            {[...Array(18)].map((_, i) => (
              <div
                key={i}
                className="absolute left-[-10%] right-[-10%] rounded-full"
                style={{
                  top: `${i * 18}px`,
                  height: "180%",
                  borderTop: "1px solid rgba(232,185,90,.45)",
                  opacity: 0.9 - i * 0.03,
                  transform: `scale(${1 + i * 0.05})`,
                }}
              />
            ))}
          </div>
        ))}
        {/* Decorative Islands */}
        <div className="absolute left-[8%] top-[12%] h-52 w-72 rounded-[50%] border border-amber-300/15 bg-gradient-to-br from-amber-300/5 to-transparent blur-[1px]" />

        <div className="absolute right-[10%] top-[22%] h-40 w-64 rounded-[50%] border border-amber-300/15 bg-gradient-to-br from-amber-300/5 to-transparent blur-[1px]" />

        <div className="absolute left-[60%] bottom-[8%] h-44 w-72 rounded-[50%] border border-amber-300/15 bg-gradient-to-br from-amber-300/5 to-transparent blur-[1px]" />

        {/* Gold Dust */}
        {particles.map((p) => (
          <span
            key={p.id}
            className="gold-particle absolute rounded-full bg-amber-300"
            style={{
              left: p.left,
              top: p.top,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              animationDelay: p.delay,
              boxShadow: "0 0 8px rgba(255,190,90,.45)",
            }}
          />
        ))}
        {/* Premium Contour Rings */}

        {contours.map((item, index) => (
          <div
            key={index}
            className="contour absolute rounded-[50%]"
            style={{
              ...item,
              "--r": item.rotate,
            }}
          >
            {[...Array(26)].map((_, i) => (
              <div
                key={i}
                className="absolute inset-0 rounded-[50%]"
                style={{
                  transform: `scale(${1 - i * 0.035})`,
                  border: "1px solid rgba(236,189,90,.12)",
                  opacity: 0.85 - i * 0.03,
                }}
              />
            ))}
          </div>
        ))}

        {/* Soft vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,.78)_100%)]" />
        <div className="absolute top-[18%] left-[18%] h-72 w-72 rounded-full bg-amber-300/8 blur-[170px]" />

        <div className="absolute bottom-[15%] right-[18%] h-80 w-80 rounded-full bg-orange-300/8 blur-[190px]" />
      </div>
    </>
  );
};

export default PageBackground;
