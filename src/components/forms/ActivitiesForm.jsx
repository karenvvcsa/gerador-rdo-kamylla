import Field, { inputClass } from '../ui/Field';

export default function ActivitiesForm({ data, onChange }) {
  const update = (patch) => onChange({ ...data, ...patch });

  const updateLine = (index, value) => {
    const next = [...data.atividades];
    next[index] = value;
    update({ atividades: next });
  };

  const removeLine = (index) => {
    const next = data.atividades.filter((_, i) => i !== index);
    update({ atividades: next.length ? next : [''] });
  };

  const addLine = () => update({ atividades: [...data.atividades, ''] });

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-700">
          Atividades Realizadas
        </h3>
        <div className="space-y-2">
          {data.atividades.map((line, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                className={inputClass + ' min-w-0 flex-1'}
                value={line}
                onChange={(e) => updateLine(i, e.target.value)}
                placeholder={`Atividade ${i + 1}`}
              />
              <button
                type="button"
                onClick={() => removeLine(i)}
                className="text-gray-400 hover:text-red-600 transition shrink-0"
                aria-label="Remover linha"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addLine}
          className="w-full rounded-lg border-2 border-dashed border-primary-300 py-2.5 text-sm font-medium text-primary-700 hover:bg-primary-50 transition"
        >
          + Adicionar Linha
        </button>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-700">
          Observações
        </h3>
        <Field label="">
          <textarea
            className={inputClass}
            rows={4}
            value={data.observacoes}
            onChange={(e) => update({ observacoes: e.target.value })}
            placeholder="Uma observação por linha"
          />
        </Field>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-700">
          Comentários do Cliente
        </h3>
        <Field label="">
          <textarea
            className={inputClass}
            rows={3}
            value={data.comentarios}
            onChange={(e) => update({ comentarios: e.target.value })}
            placeholder="Um comentário por linha"
          />
        </Field>
      </section>
    </div>
  );
}
