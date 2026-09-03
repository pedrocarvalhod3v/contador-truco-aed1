/**
 * App Bundle - Contador de Truco (AED1)
 * Pacote unificado e autossuficiente para execução direta tanto via protocolo local (file://)
 * quanto via servidor web (http://), sem bloqueios de CORS por módulos ES6.
 */

// ==========================================
// 1. TAD Lista Encadeada (AED1 - Módulo 3)
// ==========================================
class NoLista {
  constructor(dado) {
    this.dado = dado;
    this.proximo = null;
  }
}

class ListaEncadeada {
  constructor() {
    this._cabeca = null;
    this._cauda = null;
    this._tamanho = 0;
  }

  estaVazia() {
    return this._tamanho === 0;
  }

  tamanho() {
    return this._tamanho;
  }

  inserirFim(dado) {
    const novoNo = new NoLista(dado);
    if (this.estaVazia()) {
      this._cabeca = novoNo;
      this._cauda = novoNo;
    } else {
      this._cauda.proximo = novoNo;
      this._cauda = novoNo;
    }
    this._tamanho++;
  }

  removerFim() {
    if (this.estaVazia()) return null;

    if (this._tamanho === 1) {
      const dado = this._cabeca.dado;
      this._cabeca = null;
      this._cauda = null;
      this._tamanho = 0;
      return dado;
    }

    let atual = this._cabeca;
    while (atual.proximo && atual.proximo !== this._cauda) {
      atual = atual.proximo;
    }

    const dado = this._cauda.dado;
    this._cauda = atual;
    this._cauda.proximo = null;
    this._tamanho--;
    return dado;
  }

  obter(indice) {
    if (indice < 0 || indice >= this._tamanho) return null;
    let atual = this._cabeca;
    for (let i = 0; i < indice; i++) {
      atual = atual.proximo;
    }
    return atual ? atual.dado : null;
  }

  paraArray() {
    const arr = [];
    let atual = this._cabeca;
    while (atual) {
      arr.push(atual.dado);
      atual = atual.proximo;
    }
    return arr;
  }

  limpar() {
    this._cabeca = null;
    this._cauda = null;
    this._tamanho = 0;
  }
}

// ==========================================
// 2. TAD Pilha (AED1 - Módulo 4)
// ==========================================
class NoPilha {
  constructor(dado, abaixo = null) {
    this.dado = dado;
    this.abaixo = abaixo;
  }
}

class Pilha {
  constructor() {
    this._topo = null;
    this._tamanho = 0;
  }

  estaVazia() {
    return this._tamanho === 0;
  }

  tamanho() {
    return this._tamanho;
  }

  push(dado) {
    const novoNo = new NoPilha(dado, this._topo);
    this._topo = novoNo;
    this._tamanho++;
  }

  pop() {
    if (this.estaVazia()) return null;
    const dado = this._topo.dado;
    this._topo = this._topo.abaixo;
    this._tamanho--;
    return dado;
  }

  topo() {
    if (this.estaVazia()) return null;
    return this._topo.dado;
  }

  limpar() {
    this._topo = null;
    this._tamanho = 0;
  }

  paraArray() {
    const arr = [];
    let atual = this._topo;
    while (atual) {
      arr.push(atual.dado);
      atual = atual.abaixo;
    }
    return arr;
  }
}

// ==========================================
// 3. TAD Fila Circular (AED1 - Módulo 5)
// ==========================================
class NoFila {
  constructor(dado) {
    this.dado = dado;
    this.proximo = null;
  }
}

class FilaCircular {
  constructor() {
    this._frente = null;
    this._fim = null;
    this._tamanho = 0;
  }

  estaVazia() {
    return this._tamanho === 0;
  }

  tamanho() {
    return this._tamanho;
  }

  enfileirar(dado) {
    const novoNo = new NoFila(dado);
    if (this.estaVazia()) {
      this._frente = novoNo;
      this._fim = novoNo;
    } else {
      this._fim.proximo = novoNo;
      this._fim = novoNo;
    }
    this._tamanho++;
  }

  desenfileirar() {
    if (this.estaVazia()) return null;
    const dado = this._frente.dado;
    this._frente = this._frente.proximo;
    if (this._frente === null) {
      this._fim = null;
    }
    this._tamanho--;
    return dado;
  }

  frente() {
    if (this.estaVazia()) return null;
    return this._frente.dado;
  }

  rotacionar() {
    if (this._tamanho <= 1) return this.frente();
    const dado = this.desenfileirar();
    if (dado !== null) {
      this.enfileirar(dado);
    }
    return this.frente();
  }

  paraArray() {
    const arr = [];
    let atual = this._frente;
    while (atual) {
      arr.push(atual.dado);
      atual = atual.proximo;
    }
    return arr;
  }

  limpar() {
    this._frente = null;
    this._fim = null;
    this._tamanho = 0;
  }
}

// ==========================================
// 4. TAD Placar (AED1 - Módulo 2)
// ==========================================
class TADPlacar {
  static PONTOS_VITORIA = 12;

