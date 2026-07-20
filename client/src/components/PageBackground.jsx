import React from "react";

const PageBackground = () => {
  return (
    <>
      {/* Main Background */}
      <div className="fixed inset-0 -z-50 overflow-hidden bg-[#080808]">
        {/* Red Glow */}
        <div className="absolute -top-40 -left-32 h-[650px] w-[650px] rounded-full bg-red-600/20 blur-[180px]" />

        {/* Purple Glow */}
        <div className="absolute top-[700px] -right-48 h-[700px] w-[700px] rounded-full bg-violet-600/15 blur-[200px]" />

        {/* Blue Glow */}
        <div className="absolute bottom-[500px] left-1/3 h-[550px] w-[550px] rounded-full bg-sky-500/10 blur-[170px]" />

        {/* Second Red Glow */}
        <div className="absolute bottom-[-250px] right-[10%] h-[650px] w-[650px] rounded-full bg-primary/15 blur-[190px]" />

        {/* Small Accent */}
        <div className="absolute top-[1600px] left-[15%] h-[300px] w-[300px] rounded-full bg-pink-500/10 blur-[140px]" />

        {/* Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,.75)_100%)]" />

        {/* Noise Texture */}
        <div
          className="absolute inset-0 opacity-[0.025] mix-blend-soft-light"
          style={{
            backgroundImage:
              "url('https://www.transparenttextures.com/patterns/noise.png')",
          }}
        />
      </div>
    </>
  );
};

export default PageBackground;