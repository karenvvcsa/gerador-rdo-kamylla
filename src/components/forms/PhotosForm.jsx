import { useState } from 'react';
import { inputClass } from '../ui/Field';
import CameraCapture from '../ui/CameraCapture';

export default function PhotosForm({ fotos, onChange }) {
  const [cameraOpen, setCameraOpen] = useState(false);

  const handleUpload = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        onChange((prev) => [
          ...prev,
          { id: crypto.randomUUID(), dataUrl: reader.result, legenda: '' },
        ]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleCapture = (dataUrl) => {
    onChange((prev) => [...prev, { id: crypto.randomUUID(), dataUrl, legenda: '' }]);
    setCameraOpen(false);
  };

  const updateCaption = (id, legenda) => {
    onChange((prev) => prev.map((f) => (f.id === id ? { ...f, legenda } : f)));
  };

  const removePhoto = (id) => {
    onChange((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-700">
        Anexo Fotográfico
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-primary-300 py-8 cursor-pointer hover:bg-primary-50 transition text-center px-2">
          <span className="text-sm font-medium text-primary-700">Adicionar da galeria</span>
          <span className="text-xs text-gray-500">PNG, JPG — múltiplas fotos</span>
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
        </label>
        <button
          type="button"
          onClick={() => setCameraOpen(true)}
          className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-primary-300 py-8 hover:bg-primary-50 transition text-center px-2"
        >
          <span className="text-sm font-medium text-primary-700">Tirar foto agora</span>
          <span className="text-xs text-gray-500">Usa a câmera do dispositivo</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {fotos.map((foto) => (
          <div key={foto.id} className="rounded-lg border border-gray-200 overflow-hidden">
            <img src={foto.dataUrl} alt="Foto da obra" className="w-full h-32 object-cover" />
            <div className="p-2 space-y-2">
              <input
                className={inputClass + ' text-xs'}
                value={foto.legenda}
                onChange={(e) => updateCaption(foto.id, e.target.value)}
                placeholder="Legenda da foto"
              />
              <button
                type="button"
                onClick={() => removePhoto(foto.id)}
                className="text-xs text-red-600 hover:underline"
              >
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>

      {cameraOpen && (
        <CameraCapture onCapture={handleCapture} onClose={() => setCameraOpen(false)} />
      )}
    </div>
  );
}
