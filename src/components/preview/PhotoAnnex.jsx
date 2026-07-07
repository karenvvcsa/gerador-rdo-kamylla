import { RDO_PAGE_WIDTH } from './RDODocument';

function chunkPairs(items) {
  const pairs = [];
  for (let i = 0; i < items.length; i += 2) {
    pairs.push(items.slice(i, i + 2));
  }
  return pairs;
}

// Photographic annex, rendered on its own PDF page — 2 photos per row with captions.
//
// The rows use plain flexbox scoped to each pair, not a CSS grid spanning all
// photos. html2pdf's page-break-avoidance works by inserting a plain sibling
// "pad" div before an element that would otherwise straddle a page break.
// Inside a grid container that inserted div becomes a real grid item and
// steals a cell, shifting every photo after it into the wrong column and
// letting images get cut mid-image across the page boundary. A block-level
// stack of independent row rows keeps each inserted pad div harmless.
//
// This is deliberately NOT forced onto a new page via CSS page-break-before.
// RDODocument reserves exactly one page of height, so this annex already
// starts right at the next page boundary; html2pdf's break-before handling
// has an edge case where forcing a break on an element that lands only a
// few pixels past a boundary skips an entire page forward, leaving a blank
// page in between. Relying on natural flow sidesteps that bug.
export default function PhotoAnnex({ fotos }) {
  if (!fotos || fotos.length === 0) return null;

  return (
    <div className="rdo-page border border-black" style={{ width: RDO_PAGE_WIDTH }}>
      <div className="rdo-section-title text-xs py-1">Anexo Fotográfico</div>
      <div className="p-4">
        {chunkPairs(fotos).map((pair, i) => (
          <div key={i} className="rdo-avoid-break flex gap-4 mb-4 last:mb-0">
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
