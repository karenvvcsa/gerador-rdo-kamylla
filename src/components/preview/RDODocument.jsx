import { WEEKDAYS, formatDateBR, weekdayIndex } from '../../utils/date';
import { computeTotalHours } from '../../utils/hours';
import RuledSection from './RuledSection';

export const RDO_PAGE_WIDTH = 794; // ~A4 width at 96dpi
export const RDO_PAGE_HEIGHT = 1123; // ~A4 height at 96dpi

export default function RDODocument({ data, logo }) {
  const {
    numeroRdo,
    data: dataObra,
    cliente,
    obra,
    local,
    horasNormais,
    horasAviso1,
    horasAviso2,
    equipe,
    atividades,
    observacoes,
    comentarios,
    preservarEngenharia,
    fiscalizacao,
  } = data;

  const weekday = weekdayIndex(dataObra);
  const total = computeTotalHours(horasNormais.inicio, horasNormais.termino);
  const observacoesLines = observacoes.split('\n');
  const comentariosLines = comentarios.split('\n');

  return (
    <div
      className="rdo-page border border-black divide-y divide-black text-black"
      style={{ width: RDO_PAGE_WIDTH }}
    >
      {/* Cabeçalho */}
      <div className="grid grid-cols-[140px_1fr_260px] rdo-avoid-break">
        <div className="border-r border-black flex items-center justify-center p-2 h-full min-h-[110px]">
          {logo ? (
            <img src={logo} alt="Logotipo" className="max-h-[95px] max-w-full object-contain" />
          ) : null}
        </div>
        <div className="border-r border-black flex items-center justify-center p-2">
          <h1 className="font-bold text-lg text-center leading-tight">
            RDO - RELATÓRIO DIÁRIO DE OBRA
          </h1>
        </div>
        <div className="flex flex-col">
          <div className="border-b border-black px-2 py-1 text-xs font-bold">
            Nº RDO: <span className="font-normal">{numeroRdo}</span>
          </div>
          <div className="border-b border-black px-2 py-1 text-xs font-bold">
            DATA: <span className="font-normal">{formatDateBR(dataObra)}</span>
          </div>
          <div className="rdo-section-title text-[10px] py-0.5">DIA DA SEMANA</div>
          <table className="text-center text-[10px] table-fixed">
            <tbody>
              <tr>
                {WEEKDAYS.map((d) => (
                  <td key={d} className="border border-black font-bold py-0.5">
                    {d}
                  </td>
                ))}
              </tr>
              <tr>
                {WEEKDAYS.map((d, i) => (
                  <td key={d} className="border border-black h-5 font-bold">
                    {i === weekday ? 'X' : ''}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Informações gerais */}
      <div className="rdo-avoid-break">
        <div className="flex border-b border-black text-xs">
          <div className="font-bold px-2 py-1 whitespace-nowrap">CLIENTE:</div>
          <div className="px-2 py-1">{cliente}</div>
        </div>
        <div className="flex border-b border-black text-xs">
          <div className="font-bold px-2 py-1 whitespace-nowrap">OBRA:</div>
          <div className="px-2 py-1">{obra}</div>
        </div>
        <div className="flex text-xs">
          <div className="font-bold px-2 py-1 whitespace-nowrap">LOCAL:</div>
          <div className="px-2 py-1">{local}</div>
        </div>
      </div>

      {/* Apropriação de horas */}
      <div className="rdo-avoid-break">
        <div className="rdo-section-title text-xs py-1">APROPRIAÇÃO DE HORAS DE TRABALHO</div>
        <table className="table-fixed">
          <tbody>
            <tr>
              <td colSpan={3} className="border border-black text-center font-bold text-xs py-1">
                HORAS NORMAIS
              </td>
              <td colSpan={4} className="border border-black text-center font-bold text-xs py-1">
                HORAS SOBRE AVISO
              </td>
            </tr>
            <tr className="text-[10px] font-bold text-center">
              <td className="border border-black py-1">INÍCIO</td>
              <td className="border border-black py-1">TÉRMINO</td>
              <td className="border border-black py-1">TOTAL</td>
              <td className="border border-black py-1">INÍCIO</td>
              <td className="border border-black py-1">TÉRMINO</td>
              <td className="border border-black py-1">INÍCIO</td>
              <td className="border border-black py-1">TÉRMINO</td>
            </tr>
            <tr className="text-xs text-center">
              <td className="border border-black py-1">{horasNormais.inicio}</td>
              <td className="border border-black py-1">{horasNormais.termino}</td>
              <td className="border border-black py-1">{total}</td>
              <td className="border border-black py-1">{horasAviso1.inicio}</td>
              <td className="border border-black py-1">{horasAviso1.termino}</td>
              <td className="border border-black py-1">{horasAviso2.inicio}</td>
              <td className="border border-black py-1">{horasAviso2.termino}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Equipe técnica */}
      <div className="flex rdo-avoid-break">
        <div className="w-[150px] border-r border-black flex items-center justify-center p-2 shrink-0">
          <span className="font-bold text-sm text-center">EQUIPE TÉCNICA:</span>
        </div>
        <table className="table-fixed flex-1">
          <tbody>
            {equipe.map((item) => (
              <tr key={item.id} className="text-xs">
                <td className="border border-black px-2 py-1">{item.funcao}</td>
                <td className="border border-black px-2 py-1 text-center w-20">
                  {item.qtd > 0 ? item.qtd : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Atividades realizadas */}
      <RuledSection title="Atividades Realizadas" lines={atividades} minLines={9} />

      {/* Observações */}
      <RuledSection title="Observações" lines={observacoesLines} minLines={7} />

      {/* Comentários do cliente */}
      <RuledSection title="Comentários do Cliente" lines={comentariosLines} minLines={4} />

      {/* Assinaturas */}
      <div className="rdo-avoid-break">
        <div className="grid grid-cols-2">
          <div className="rdo-section-title border-r border-black text-xs py-1">
            Preservar Engenharia
          </div>
          <div className="rdo-section-title text-xs py-1">Fiscalização</div>
        </div>
        <div className="grid grid-cols-2 min-h-[130px]">
          <div className="border-r border-black p-2 text-xs flex flex-col justify-between">
            <div>
              <span className="font-bold uppercase text-[10px]">Data: </span>
              {formatDateBR(preservarEngenharia.data)}
            </div>
            <div>
              <span className="font-bold uppercase text-[10px]">Nome: </span>
              {preservarEngenharia.nome}
            </div>
            <div className="border-t border-black pt-1">
              <span className="font-bold uppercase text-[10px]">Assinatura:</span>
            </div>
          </div>
          <div className="p-2 text-xs flex flex-col justify-between">
            <div>
              <span className="font-bold uppercase text-[10px]">Data: </span>
              {formatDateBR(fiscalizacao.data)}
            </div>
            <div>
              <span className="font-bold uppercase text-[10px]">Nome: </span>
              {fiscalizacao.nome}
            </div>
            <div className="border-t border-black pt-1">
              <span className="font-bold uppercase text-[10px]">Assinatura:</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
