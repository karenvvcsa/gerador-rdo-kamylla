export default function NumberStepper({ value, onChange, min = 0 }) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-8 h-8 rounded-lg border border-primary-300 bg-primary-50 text-primary-800 font-bold hover:bg-primary-100 active:scale-95 transition"
        aria-label="Diminuir"
      >
        −
      </button>
      <span className="w-8 text-center font-semibold text-gray-800 tabular-nums">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="w-8 h-8 rounded-lg border border-primary-300 bg-primary-50 text-primary-800 font-bold hover:bg-primary-100 active:scale-95 transition"
        aria-label="Aumentar"
      >
        +
      </button>
    </div>
  );
}
