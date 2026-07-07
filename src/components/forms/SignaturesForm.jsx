import Field, { inputClass } from '../ui/Field';

export default function SignaturesForm({ data, onChange }) {
  const updateNested = (key, patch) => onChange({ ...data, [key]: { ...data[key], ...patch } });

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-700">
          Preservar Engenharia
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Data">
            <input
              type="date"
              className={inputClass}
              value={data.preservarEngenharia.data}
              onChange={(e) => updateNested('preservarEngenharia', { data: e.target.value })}
            />
          </Field>
          <Field label="Nome">
            <input
              className={inputClass}
              value={data.preservarEngenharia.nome}
              onChange={(e) => updateNested('preservarEngenharia', { nome: e.target.value })}
              placeholder="Nome do responsável"
            />
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-700">
          Fiscalização
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Data">
            <input
              type="date"
              className={inputClass}
              value={data.fiscalizacao.data}
              onChange={(e) => updateNested('fiscalizacao', { data: e.target.value })}
            />
          </Field>
          <Field label="Nome">
            <input
              className={inputClass}
              value={data.fiscalizacao.nome}
              onChange={(e) => updateNested('fiscalizacao', { nome: e.target.value })}
              placeholder="Nome do fiscal"
            />
          </Field>
        </div>
      </section>
      <p className="text-xs text-gray-500">
        As assinaturas físicas são coletadas diretamente no documento impresso ou em PDF.
      </p>
    </div>
  );
}