  constructor(nomeEquipeA = "NÓS", nomeEquipeB = "ELES") {
    this.nomeEquipeA = nomeEquipeA;
    this.nomeEquipeB = nomeEquipeB;
    this.pontosA = 0;
    this.pontosB = 0;
    this.vitoriasA = 0;
    this.vitoriasB = 0;
  }

  pontuarA(valor) {
    if (valor <= 0) throw new Error("Pontuação deve ser maior que zero.");
    this.pontosA = Math.min(TADPlacar.PONTOS_VITORIA, this.pontosA + valor);
    return this.pontosA;
  }

  pontuarB(valor) {
    if (valor <= 0) throw new Error("Pontuação deve ser maior que zero.");
    this.pontosB = Math.min(TADPlacar.PONTOS_VITORIA, this.pontosB + valor);
    return this.pontosB;
  }

  definirPontos(pontosA, pontosB) {
    this.pontosA = Math.max(0, Math.min(TADPlacar.PONTOS_VITORIA, pontosA));
    this.pontosB = Math.max(0, Math.min(TADPlacar.PONTOS_VITORIA, pontosB));
  }

  temVencedor() {
    return this.pontosA >= TADPlacar.PONTOS_VITORIA || this.pontosB >= TADPlacar.PONTOS_VITORIA;
  }

  obterVencedor() {
    if (this.pontosA >= TADPlacar.PONTOS_VITORIA) return this.nomeEquipeA;
    if (this.pontosB >= TADPlacar.PONTOS_VITORIA) return this.nomeEquipeB;
    return null;
  }

  registrarVitoriaEReiniciar() {
    if (this.pontosA >= TADPlacar.PONTOS_VITORIA) {
      this.vitoriasA++;
    } else if (this.pontosB >= TADPlacar.PONTOS_VITORIA) {
      this.vitoriasB++;
    }
    this.pontosA = 0;
    this.pontosB = 0;
  }

  resetTotal() {
    this.pontosA = 0;
    this.pontosB = 0;
    this.vitoriasA = 0;
    this.vitoriasB = 0;
  }

  paraObjeto() {
    return {
      nomeEquipeA: this.nomeEquipeA,
      nomeEquipeB: this.nomeEquipeB,
      pontosA: this.pontosA,
      pontosB: this.pontosB,
      vitoriasA: this.vitoriasA,
      vitoriasB: this.vitoriasB
    };
  }

  carregarDeObjeto(dados) {
    if (!dados) return;
    this.nomeEquipeA = dados.nomeEquipeA || this.nomeEquipeA;
    this.nomeEquipeB = dados.nomeEquipeB || this.nomeEquipeB;
    this.pontosA = dados.pontosA || 0;
    this.pontosB = dados.pontosB || 0;
    this.vitoriasA = dados.vitoriasA || 0;
    this.vitoriasB = dados.vitoriasB || 0;
  }
}

// ==========================================
// 5. Regras do Truco
// ==========================================
class RegrasTruco {
  static VALORES_VALIDOS = [1, 3, 6, 9, 12];

  static validarPontosRodada(valor) {
    return this.VALORES_VALIDOS.includes(valor);
  }

  static verificarMaoDe11(pontosA, pontosB) {
    const a11 = pontosA === 11;
    const b11 = pontosB === 11;

    if (a11 && b11) {
      return { emMaoDe11: true, maoDeFerro: true, equipe: "AMBAS" };
    }
    if (a11) {
      return { emMaoDe11: true, maoDeFerro: false, equipe: "A" };
    }
    if (b11) {
      return { emMaoDe11: true, maoDeFerro: false, equipe: "B" };
    }
    return { emMaoDe11: false, maoDeFerro: false, equipe: null };
  }

  static verificarMaoDeFerro(pontosA, pontosB) {
    return pontosA === 11 && pontosB === 11;
  }
}

// ==========================================
// 6. TAD Partida Integrada (AED1 - Módulo 6)
// ==========================================
class TADPartida {
  constructor(nomeEquipeA = "NÓS", nomeEquipeB = "ELES", jogadores = null) {
    this.placar = new TADPlacar(nomeEquipeA, nomeEquipeB);
    this.historicoRodadas = new ListaEncadeada();
    this.pilhaUndo = new Pilha();
    this.pilhaRedo = new Pilha();
    this.filaMesa = new FilaCircular();
    this.numeroRodada = 1;
    this.dataInicio = new Date().toISOString();

    const listaJogadores = jogadores || [
      `${nomeEquipeA} 1`,
      `${nomeEquipeB} 1`,
      `${nomeEquipeA} 2`,
      `${nomeEquipeB} 2`
    ];

    listaJogadores.forEach(j => this.filaMesa.enfileirar(j));
  }

  _salvarEstado(descricao) {
    this.pilhaUndo.push({
      pontosA: this.placar.pontosA,
      pontosB: this.placar.pontosB,
      descricao
    });
  }

