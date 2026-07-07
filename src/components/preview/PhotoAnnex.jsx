import { RDO_PAGE_WIDTH, RDO_PAGE_HEIGHT } from './RDODocument';

function chunkPairs(items) {
  const pairs = [];
  for (let i = 0; i < items.length; i += 2) {
    pairs.push(items.slice(i, i + 2));
  }
  return pairs;
}

// 3 rows x 2 columns per page. Measured against the actual row height (224px
// photo + ~40px caption + gaps) plus the title bar and padding, this leaves
// real headroom under RDO_PAGE_HEIGHT even when a caption wraps to two
// lines, so a page's photos never spill past the fixed page height below —
// each annex page renders as one self-contained, exactly-one-page PDF page.
export const PHOTOS_PER_PAGE = 6;

export function chunkFotosIntoPages(fotos) {
  const pages = [];
  for (let i = 0; i < fotos.length; i += PHOTOS_PER_PAGE) {
    pages.push(fotos.slice(i, i + PHOTOS_PER_PAGE));
  }
  return pages;
}

// One photographic annex page — 2 photos per row with captions, capped at
// PHOTOS_PER_PAGE so it always fits a fixed RDO_PAGE_HEIGHT exactly (the PDF
// export captures each top-level page node as its own canvas at that fixed
// size, so a page's content must never rely on overflowing into the next
// one — see pdfExport.js).
export default function PhotoAnnex({ fotos }) {
  if (!fotos || fotos.length === 0) return null;

  return (
    <div
      className="rdo-page border border-black overflow-hidden"
      style={{ width: RDO_PAGE_WIDTH, height: RDO_PAGE_HEIGHT }}
    >
      <div className="rdo-section-title text-xs">Anexo Fotográfico</div>
      <div className="p-4">
        {chunkPairs(fotos).map((pair, i) => (
          <div key={i} className="flex gap-4 mb-4 last:mb-0">
            {pair.map((foto) => (
              <div key={foto.id} className="flex-1 border border-black">
                <img
                  src={foto.dataUrl}
                  alt={foto.legenda || 'Foto da obra'}
                  className="w-full h-56 object-cover"
                />
                <div className="text-xs text-center px-2 py-2 border-t border-black min-h-[2.5rem]">
                  {foto.legenda}
                </div>
              </div>
            ))}
            {pair.length === 1 && <div className="flex-1" aria-hidden="true" />}
          </div>
        ))}
      </div>
    </div>
  );
}
