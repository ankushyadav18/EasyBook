

export const Kconverter = (num) => {
  if (num === null || num === undefined) return "0";

  num = Number(num);

  if (num >= 10_000_000) {
    // Crores
    return (num / 10_000_000).toFixed(1).replace(/\.0$/, "") + "Cr";
  } else if (num >= 100_000) {
    // Lakhs
    return (num / 100_000).toFixed(1).replace(/\.0$/, "") + "L";
  } else if (num >= 1_000) {
    // Thousands
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  } else {
    return num.toString();
  }
};