  pontuar(equipe, valor) {
    if (this.placar.temVencedor()) {
      return { sucesso: false, mensagem: `Partida finalizada! Vencedor: ${this.placar.obterVencedor()}` };
    }

    if (!RegrasTruco.validarPontosRodada(valor)) {
      return { sucesso: false, mensagem: `Valor de pontos inválido: ${valor}` };
    }

    const nomeEquipe = equipe.toUpperCase() === 'A' ? this.placar.nomeEquipeA : this.placar.nomeEquipeB;

    // Salva snapshot para Undo antes da pontuação
    this._salvarEstado(`+${valor} pts para ${nomeEquipe}`);
    
    // Limpa a pilha de Redo após uma nova ação
    this.pilhaRedo.limpar();

    // Aplica a pontuação
    if (equipe.toUpperCase() === 'A') {
      this.placar.pontuarA(valor);
    } else {
      this.placar.pontuarB(valor);
    }

    // Registra no TAD Lista (Histórico)
    this.historicoRodadas.inserirFim({
      numero: this.numeroRodada,
      equipe: nomeEquipe,
      pontosGanhos: valor,
      placarApos: `${this.placar.pontosA} x ${this.placar.pontosB}`,
      distribuidor: this.obterDistribuidor(),
      mao: this.obterMao(),
      dataHora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    });
    this.numeroRodada++;

    // Rotaciona a mesa no TAD Fila (Próximo jogador é a Mão)
    this.filaMesa.rotacionar();

    return {
      sucesso: true,
      pontosA: this.placar.pontosA,
      pontosB: this.placar.pontosB,
      temVencedor: this.placar.temVencedor(),
      vencedor: this.placar.obterVencedor(),
      status11: RegrasTruco.verificarMaoDe11(this.placar.pontosA, this.placar.pontosB)
    };
  }

  desfazer() {
    if (this.pilhaUndo.estaVazia()) return false;

    const estadoRestaurar = this.pilhaUndo.pop();
    if (estadoRestaurar) {
      this.pilhaRedo.push({
        pontosA: this.placar.pontosA,
        pontosB: this.placar.pontosB,
        descricao: estadoRestaurar.descricao
      });
      this.placar.definirPontos(estadoRestaurar.pontosA, estadoRestaurar.pontosB);
      this.historicoRodadas.removerFim();
      if (this.numeroRodada > 1) this.numeroRodada--;
      return true;
    }
    return false;
  }

  refazer() {
    if (this.pilhaRedo.estaVazia()) return false;

    const estadoRedo = this.pilhaRedo.pop();
    if (estadoRedo) {
      this.pilhaUndo.push({
        pontosA: this.placar.pontosA,
        pontosB: this.placar.pontosB,
        descricao: estadoRedo.descricao
      });
      this.placar.definirPontos(estadoRedo.pontosA, estadoRedo.pontosB);
      this.numeroRodada++;
      return true;
    }
    return false;
  }

  obterMao() {
    return this.filaMesa.frente() || "Jogador 1";
  }

  obterDistribuidor() {
    const arr = this.filaMesa.paraArray();
    return arr.length > 0 ? arr[arr.length - 1] : "Distribuidor";
  }

  obterMesa() {
    return this.filaMesa.paraArray();
  }

  novaPartida() {
    this.placar.registrarVitoriaEReiniciar();
    this.historicoRodadas.limpar();
    this.pilhaUndo.limpar();
    this.pilhaRedo.limpar();
    this.numeroRodada = 1;
    this.dataInicio = new Date().toISOString();
  }

  resetTotal() {
    this.placar.resetTotal();
    this.historicoRodadas.limpar();
    this.pilhaUndo.limpar();
    this.pilhaRedo.limpar();
    this.numeroRodada = 1;
    this.dataInicio = new Date().toISOString();
  }

  paraObjeto() {
    return {
      dataInicio: this.dataInicio,
      numeroRodada: this.numeroRodada,
      placar: this.placar.paraObjeto(),
      historicoRodadas: this.historicoRodadas.paraArray(),
      pilhaUndo: this.pilhaUndo.paraArray().reverse(),
      pilhaRedo: this.pilhaRedo.paraArray().reverse(),
      mesa: this.filaMesa.paraArray()
    };
  }

  carregarDeObjeto(dados) {
    if (!dados) return;
    this.dataInicio = dados.dataInicio || new Date().toISOString();
    this.numeroRodada = dados.numeroRodada || 1;

    if (dados.placar) {
      this.placar.carregarDeObjeto(dados.placar);
    }

    this.historicoRodadas.limpar();
    (dados.historicoRodadas || []).forEach(r => this.historicoRodadas.inserirFim(r));

    this.pilhaUndo.limpar();
    (dados.pilhaUndo || []).forEach(snap => this.pilhaUndo.push(snap));

    this.pilhaRedo.limpar();
    (dados.pilhaRedo || []).forEach(snap => this.pilhaRedo.push(snap));

    this.filaMesa.limpar();
    (dados.mesa || []).forEach(j => this.filaMesa.enfileirar(j));
  }
}

