const BlurCircle = ({
  top = "auto",
  left = "auto",
  right = "auto",
  bottom = "auto",
  size = "18rem",
  opacity = "0.25",
}) => {
  return (
    <div
      className="absolute -z-10 rounded-full bg-primary blur-[120px] pointer-events-none"
      style={{
        top,
        left,
        right,
        bottom,
        width: size,
        height: size,
        opacity,
      }}
    />
  );
};

export default BlurCircle;