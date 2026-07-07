import Field, { inputClass } from '../ui/Field';

export default function GeneralInfoForm({ data, onChange, logo, onLogoChange }) {
  const update = (patch) => onChange({ ...data, ...patch });
  const updateNested = (key, patch) => onChange({ ...data, [key]: { ...data[key], ...patch } });

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onLogoChange(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-700">
          Identificação
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nº RDO">
            <input
              className={inputClass}
              value={data.numeroRdo}
              onChange={(e) => update({ numeroRdo: e.target.value })}
              placeholder="001"
            />
          </Field>
          <Field label="Data">
            <input
              type="date"
              className={inputClass}
              value={data.data}
              onChange={(e) => update({ data: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Cliente">
          <input
            className={inputClass}
            value={data.cliente}
            onChange={(e) => update({ cliente: e.target.value })}
            placeholder="Residencial Primavera"
          />
        </Field>
        <Field label="Obra">
          <input
            className={inputClass}
            value={data.obra}
            onChange={(e) => update({ obra: e.target.value })}
            placeholder="Reforma e revitalização"
          />
        </Field>
        <Field label="Local">
          <input
            className={inputClass}
            value={data.local}
            onChange={(e) => update({ local: e.target.value })}
            placeholder="R. Pres. Venceslau, 661, Ibura"
          />
        </Field>
        <Field label="Logotipo (opcional)">
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-100 file:text-primary-800 file:font-medium hover:file:bg-primary-200"
          />
          {logo && (
            <div className="mt-2 flex items-center gap-3">
              <img src={logo} alt="Prévia do logotipo" className="h-12 object-contain rounded border border-gray-200" />
              <button
                type="button"
                onClick={() => onLogoChange(null)}
                className="text-xs text-red-600 hover:underline"
              >
                Remover
              </button>
            </div>
          )}
        </Field>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-700">
          Apropriação de Horas
        </h3>
        <div>
          <span className="block text-xs font-semibold text-gray-500 mb-2">Horas Normais</span>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Início">
              <input
                type="time"
                className={inputClass}
                value={data.horasNormais.inicio}
                onChange={(e) => updateNested('horasNormais', { inicio: e.target.value })}
              />
            </Field>
            <Field label="Término">
              <input
                type="time"
                className={inputClass}
                value={data.horasNormais.termino}
                onChange={(e) => updateNested('horasNormais', { termino: e.target.value })}
              />
            </Field>
          </div>
        </div>
        <div>
          <span className="block text-xs font-semibold text-gray-500 mb-2">
            Horas Sobre Aviso — Período 1
          </span>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Início">
              <input
                type="time"
                className={inputClass}
                value={data.horasAviso1.inicio}
                onChange={(e) => updateNested('horasAviso1', { inicio: e.target.value })}
              />
            </Field>
            <Field label="Término">
              <input
                type="time"
                className={inputClass}
                value={data.horasAviso1.termino}
                onChange={(e) => updateNested('horasAviso1', { termino: e.target.value })}
              />
            </Field>
          </div>
        </div>
        <div>
          <span className="block text-xs font-semibold text-gray-500 mb-2">
            Horas Sobre Aviso — Período 2
          </span>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Início">
              <input
                type="time"
                className={inputClass}
                value={data.horasAviso2.inicio}
                onChange={(e) => updateNested('horasAviso2', { inicio: e.target.value })}
              />
            </Field>
            <Field label="Término">
              <input
                type="time"
                className={inputClass}
                value={data.horasAviso2.termino}
                onChange={(e) => updateNested('horasAviso2', { termino: e.target.value })}
              />
            </Field>
          </div>
        </div>
      </section>
    </div>
  );
}