// ==========================================
// 7. StorageManager - Camada de Persistência Web
// ==========================================
class StorageManager {
  static KEYS = {
    HISTORICO_PARTIDAS: 'truco_db_historico_partidas',
    ESTADO_ATIVO: 'truco_db_estado_ativo'
  };

  static salvarPartidaFinalizada(partida) {
    try {
      const historico = this.listarPartidas();
      const placar = partida.placar;
      const vencedor = placar.obterVencedor() || "Sem vencedor";

      const registro = {
        id: Date.now(),
        dataInicio: partida.dataInicio || new Date().toISOString(),
        dataFim: new Date().toISOString(),
        equipeA: placar.nomeEquipeA,
        equipeB: placar.nomeEquipeB,
        pontosA: placar.pontosA,
        pontosB: placar.pontosB,
        vitoriasA: placar.vitoriasA,
        vitoriasB: placar.vitoriasB,
        vencedor: vencedor,
        totalRodadas: partida.historicoRodadas.tamanho(),
        rodadas: partida.historicoRodadas.paraArray(),
        status: 'FINALIZADA'
      };

      historico.unshift(registro);
      localStorage.setItem(this.KEYS.HISTORICO_PARTIDAS, JSON.stringify(historico));
      return registro.id;
    } catch (e) {
      console.error("Erro ao salvar partida no LocalStorage:", e);
      return null;
    }
  }

  static salvarEstadoAtual(partida) {
    try {
      const dados = partida.paraObjeto();
      const payload = {
        atualizadoEm: new Date().toISOString(),
        dados: dados
      };
      localStorage.setItem(this.KEYS.ESTADO_ATIVO, JSON.stringify(payload));
      return true;
    } catch (e) {
      console.error("Erro ao salvar estado ativo:", e);
      return false;
    }
  }

  static carregarEstadoSalvo() {
    try {
      const bruto = localStorage.getItem(this.KEYS.ESTADO_ATIVO);
      if (!bruto) return null;
      const payload = JSON.parse(bruto);
      return payload.dados || payload;
    } catch (e) {
      console.error("Erro ao carregar estado salvo:", e);
      return null;
    }
  }

  static existeJogoSalvo() {
    return localStorage.getItem(this.KEYS.ESTADO_ATIVO) !== null;
  }

  static limparEstadoSalvo() {
    localStorage.removeItem(this.KEYS.ESTADO_ATIVO);
  }

  static listarPartidas() {
    try {
      const bruto = localStorage.getItem(this.KEYS.HISTORICO_PARTIDAS);
      return bruto ? JSON.parse(bruto) : [];
    } catch (e) {
      console.error("Erro ao listar partidas:", e);
      return [];
    }
  }

  static obterEstatisticas() {
    const partidas = this.listarPartidas();
    const totalPartidas = partidas.length;

    let totalRodadas = 0;
    const vitoriasPorEquipe = {};

    partidas.forEach(p => {
      totalRodadas += p.totalRodadas || (p.rodadas ? p.rodadas.length : 0);
      if (p.vencedor && p.vencedor !== "Sem vencedor") {
        vitoriasPorEquipe[p.vencedor] = (vitoriasPorEquipe[p.vencedor] || 0) + 1;
      }
    });

    const ranking = Object.keys(vitoriasPorEquipe)
      .map(equipe => ({ equipe, vitorias: vitoriasPorEquipe[equipe] }))
      .sort((a, b) => b.vitorias - a.vitorias);

    const mediaRodadas = totalPartidas > 0 ? (totalRodadas / totalPartidas).toFixed(1) : "0.0";

    return {
      totalPartidas,
      totalRodadas,
      ranking,
      mediaRodadas
    };
  }

  static limparTodoHistorico() {
    localStorage.removeItem(this.KEYS.HISTORICO_PARTIDAS);
  }
}

// ==========================================
// 8. Sintetizador de Áudio Tátil Web Audio API
// ==========================================
class GeradorSons {
  constructor() {
    this.ctx = null;
  }

  _obterContexto() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  beep(freq = 440, type = 'sine', duration = 0.08) {
    if (!somHabilitado) return;
    try {
      const ctx = this._obterContexto();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Áudio não disponível", e);
    }
  }

  vibrar(padrao = 35) {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(padrao);
      } catch (e) {}
    }
  }

  tocarClique() {
    this.vibrar(25);
    this.beep(600, 'triangle', 0.04);
  }

  tocarPonto() {
    this.vibrar(40);
    this.beep(520, 'sine', 0.12);
    setTimeout(() => this.beep(780, 'sine', 0.15), 80);
  }

  tocarTruco() {
    this.vibrar([40, 60, 80]);
    this.beep(400, 'square', 0.1);
    setTimeout(() => this.beep(600, 'square', 0.1), 80);
    setTimeout(() => this.beep(900, 'square', 0.2), 160);
  }

  tocarUndo() {
    this.vibrar(30);
    this.beep(350, 'sawtooth', 0.08);
  }

  tocarVitoria() {
    this.vibrar([100, 50, 100, 50, 200]);
    const notas = [523.25, 659.25, 783.99, 1046.50];
    notas.forEach((nota, i) => {
      setTimeout(() => this.beep(nota, 'triangle', 0.25), i * 120);
    });
  }
}

