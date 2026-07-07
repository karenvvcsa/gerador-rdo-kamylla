import { useEffect, useRef, useState } from 'react';

const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 160;

// Canvas-based signature capture. Draws with mouse or touch and reports the
// signature back to the parent as a PNG data URL, which is what gets
// rendered both in the live preview and the exported PDF.
export default function SignaturePad({ value, onChange }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const lastPoint = useRef(null);
  const [isEmpty, setIsEmpty] = useState(!value);

  // Keep the canvas in sync with the committed value: on mount (e.g. after
  // switching tabs, since the form tabs unmount their inactive content) and
  // again right after a stroke's own onChange commits it back down as a
  // prop. That second sync is what makes the just-drawn signature stick
  // around visually — Chromium's own click synthesis following the mouseup
  // that ends a stroke can otherwise leave the canvas looking blank once
  // the surrounding UI re-renders, even though the captured value is fine.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (value) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      img.src = value;
    }
    setIsEmpty(!value);
  }, [value]);

  const getPoint = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const point = e.touches && e.touches.length ? e.touches[0] : e;
    return {
      x: (point.clientX - rect.left) * scaleX,
      y: (point.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e) => {
    drawing.current = true;
    lastPoint.current = getPoint(e);
  };

  const draw = (e) => {
    if (!drawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const point = getPoint(e);
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    lastPoint.current = point;
    setIsEmpty(false);
  };

  const endDraw = () => {
    if (!drawing.current) return;
    drawing.current = false;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    // Deferred to the next tick: committing the parent's state update
    // synchronously from inside this mouseup/touchend handler can race
    // with the browser's own follow-up "click" synthesis, occasionally
    // misdirecting that click at an unrelated button rendered below (e.g.
    // "Limpar") once the surrounding UI re-renders. Yielding first lets
    // that native click settle before we mutate state.
    setTimeout(() => onChange(dataUrl), 0);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
    onChange('');
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="w-full h-32 rounded-lg border border-gray-300 bg-white touch-none cursor-crosshair"
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={endDraw}
      />
      <div className="flex items-center justify-between mt-1.5">
        <span className="text-xs text-gray-400">
          {isEmpty ? 'Assine com o mouse ou o dedo' : 'Assinatura capturada'}
        </span>
        <button
          type="button"
          onClick={handleClear}
          className="text-xs text-red-600 hover:underline"
        >
          Limpar
        </button>
      </div>
    </div>
  );
}
