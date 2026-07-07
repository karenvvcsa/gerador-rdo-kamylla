import { useEffect, useRef, useState } from 'react';
import Tabs from './components/Tabs';
import GeneralInfoForm from './components/forms/GeneralInfoForm';
import TeamForm from './components/forms/TeamForm';
import ActivitiesForm from './components/forms/ActivitiesForm';
import SignaturesForm from './components/forms/SignaturesForm';
import PhotosForm from './components/forms/PhotosForm';
import RDODocument, { RDO_PAGE_WIDTH, RDO_PAGE_HEIGHT } from './components/preview/RDODocument';
import PhotoAnnex, { chunkFotosIntoPages } from './components/preview/PhotoAnnex';
import { createDefaultState } from './data/defaultState';
import { exportRdoToPdf } from './utils/pdfExport';

const TABS = [
  { id: 'geral', label: 'Dados Gerais' },
  { id: 'equipe', label: 'Equipe' },
  { id: 'atividades', label: 'Atividades' },
  { id: 'assinaturas', label: 'Assinaturas' },
  { id: 'fotos', label: 'Fotos' },
];

export default function App() {
  const [data, setData] = useState(createDefaultState);
  const [logo, setLogo] = useState(null);
  const [activeTab, setActiveTab] = useState('geral');
  const [mobileView, setMobileView] = useState('form'); // 'form' | 'preview'
  const [exporting, setExporting] = useState(false);
  const [previewScale, setPreviewScale] = useState(0.55);
  const exportRef = useRef(null);
  const previewContainerRef = useRef(null);

  const setFotos = (updater) =>
    setData((prev) => ({
      ...prev,
      fotos: typeof updater === 'function' ? updater(prev.fotos) : updater,
    }));

  useEffect(() => {
    const node = previewContainerRef.current;
    if (!node) return;
    const updateScale = () => {
      setPreviewScale(Math.min(1, node.clientWidth / RDO_PAGE_WIDTH));
    };
    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(node);
    // A ResizeObserver doesn't reliably fire when an ancestor toggles
    // display:none -> block (as happens switching the mobile form/preview
    // tabs), so also recompute whenever that toggle happens.
    window.addEventListener('resize', updateScale);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, [mobileView]);

  const activeTabIndex = TABS.findIndex((tab) => tab.id === activeTab);
  const goToPrevTab = () => setActiveTab(TABS[activeTabIndex - 1].id);
  const goToNextTab = () => setActiveTab(TABS[activeTabIndex + 1].id);

  const handleExport = async () => {
    if (!exportRef.current) return;
    setExporting(true);
    try {
      const filename = `RDO-${data.numeroRdo || 'relatorio'}-${data.data || ''}.pdf`;
      await exportRdoToPdf(exportRef.current, filename);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f1ee]">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-gray-900 truncate">Gerador de RDO</h1>
            <p className="text-xs text-gray-500 truncate">Relatório Diário de Obra</p>
          </div>
          <button
            type="button"
            onClick={handleExport}
            disabled={exporting}
            className="shrink-0 whitespace-nowrap rounded-lg bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white font-semibold px-3 py-2 text-xs sm:px-4 sm:py-2.5 sm:text-sm shadow-sm transition"
          >
            {exporting ? 'Gerando…' : 'Exportar PDF'}
          </button>
        </div>
        <div className="lg:hidden max-w-7xl mx-auto px-4 pb-2 flex gap-2">
          <button
            type="button"
            onClick={() => setMobileView('form')}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
              mobileView === 'form' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Formulário
          </button>
          <button
            type="button"
            onClick={() => setMobileView('preview')}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
              mobileView === 'preview' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Prévia
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid lg:grid-cols-2 gap-6">
        <section className={`${mobileView === 'form' ? 'block' : 'hidden'} lg:block min-w-0`}>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />
            <div className="p-4 sm:p-6">
              {activeTab === 'geral' && (
                <GeneralInfoForm data={data} onChange={setData} logo={logo} onLogoChange={setLogo} />
              )}
              {activeTab === 'equipe' && (
                <TeamForm
                  equipe={data.equipe}
                  onChange={(equipe) => setData((prev) => ({ ...prev, equipe }))}
                />
              )}
              {activeTab === 'atividades' && <ActivitiesForm data={data} onChange={setData} />}
              {activeTab === 'assinaturas' && <SignaturesForm data={data} onChange={setData} />}
              {activeTab === 'fotos' && <PhotosForm fotos={data.fotos} onChange={setFotos} />}

              <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={goToPrevTab}
                  disabled={activeTabIndex === 0}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-0 disabled:pointer-events-none transition"
                >
                  ← Voltar
                </button>
                {activeTabIndex === TABS.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleExport}
                    disabled={exporting}
                    className="rounded-lg bg-primary-500 hover:bg-primary-600 disabled:opacity-60 px-4 py-2 text-sm font-medium text-white shadow-sm transition"
                  >
                    {exporting ? 'Gerando PDF…' : 'Exportar PDF'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={goToNextTab}
                    className="rounded-lg bg-primary-500 hover:bg-primary-600 px-4 py-2 text-sm font-medium text-white transition"
                  >
                    Próximo →
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className={`${mobileView === 'preview' ? 'block' : 'hidden'} lg:block min-w-0`}>
          <div className="lg:sticky lg:top-24">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 overflow-hidden">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
                Prévia em tempo real
              </p>
              <div
                ref={previewContainerRef}
                className="overflow-hidden mx-auto"
                style={{ height: RDO_PAGE_HEIGHT * previewScale }}
              >
                <div
                  style={{
                    // CSS zoom (not transform: scale) so the browser relayouts
                    // and repaints hairline borders crisply at the scaled
                    // size, instead of stretching an already-rasterized 1px
                    // border — which at fractional scale factors anti-aliases
                    // into what looks like a doubled line.
                    zoom: previewScale,
                    width: RDO_PAGE_WIDTH,
                  }}
                >
                  <RDODocument data={data} logo={logo} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Off-screen full-resolution render used exclusively for PDF export */}
      <div style={{ position: 'fixed', top: 0, left: '-9999px', zIndex: -1 }}>
        <div ref={exportRef}>
          <RDODocument data={data} logo={logo} />
          {chunkFotosIntoPages(data.fotos).map((pageFotos, i) => (
            <PhotoAnnex key={i} fotos={pageFotos} />
          ))}
        </div>
      </div>
    </div>
  );
}