// ==========================================
// 9. Controlador Principal da Aplicação
// ==========================================
const audio = new GeradorSons();
let partida = new TADPartida("NÓS", "ELES");
let somHabilitado = true;
let partidaSalvaNoHistorico = false;

// Elementos do DOM
const scoreAEl = document.getElementById('score-a');
const scoreBEl = document.getElementById('score-b');
const winsAEl = document.getElementById('wins-a');
const winsBEl = document.getElementById('wins-b');
const roundBadgeEl = document.getElementById('round-badge');
const inputTeamA = document.getElementById('input-team-a');
const inputTeamB = document.getElementById('input-team-b');

const alertBanner = document.getElementById('alert-banner');
const alertText = document.getElementById('alert-text');

const btnUndo = document.getElementById('btn-undo');
const btnRedo = document.getElementById('btn-redo');
const btnNewMatch = document.getElementById('btn-new-match');
const btnResetAll = document.getElementById('btn-reset-all');
const btnToggleSound = document.getElementById('btn-toggle-sound');

const btnSaveGame = document.getElementById('btn-save-game');
const btnLoadGame = document.getElementById('btn-load-game');
const btnOpenDb = document.getElementById('btn-open-db');

const mesaListEl = document.getElementById('mesa-list');
const stackListEl = document.getElementById('stack-list');
const historyListEl = document.getElementById('history-list');

const victoryModal = document.getElementById('victory-modal');
const victoryTitle = document.getElementById('victory-title');
const victoryMessage = document.getElementById('victory-message');
const btnModalNewGame = document.getElementById('btn-modal-new-game');

const dbModal = document.getElementById('db-modal');
const btnCloseDbX = document.getElementById('btn-close-db-x');
const btnCloseDbModal = document.getElementById('btn-close-db-modal');
const tabBtnMatches = document.getElementById('tab-btn-matches');
const tabBtnStats = document.getElementById('tab-btn-stats');
const tabContentMatches = document.getElementById('tab-content-matches');
const tabContentStats = document.getElementById('tab-content-stats');
const dbMatchesList = document.getElementById('db-matches-list');
const dbStatsView = document.getElementById('db-stats-view');
const btnClearDb = document.getElementById('btn-clear-db');
const toastNotification = document.getElementById('toast-notification');

function mostrarToast(mensagem, duracao = 2500) {
  if (!toastNotification) return;
  toastNotification.textContent = mensagem;
  toastNotification.classList.add('active');
  setTimeout(() => {
    toastNotification.classList.remove('active');
  }, duracao);
}

function atualizarInterface() {
  const placar = partida.placar;

  if (scoreAEl) scoreAEl.textContent = placar.pontosA;
  if (scoreBEl) scoreBEl.textContent = placar.pontosB;
  if (winsAEl) winsAEl.textContent = placar.vitoriasA;
  if (winsBEl) winsBEl.textContent = placar.vitoriasB;
  if (roundBadgeEl) roundBadgeEl.textContent = `Mão #${partida.numeroRodada}`;

  if (inputTeamA && document.activeElement !== inputTeamA) {
    inputTeamA.value = placar.nomeEquipeA || "NÓS";
  }
  if (inputTeamB && document.activeElement !== inputTeamB) {
    inputTeamB.value = placar.nomeEquipeB || "ELES";
  }

  if (btnUndo) btnUndo.disabled = partida.pilhaUndo.estaVazia();
  if (btnRedo) btnRedo.disabled = partida.pilhaRedo.estaVazia();

  const status11 = RegrasTruco.verificarMaoDe11(placar.pontosA, placar.pontosB);
  if (alertBanner) {
    if (status11.emMaoDe11) {
      alertBanner.className = 'alert-banner active';
      if (status11.maoDeFerro) {
        alertBanner.classList.add('mao-ferro');
        if (alertText) alertText.textContent = "⚔️ MÃO DE FERRO (11 x 11)! Jogo às escuras.";
      } else {
        alertBanner.classList.add('mao-11');
        const time11 = status11.equipe === 'A' ? placar.nomeEquipeA : placar.nomeEquipeB;
        if (alertText) alertText.textContent = `⚠️ MÃO DE 11 para ${time11}! Proibido pedir truco.`;
      }
    } else {
      alertBanner.className = 'alert-banner';
    }
  }

  renderizarTADFila();
  renderizarTADPilha();
  renderizarTADLista();

  StorageManager.salvarEstadoAtual(partida);

  if (placar.temVencedor()) {
    const vencedor = placar.obterVencedor();
    if (victoryTitle) victoryTitle.textContent = `🏆 ${vencedor.toUpperCase()} VENCEU! 🏆`;
    if (victoryMessage) victoryMessage.textContent = `Parabéns! ${vencedor} atingiu os 12 tentos e fechou a queda!`;
    if (victoryModal) victoryModal.classList.add('active');
    audio.tocarVitoria();

    if (!partidaSalvaNoHistorico) {
      StorageManager.salvarPartidaFinalizada(partida);
      partidaSalvaNoHistorico = true;
      mostrarToast(`💾 Partida arquivada no Banco de Dados!`);
    }
  }
}

