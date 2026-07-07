function todayISO() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function createDefaultState() {
  return {
    numeroRdo: '',
    data: todayISO(),
    cliente: '',
    obra: '',
    local: '',
    horasNormais: { inicio: '08:00', termino: '17:00' },
    horasAviso1: { inicio: '', termino: '' },
    horasAviso2: { inicio: '', termino: '' },
    equipe: [
      { id: crypto.randomUUID(), funcao: 'Engenheiro de Obras', qtd: 0 },
      { id: crypto.randomUUID(), funcao: 'Tec. de Segurança do Trabalho', qtd: 0 },
      { id: crypto.randomUUID(), funcao: 'Encarregado de Obras', qtd: 0 },
      { id: crypto.randomUUID(), funcao: 'Pedreiros', qtd: 0 },
      { id: crypto.randomUUID(), funcao: 'Servente', qtd: 0 },
    ],
    atividades: [''],
    observacoes: '',
    comentarios: '',
    preservarEngenharia: { data: '', nome: '', assinatura: '' },
    fiscalizacao: { data: '', nome: '', assinatura: '' },
    fotos: [],
  };
}
