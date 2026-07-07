# Gerador de RDO — Relatório Diário de Obra

Aplicação web mobile-first (Next.js + React + Tailwind CSS) para preencher e
exportar em PDF um Relatório Diário de Obra (RDO), reproduzindo fielmente o
layout de formulário impresso: cabeçalho com número/data/dia da semana, dados
gerais, apropriação de horas, equipe técnica, atividades/observações/
comentários em linhas pautadas, assinaturas e um anexo fotográfico.

## Rodando localmente

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build
npm run start
```

## Estrutura

- `src/app/` — App Router do Next.js (`layout.jsx`, `page.jsx`,
  `globals.css`). `App.jsx` (o restante da aplicação) é um Client Component
  ("use client"), já que todo o formulário é interativo no navegador.
- `src/components/preview/RDODocument.jsx` — o documento em si (usado tanto na
  prévia em tempo real quanto na exportação em PDF), garantindo que o que o
  usuário vê é exatamente o que será exportado.
- `src/components/preview/PhotoAnnex.jsx` — páginas extras com o anexo
  fotográfico (grid 2 colunas, com legendas), paginadas em grupos fixos de
  fotos por página.
- `src/components/forms/*` — formulário dividido em abas (Dados Gerais,
  Equipe, Atividades, Assinaturas, Fotos), com a barra de ações (Voltar/
  Próximo/Exportar) fixada ao fundo da tela no mobile para fácil alcance.
- `src/utils/pdfExport.js` — geração do PDF em alta resolução: cada página
  (o RDO e cada página de fotos) é capturada individualmente via
  `html2canvas` e montada diretamente com `jsPDF`, sem depender de
  paginação automática por heurística.