function renderizarTADFila() {
  if (!mesaListEl) return;
  mesaListEl.innerHTML = '';
  const jogadores = partida.obterMesa();
  const mao = partida.obterMao();
  const distribuidor = partida.obterDistribuidor();

  jogadores.forEach((jogador, index) => {
    const item = document.createElement('div');
    item.className = 'mesa-player-item';
    
    let roleBadge = '';
    if (jogador === mao) {
      item.classList.add('is-mao');
      roleBadge = '<span class="role-badge badge-mao">Mão</span>';
    } else if (jogador === distribuidor) {
      item.classList.add('is-distribuidor');
      roleBadge = '<span class="role-badge badge-distribuidor">Distribuidor</span>';
    }

    item.innerHTML = `
      <span><strong>#${index + 1}</strong> ${jogador}</span>
      ${roleBadge}
    `;
    mesaListEl.appendChild(item);
  });
}

function renderizarTADPilha() {
  if (!stackListEl) return;
  stackListEl.innerHTML = '';
  const snapshots = partida.pilhaUndo.paraArray();

  if (snapshots.length === 0) {
    stackListEl.innerHTML = '<p style="color:var(--text-muted);font-size:0.8rem;">Pilha vazia (nenhuma ação)</p>';
    return;
  }

  snapshots.forEach((snap, idx) => {
    const item = document.createElement('div');
    item.className = `stack-item ${idx === 0 ? 'top' : ''}`;
    item.innerHTML = `
      <span>${idx === 0 ? '🔼 Topo: ' : ''}${snap.descricao}</span>
      <span>[${snap.pontosA} x ${snap.pontosB}]</span>
    `;
    stackListEl.appendChild(item);
  });
}

function renderizarTADLista() {
  if (!historyListEl) return;
  historyListEl.innerHTML = '';
  const rodadas = partida.historicoRodadas.paraArray();

  if (rodadas.length === 0) {
    historyListEl.innerHTML = '<p style="color:var(--text-muted);font-size:0.8rem;">Nenhuma rodada registrada nesta partida.</p>';
    return;
  }

  rodadas.slice().reverse().forEach(r => {
    const item = document.createElement('div');
    const isTeamA = r.equipe === partida.placar.nomeEquipeA;
    item.className = `history-item ${isTeamA ? 'team-a-win' : 'team-b-win'}`;
    item.innerHTML = `
      <div>
        <strong>Mão #${r.numero}</strong>: ${r.equipe} (+${r.pontosGanhos} pts)
        <div style="color:var(--text-muted);font-size:0.7rem;">Mão: ${r.mao}</div>
      </div>
      <div style="font-family:var(--font-mono);font-weight:700;">${r.placarApos}</div>
    `;
    historyListEl.appendChild(item);
  });
}

function renderizarHistoricoBanco() {
  if (!dbMatchesList) return;
  dbMatchesList.innerHTML = '';
  const partidas = StorageManager.listarPartidas();

  if (partidas.length === 0) {
    dbMatchesList.innerHTML = `
      <div style="text-align:center;padding:2rem;color:var(--text-muted);">
        <p style="font-size:2rem;margin-bottom:0.5rem;">📭</p>
        <p>Nenhuma partida arquivada no banco ainda.</p>
        <p style="font-size:0.8rem;">Complete uma partida até 12 tentos para registrar automaticamente!</p>
      </div>
    `;
    return;
  }

  partidas.forEach(p => {
    const card = document.createElement('div');
    card.className = 'db-match-card';
    const dataFormatada = new Date(p.dataInicio).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const roundsHtml = (p.rodadas || []).map(r => `
      <div class="db-round-entry">
        <span><strong>Mão #${r.numero}</strong>: ${r.equipe} (+${r.pontosGanhos} pts)</span>
        <span>Placar: ${r.placarApos}</span>
      </div>
    `).join('');

    card.innerHTML = `
      <div class="db-match-header">
        <span class="db-match-date">📅 ${dataFormatada}</span>
        <span class="db-winner-tag">🏆 Vencedor: ${p.vencedor}</span>
      </div>
      <div class="db-match-score-row">
        <span class="db-team-name-a">${p.equipeA}</span>
        <span class="db-score-pill">${p.pontosA} x ${p.pontosB}</span>
        <span class="db-team-name-b">${p.equipeB}</span>
      </div>
      <div class="db-match-footer-info">
        <span>Total de Mãos: <strong>${p.totalRodadas || (p.rodadas ? p.rodadas.length : 0)}</strong></span>
        <button class="btn-toggle-rounds" data-id="${p.id}">Trilha de Mãos (TAD Lista) ▼</button>
      </div>
      <div class="db-rounds-collapse" id="rounds-collapse-${p.id}">
        ${roundsHtml || '<p style="color:var(--text-muted);font-size:0.75rem;">Sem rodadas detalhadas.</p>'}
      </div>
    `;

    dbMatchesList.appendChild(card);
  });

  dbMatchesList.querySelectorAll('.btn-toggle-rounds').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const matchId = btn.getAttribute('data-id');
      const collapseEl = document.getElementById(`rounds-collapse-${matchId}`);
      if (collapseEl) {
        const isOpen = collapseEl.classList.toggle('open');
        btn.textContent = isOpen ? 'Ocultar Mãos ▲' : 'Trilha de Mãos (TAD Lista) ▼';
      }
    });
  });
}

