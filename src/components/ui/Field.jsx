export default function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm ' +
  'focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition';
