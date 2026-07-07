import html2pdf from 'html2pdf.js';
import { RDO_PAGE_WIDTH, RDO_PAGE_HEIGHT } from '../components/preview/RDODocument';

// Visible white margin around the document on the printed page, in px
// (~0.33in at 96dpi). The PDF's page size is the content size plus this
// margin on every side; html2pdf's "inner" content area then works out to
// exactly RDO_PAGE_WIDTH x RDO_PAGE_HEIGHT again, so none of our
// page-height-based pagination math (RDODocument's minHeight, the
// avoid-break page-break math) needs to change to account for it.
const PAGE_MARGIN = 32;

const DESIRED_SCALE = 3;

// html2canvas rasterizes the *entire* multi-page document (RDO page +
// however many photo-annex pages) into one canvas before jsPDF slices it
// per page. Mobile browsers — iOS Safari in particular — silently fail
// (blank/garbled output, no error) once that canvas exceeds a few tens of
// millions of pixels, which a report with many photos hits easily at
// DESIRED_SCALE. Capping the scale to keep total canvas area under a safe
// budget trades a bit of sharpness for the export actually working; a
// typical one-page report with few photos still gets the full scale.
const MAX_CANVAS_AREA = 16_000_000;
const MIN_SCALE = 1.5;

function computeSafeScale(node) {
  const area = node.scrollWidth * node.scrollHeight * DESIRED_SCALE * DESIRED_SCALE;
  if (area <= MAX_CANVAS_AREA) return DESIRED_SCALE;
  return Math.max(MIN_SCALE, Math.sqrt(MAX_CANVAS_AREA / (node.scrollWidth * node.scrollHeight)));
}

// Hands the generated PDF to the user. The Web Share API's file-sharing
// path opens the native share sheet (with a direct "Save to Files"/"Salvar
// em Arquivos" option), which is the only reliably-working way to get a
// file onto disk from a mobile browser — jsPDF's own `.save()` relies on a
// synthetic `<a download>` click, which iOS Safari either ignores or
// resolves by just opening the PDF instead of saving it. Where Web Share
// isn't available (most desktop browsers), fall back to that same
// anchor-download trick, which works fine there.
async function savePdfBlob(blob, filename) {
  const file = new File([blob], filename, { type: 'application/pdf' });

  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: filename });
      return;
    } catch (err) {
      if (err?.name === 'AbortError') return; // user dismissed the share sheet
      // Any other failure (e.g. no share target installed) — fall through
      // to the download link below instead of leaving the user stuck.
    }
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

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
      scale: computeSafeScale(node),
      useCORS: true,
      backgroundColor: '#ffffff',
      windowWidth: RDO_PAGE_WIDTH,
      // Explicitly matching the full content height (not just width) avoids
      // an html2canvas mobile bug: without it, the simulated capture
      // viewport defaults to the real window's height — a few hundred px on
      // a phone — and the clone's scroll/offset math gets computed against
      // that instead of the actual multi-page content, cropping or
      // shifting everything below the first screenful.
      windowHeight: node.scrollHeight,
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

  const blob = await html2pdf().set(options).from(node).outputPdf('blob');
  await savePdfBlob(blob, filename);
}
