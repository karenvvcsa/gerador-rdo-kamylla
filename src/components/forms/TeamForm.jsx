import NumberStepper from '../ui/NumberStepper';
import { inputClass } from '../ui/Field';

export default function TeamForm({ equipe, onChange }) {
  const updateItem = (id, patch) =>
    onChange(equipe.map((item) => (item.id === id ? { ...item, ...patch } : item)));

  const removeItem = (id) => onChange(equipe.filter((item) => item.id !== id));

  const addItem = () =>
    onChange([...equipe, { id: crypto.randomUUID(), funcao: '', qtd: 0 }]);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-700">
        Equipe Técnica
      </h3>
      <div className="space-y-3">
        {equipe.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-lg border border-gray-200 p-3"
          >
            <input
              className={inputClass}
              value={item.funcao}
              onChange={(e) => updateItem(item.id, { funcao: e.target.value })}
              placeholder="Função"
            />
            <NumberStepper
              value={item.qtd}
              onChange={(qtd) => updateItem(item.id, { qtd })}
            />
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="text-gray-400 hover:text-red-600 transition shrink-0"
              aria-label="Remover função"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addItem}
        className="w-full rounded-lg border-2 border-dashed border-primary-300 py-2.5 text-sm font-medium text-primary-700 hover:bg-primary-50 transition"
      >
        + Adicionar Função
      </button>
    </div>
  );
}
