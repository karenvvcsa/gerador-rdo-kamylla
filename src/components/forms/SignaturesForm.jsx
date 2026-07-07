import Field, { inputClass } from '../ui/Field';
import SignaturePad from '../ui/SignaturePad';

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
        <Field label="Assinatura">
          <SignaturePad
            value={data.preservarEngenharia.assinatura}
            onChange={(assinatura) => updateNested('preservarEngenharia', { assinatura })}
          />
        </Field>
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
        <Field label="Assinatura">
          <SignaturePad
            value={data.fiscalizacao.assinatura}
            onChange={(assinatura) => updateNested('fiscalizacao', { assinatura })}
          />
        </Field>
      </section>
    </div>
  );
}