function renderizarEstatisticasBanco() {
  if (!dbStatsView) return;
  const stats = StorageManager.obterEstatisticas();
  
  const rankingHtml = stats.ranking.length > 0 
    ? stats.ranking.map((item, idx) => `
        <div class="db-ranking-item">
          <span><strong>#${idx + 1}</strong> ${item.equipe}</span>
          <span style="font-family:var(--font-mono);font-weight:700;color:var(--accent-cyan);">${item.vitorias} vitória(s)</span>
        </div>
      `).join('')
    : '<p style="color:var(--text-muted);font-size:0.8rem;">Nenhum vencedor registrado.</p>';

  dbStatsView.innerHTML = `
    <div class="db-stats-grid">
      <div class="db-stat-box">
        <div class="db-stat-val">${stats.totalPartidas}</div>
        <div class="db-stat-lbl">Partidas Jogadas</div>
      </div>
      <div class="db-stat-box">
        <div class="db-stat-val">${stats.totalRodadas}</div>
        <div class="db-stat-lbl">Mãos/Rodadas</div>
      </div>
      <div class="db-stat-box">
        <div class="db-stat-val">${stats.mediaRodadas}</div>
        <div class="db-stat-lbl">Média Mãos/Jogo</div>
      </div>
    </div>

    <h3 class="db-ranking-heading">🏆 Ranking de Vitórias por Equipe</h3>
    <div class="db-ranking-list">
      ${rankingHtml}
    </div>
  `;
}

function animarScore(time) {
  const el = time === 'A' ? scoreAEl : scoreBEl;
  if (!el) return;
  el.style.transform = 'scale(1.25)';
  setTimeout(() => {
    el.style.transform = 'scale(1)';
  }, 200);
}

// Vinculação de Eventos
document.querySelectorAll('.btn-point').forEach(btn => {
  btn.addEventListener('click', () => {
    const team = btn.getAttribute('data-team');
    const val = parseInt(btn.getAttribute('data-val'), 10);

    if (val >= 3) {
      audio.tocarTruco();
    } else {
      audio.tocarPonto();
    }

    animarScore(team);
    partida.pontuar(team, val);
    atualizarInterface();
  });
});

if (btnUndo) {
  btnUndo.addEventListener('click', () => {
    if (partida.desfazer()) {
      audio.tocarUndo();
      atualizarInterface();
    }
  });
}

if (btnRedo) {
  btnRedo.addEventListener('click', () => {
    if (partida.refazer()) {
      audio.tocarClique();
      atualizarInterface();
    }
  });
}

if (btnNewMatch) {
  btnNewMatch.addEventListener('click', () => {
    partida.novaPartida();
    partidaSalvaNoHistorico = false;
    audio.tocarClique();
    atualizarInterface();
  });
}

if (btnResetAll) {
  btnResetAll.addEventListener('click', () => {
    if (confirm("Deseja realmente zerar todo o placar e histórico de vitórias desta sessão?")) {
      partida.resetTotal();
      partidaSalvaNoHistorico = false;
      audio.tocarClique();
      atualizarInterface();
      mostrarToast("🔄 Placar e histórico da sessão reiniciados!");
    }
  });
}

if (btnToggleSound) {
  btnToggleSound.addEventListener('click', () => {
    somHabilitado = !somHabilitado;
    btnToggleSound.textContent = somHabilitado ? '🔊' : '🔇';
  });
}

function atualizarNomesEquipes() {
  const nomeA = inputTeamA ? (inputTeamA.value.trim() || "NÓS") : "NÓS";
  const nomeB = inputTeamB ? (inputTeamB.value.trim() || "ELES") : "ELES";
  partida.placar.nomeEquipeA = nomeA;
  partida.placar.nomeEquipeB = nomeB;

  // Atualiza rotação da mesa com os nomes customizados das equipes
  partida.filaMesa.limpar();
  partida.filaMesa.enfileirar(`${nomeA} 1`);
  partida.filaMesa.enfileirar(`${nomeB} 1`);
  partida.filaMesa.enfileirar(`${nomeA} 2`);
  partida.filaMesa.enfileirar(`${nomeB} 2`);

  atualizarInterface();
}

