import { RDO_PAGE_WIDTH } from './RDODocument';

// Photographic annex, rendered on its own PDF page — 2 photos per row with captions.
export default function PhotoAnnex({ fotos }) {
  if (!fotos || fotos.length === 0) return null;

  return (
    <div
      className="rdo-page border border-black mt-6"
      style={{ width: RDO_PAGE_WIDTH, pageBreakBefore: 'always', breakBefore: 'page' }}
    >
      <div className="rdo-section-title text-xs py-1">Anexo Fotográfico</div>
      <div className="grid grid-cols-2 gap-4 p-4">
        {fotos.map((foto) => (
          <div key={foto.id} className="rdo-avoid-break border border-black">
            <img src={foto.dataUrl} alt={foto.legenda || 'Foto da obra'} className="w-full h-56 object-cover" />
            <div className="text-xs text-center px-2 py-2 border-t border-black min-h-[2.5rem]">
              {foto.legenda}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
