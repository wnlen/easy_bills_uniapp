// common/format.js
export function formatAmount(value) {
  if (isNaN(value)) return "0.00";
  return (
    "" +
    Number(value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}