if (inputTeamA) {
  inputTeamA.addEventListener('input', atualizarNomesEquipes);
  inputTeamA.addEventListener('change', atualizarNomesEquipes);
}

if (inputTeamB) {
  inputTeamB.addEventListener('input', atualizarNomesEquipes);
  inputTeamB.addEventListener('change', atualizarNomesEquipes);
}

if (btnSaveGame) {
  btnSaveGame.addEventListener('click', () => {
    StorageManager.salvarEstadoAtual(partida);
    audio.tocarClique();
    mostrarToast("💾 Partida salva com sucesso no Banco de Dados local!");
  });
}

if (btnLoadGame) {
  btnLoadGame.addEventListener('click', () => {
    if (!StorageManager.existeJogoSalvo()) {
      mostrarToast("⚠️ Nenhuma partida salva encontrada.");
      return;
    }
    const dados = StorageManager.carregarEstadoSalvo();
    if (dados) {
      partida.carregarDeObjeto(dados);
      partidaSalvaNoHistorico = partida.placar.temVencedor();
      audio.tocarClique();
      atualizarInterface();
      mostrarToast("📂 Partida e TADs restaurados com sucesso!");
    }
  });
}

if (btnOpenDb) {
  btnOpenDb.addEventListener('click', () => {
    renderizarHistoricoBanco();
    renderizarEstatisticasBanco();
    if (dbModal) dbModal.classList.add('active');
    audio.tocarClique();
  });
}

function fecharModalBanco() {
  if (dbModal) dbModal.classList.remove('active');
}

if (btnCloseDbX) btnCloseDbX.addEventListener('click', fecharModalBanco);
if (btnCloseDbModal) btnCloseDbModal.addEventListener('click', fecharModalBanco);

if (tabBtnMatches) {
  tabBtnMatches.addEventListener('click', () => {
    tabBtnMatches.classList.add('active');
    if (tabBtnStats) tabBtnStats.classList.remove('active');
    if (tabContentMatches) tabContentMatches.classList.add('active');
    if (tabContentStats) tabContentStats.classList.remove('active');
  });
}

if (tabBtnStats) {
  tabBtnStats.addEventListener('click', () => {
    tabBtnStats.classList.add('active');
    if (tabBtnMatches) tabBtnMatches.classList.remove('active');
    if (tabContentStats) tabContentStats.classList.add('active');
    if (tabContentMatches) tabContentMatches.classList.remove('active');
    renderizarEstatisticasBanco();
  });
}

if (btnClearDb) {
  btnClearDb.addEventListener('click', () => {
    if (confirm("Deseja realmente apagar todo o histórico de partidas arquivadas do Banco de Dados?")) {
      StorageManager.limparTodoHistorico();
      renderizarHistoricoBanco();
      renderizarEstatisticasBanco();
      mostrarToast("🗑️ Histórico do Banco de Dados limpo!");
    }
  });
}

if (btnModalNewGame) {
  btnModalNewGame.addEventListener('click', () => {
    if (victoryModal) victoryModal.classList.remove('active');
    partida.novaPartida();
    partidaSalvaNoHistorico = false;
    atualizarInterface();
  });
}

// Gerenciamento de Abas Mobile para TADs
const tadTabBtns = document.querySelectorAll('.tad-tab-btn');
if (tadTabBtns.length > 0) {
  tadTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tadTabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const targetId = btn.getAttribute('data-target');

      document.querySelectorAll('.tad-card').forEach(card => {
        if (card.id === targetId) {
          card.classList.add('mobile-visible');
        } else {
          card.classList.remove('mobile-visible');
        }
      });
      audio.tocarClique();
    });
  });
}

// Registro de Service Worker e Instalação Mobile (PWA)
const btnInstallApp = document.getElementById('btn-install-app');
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (btnInstallApp) {
    btnInstallApp.style.display = 'flex';
  }
});

if (btnInstallApp) {
  btnInstallApp.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        mostrarToast("🎉 Aplicativo instalado com sucesso!");
      }
      deferredPrompt = null;
      btnInstallApp.style.display = 'none';
    }
  });
}

if ('serviceWorker' in navigator && (window.location.protocol === 'http:' || window.location.protocol === 'https:')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => console.log("Service Worker PWA registrado com sucesso!", reg))
      .catch((err) => console.warn("Falha ao registrar Service Worker:", err));
  });
}

// Inicialização imediata e no carregamento
function inicializar() {
  if (StorageManager.existeJogoSalvo()) {
    const dados = StorageManager.carregarEstadoSalvo();
    if (dados) {
      partida.carregarDeObjeto(dados);
    }
  }
  atualizarInterface();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializar);
} else {
  inicializar();
}
