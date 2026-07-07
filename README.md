# Gerador de RDO — Relatório Diário de Obra

Aplicação web (React + Vite + Tailwind CSS) para preencher e exportar em PDF um
Relatório Diário de Obra (RDO), reproduzindo fielmente o layout de formulário
impresso: cabeçalho com número/data/dia da semana, dados gerais, apropriação
de horas, equipe técnica, atividades/observações/comentários em linhas
pautadas, assinaturas e um anexo fotográfico.

## Rodando localmente

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build
```

## Estrutura

- `src/components/preview/RDODocument.jsx` — o documento em si (usado tanto na
  prévia em tempo real quanto na exportação em PDF), garantindo que o que o
  usuário vê é exatamente o que será exportado.
- `src/components/preview/PhotoAnnex.jsx` — página extra com o anexo
  fotográfico (grid 2 colunas, com legendas).
- `src/components/forms/*` — formulário dividido em abas (Dados Gerais,
  Equipe, Atividades, Assinaturas, Fotos).
- `src/utils/pdfExport.js` — geração do PDF em alta resolução via
  `html2pdf.js`, com margens zeradas, fundos coloridos forçados e quebras de
  página controladas por CSS (`page-break-inside: avoid`).
