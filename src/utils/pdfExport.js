import html2pdf from 'html2pdf.js';
import { RDO_PAGE_WIDTH, RDO_PAGE_HEIGHT } from '../components/preview/RDODocument';

// Visible white margin around the document on the printed page, in px
// (~0.33in at 96dpi). The PDF's page size is the content size plus this
// margin on every side; html2pdf's "inner" content area then works out to
// exactly RDO_PAGE_WIDTH x RDO_PAGE_HEIGHT again, so none of our
// page-height-based pagination math (RDODocument's minHeight, the
// avoid-break page-break math) needs to change to account for it.
const PAGE_MARGIN = 32;

// Renders the given DOM node (the RDO document + optional photo annex) to a
// high-resolution PDF, forcing background colors and avoiding ugly mid-section
// page breaks.
export async function exportRdoToPdf(node, filename) {
  const options = {
    margin: PAGE_MARGIN,
    filename,
    // PNG instead of JPEG: this is one raster snapshot of the whole page —
    // borders, hairline rules and small caps text — and JPEG's block
    // compression visibly softens/artifacts exactly that kind of sharp-edge
    // content. PNG is lossless, at the cost of a larger file.
    image: { type: 'png' },
    html2canvas: {
      // Higher than html2canvas's own default (1x) or a minimal 2x: this is
      // a text-heavy document that gets read up close and printed, so the
      // extra resolution is worth the larger canvas/export time.
      scale: 3,
      useCORS: true,
      backgroundColor: '#ffffff',
      windowWidth: RDO_PAGE_WIDTH,
      letterRendering: true,
    },
    // Named formats (e.g. "a4") are looked up in points regardless of `unit`,
    // which mismatches our px-based layout and crops content. An explicit
    // [width, height] pair in px keeps the PDF page the same size as the DOM.
    jsPDF: {
      unit: 'px',
      format: [RDO_PAGE_WIDTH + PAGE_MARGIN * 2, RDO_PAGE_HEIGHT + PAGE_MARGIN * 2],
      orientation: 'portrait',
      // Lossless PDF stream compression — trims the larger PNG payload back
      // down without touching image fidelity.
      compress: true,
    },
    // Only "css" mode: breaks are governed by our explicit .rdo-avoid-break
    // rules. "avoid-all" is intentionally omitted — it treats every element
    // as unbreakable, which forces entire sections onto a new page and
    // leaves large ugly gaps instead of a clean, tight break.
    pagebreak: { mode: ['css'] },
  };

  await html2pdf().set(options).from(node).save();
}
