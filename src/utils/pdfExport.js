import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { RDO_PAGE_WIDTH, RDO_PAGE_HEIGHT } from '../components/preview/RDODocument';

// Visible white margin around the document on the printed page, in px
// (~0.33in at 96dpi).
const PAGE_MARGIN = 32;

const DESIRED_SCALE = 3;

// A single page's raster stays comfortably under this budget at
// DESIRED_SCALE (RDO_PAGE_WIDTH x RDO_PAGE_HEIGHT x 3^2 ≈ 8M px), so this
// only ever kicks in for the rare report whose activities/observations
// overflow past RDODocument's default minHeight — see sliceCanvasIntoPages.
const MAX_CANVAS_AREA = 16_000_000;
const MIN_SCALE = 1.5;

function computeSafeScale(width, height) {
  const area = width * height * DESIRED_SCALE * DESIRED_SCALE;
  if (area <= MAX_CANVAS_AREA) return DESIRED_SCALE;
  return Math.max(MIN_SCALE, Math.sqrt(MAX_CANVAS_AREA / (width * height)));
}

// Captures one top-level page node (RDODocument or a PhotoAnnex page) as its
// own canvas. windowHeight is set to the node's own full height rather than
// left at the real (often much shorter, on mobile) window height — leaving
// it at the default caused html2canvas's mobile clone to compute scroll
// offsets against the visible viewport instead of the actual content,
// which is what produced badly cropped/misplaced captures on phones.
async function captureNode(node) {
  const scale = computeSafeScale(node.scrollWidth, node.scrollHeight);
  const canvas = await html2canvas(node, {
    scale,
    useCORS: true,
    backgroundColor: '#ffffff',
    windowWidth: RDO_PAGE_WIDTH,
    windowHeight: node.scrollHeight,
    letterRendering: true,
  });
  return { canvas, scale };
}

// Slices a captured node's canvas into RDO_PAGE_HEIGHT-tall (at its scale)
// bands, one per PDF page. Every page node is designed to fit in exactly one
// band (RDODocument via its minHeight, PhotoAnnex via PHOTOS_PER_PAGE), so
// this normally returns a single, exact-size page. It only produces more
// than one when a report has more activity/observation lines than the
// default minimums push RDODocument taller than one page — in that rare
// case a line could in principle land across a slice boundary, since this
// is plain pixel slicing with no break-avoidance. That's an accepted
// trade-off: the alternative, html2pdf's own break-avoidance, is what
// produced badly mispaginated (mostly-blank-page) output on real mobile
// browsers that this manual approach replaces.
function sliceCanvasIntoPages(canvas, scale) {
  const pageHeightPx = Math.round(RDO_PAGE_HEIGHT * scale);
  const pageCount = Math.max(1, Math.round(canvas.height / pageHeightPx));
  const pages = [];
  for (let i = 0; i < pageCount; i++) {
    const sliceHeight = Math.min(pageHeightPx, canvas.height - i * pageHeightPx);
    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = canvas.width;
    pageCanvas.height = pageHeightPx;
    const ctx = pageCanvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
    ctx.drawImage(canvas, 0, i * pageHeightPx, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);
    pages.push(pageCanvas);
  }
  return pages;
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

// Renders the export container (RDODocument + one PhotoAnnex per photo page,
// as direct children — see App.jsx) to a high-resolution PDF. Each child is
// captured and placed as its own PDF page directly via jsPDF, instead of
// handing one combined tall canvas to html2pdf's automatic CSS-avoid-break
// pagination — that automatic pagination is what produced severely
// mispaginated (mostly blank) pages on real mobile browsers, since its
// break-point math depends on getBoundingClientRect() measurements of the
// cloned document that don't reproduce identically across devices. Manual
// per-node capture has no such ambiguity: each node's page boundary is
// simply where the node itself ends.
export async function exportRdoToPdf(container, filename) {
  const pageWidth = RDO_PAGE_WIDTH + PAGE_MARGIN * 2;
  const pageHeight = RDO_PAGE_HEIGHT + PAGE_MARGIN * 2;

  const doc = new jsPDF({
    unit: 'px',
    format: [pageWidth, pageHeight],
    orientation: 'portrait',
    // Lossless PDF stream compression — trims the larger PNG payload back
    // down without touching image fidelity.
    compress: true,
  });

  let firstPage = true;
  for (const node of Array.from(container.children)) {
    const { canvas, scale } = await captureNode(node);
    for (const pageCanvas of sliceCanvasIntoPages(canvas, scale)) {
      if (!firstPage) doc.addPage([pageWidth, pageHeight], 'portrait');
      firstPage = false;
      // PNG instead of JPEG: this is a raster snapshot of borders, hairline
      // rules and small caps text, and JPEG's block compression visibly
      // softens/artifacts exactly that kind of sharp-edge content.
      const imgData = pageCanvas.toDataURL('image/png');
      doc.addImage(imgData, 'PNG', PAGE_MARGIN, PAGE_MARGIN, RDO_PAGE_WIDTH, RDO_PAGE_HEIGHT, undefined, 'FAST');
    }
  }

  const blob = doc.output('blob');
  await savePdfBlob(blob, filename);
}
