const LINE_HEIGHT = 28;

// Renders a gray section title bar followed by ruled (notebook-style) lines.
// `lines` holds the filled-in text lines; the section always pads out to
// `minLines` total rows so the form keeps its printed look even when empty.
export default function RuledSection({ title, lines, minLines = 8 }) {
  const filled = lines.filter((l) => l !== undefined);
  const rowCount = Math.max(minLines, filled.length);
  const rows = Array.from({ length: rowCount }, (_, i) => filled[i] ?? '');

  const [firstRow, ...restRows] = rows;

  return (
    <div>
      {/* Glue the title to its first line so the header never gets orphaned
          alone at the bottom of a page; remaining lines can flow freely. */}
      <div className="rdo-avoid-break">
        <div className="rdo-section-title text-xs py-1">{title}</div>
        <div
          className="rdo-avoid-break rdo-ruled-line px-2 py-1.5 text-xs break-words"
          style={{ minHeight: LINE_HEIGHT, boxSizing: 'border-box' }}
        >
          {firstRow}
        </div>
      </div>
      {restRows.map((text, i) => (
        <div
          key={i}
          className="rdo-avoid-break rdo-ruled-line px-2 py-1.5 text-xs break-words"
          style={{ minHeight: LINE_HEIGHT, boxSizing: 'border-box' }}
        >
          {text}
        </div>
      ))}
    </div>
  );
}
