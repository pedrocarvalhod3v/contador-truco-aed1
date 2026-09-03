/**
 * Controlador de Interface e Eventos - Contador de Truco (AED1)
 * Conecta TADPartida com o DOM, gerencia áudio tátil, animações e camada de Banco de Dados.
 */

import { TADPartida } from './game/TADPartida.js';
import { RegrasTruco } from './game/RegrasTruco.js';
import { StorageManager } from './db/StorageManager.js';

// Instância única do Jogo Integrado
let partida = new TADPartida("NÓS", "ELES");
let somHabilitado = true;
let partidaSalvaNoHistorico = false;

// Sintetizador de Áudio Tátil via Web Audio API (Zero dependências externas)
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

const audio = new GeradorSons();

// Elementos do DOM do Placar
const scoreAEl = document.getElementById('score-a');
const scoreBEl = document.getElementById('score-b');
const winsAEl = document.getElementById('wins-a');
const winsBEl = document.getElementById('wins-b');
const roundBadgeEl = document.getElementById('round-badge');
const inputTeamA = document.getElementById('input-team-a');
const inputTeamB = document.getElementById('input-team-b');

const alertBanner = document.getElementById('alert-banner');
const alertText = document.getElementById('alert-text');

// Botões de Ação
const btnUndo = document.getElementById('btn-undo');
const btnRedo = document.getElementById('btn-redo');
const btnNewMatch = document.getElementById('btn-new-match');
const btnResetAll = document.getElementById('btn-reset-all');
const btnToggleSound = document.getElementById('btn-toggle-sound');

// Botões de Banco de Dados / Persistência
const btnSaveGame = document.getElementById('btn-save-game');
const btnLoadGame = document.getElementById('btn-load-game');
const btnOpenDb = document.getElementById('btn-open-db');

// Visualizadores de TADs
const mesaListEl = document.getElementById('mesa-list');
const stackListEl = document.getElementById('stack-list');
const historyListEl = document.getElementById('history-list');

// Modais
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

// Exibição de Notificação Toast
function mostrarToast(mensagem, duracao = 2500) {
  toastNotification.textContent = mensagem;
  toastNotification.classList.add('active');
  setTimeout(() => {
    toastNotification.classList.remove('active');
  }, duracao);
}

// Atualização Completa da Interface
function atualizarInterface() {
  const placar = partida.placar;

  // Atualiza Placar e Vitórias
  scoreAEl.textContent = placar.pontosA;
  scoreBEl.textContent = placar.pontosB;
  winsAEl.textContent = placar.vitoriasA;
  winsBEl.textContent = placar.vitoriasB;
  roundBadgeEl.textContent = `Mão #${partida.numeroRodada}`;

  if (inputTeamA && document.activeElement !== inputTeamA) {
    inputTeamA.value = placar.nomeEquipeA || "NÓS";
  }
  if (inputTeamB && document.activeElement !== inputTeamB) {
    inputTeamB.value = placar.nomeEquipeB || "ELES";
  }

  // Estado dos botões de Undo / Redo
  btnUndo.disabled = partida.pilhaUndo.estaVazia();
  btnRedo.disabled = partida.pilhaRedo.estaVazia();

  // Validação Mão de 11 / Mão de Ferro
  const status11 = RegrasTruco.verificarMaoDe11(placar.pontosA, placar.pontosB);
  if (status11.emMaoDe11) {
    alertBanner.className = 'alert-banner active';
    if (status11.maoDeFerro) {
      alertBanner.classList.add('mao-ferro');
      alertText.textContent = "⚔️ MÃO DE FERRO (11 x 11)! Jogo às escuras.";
    } else {
      alertBanner.classList.add('mao-11');
      const time11 = status11.equipe === 'A' ? placar.nomeEquipeA : placar.nomeEquipeB;
      alertText.textContent = `⚠️ MÃO DE 11 para ${time11}! Proibido pedir truco.`;
    }
  } else {
    alertBanner.className = 'alert-banner';
  }

  // Renderiza Visualizador dos TADs
  renderizarTADFila();
  renderizarTADPilha();
  renderizarTADLista();

  // Auto-salva estado ativo na sessão
  StorageManager.salvarEstadoAtual(partida);

  // Verifica Vitória e Auto-Persistência no Banco
  if (placar.temVencedor()) {
    const vencedor = placar.obterVencedor();
    victoryTitle.textContent = `🏆 ${vencedor.toUpperCase()} VENCEU! 🏆`;
    victoryMessage.textContent = `Parabéns! ${vencedor} atingiu os 12 tentos e fechou a queda! Partida salva no Banco de Dados.`;
    victoryModal.classList.add('active');
    audio.tocarVitoria();

    if (!partidaSalvaNoHistorico) {
      StorageManager.salvarPartidaFinalizada(partida);
      partidaSalvaNoHistorico = true;
      mostrarToast(`💾 Partida arquivada no Banco de Dados!`);
    }
  }
}

// Renderiza Visualizador do TAD Fila (Mesa)
function renderizarTADFila() {
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

// Renderiza Visualizador do TAD Pilha (Snapshots Undo)
function renderizarTADPilha() {
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

// Renderiza Visualizador do TAD Lista (Histórico de Rodadas)
function renderizarTADLista() {
  historyListEl.innerHTML = '';
  const rodadas = partida.historicoRodadas.paraArray();

  if (rodadas.length === 0) {
    historyListEl.innerHTML = '<p style="color:var(--text-muted);font-size:0.8rem;">Nenhuma rodada registrada nesta partida.</p>';
    return;
  }

  // Exibe do mais recente para o mais antigo
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

// Renderiza o Histórico de Partidas do Banco de Dados
function renderizarHistoricoBanco() {
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

  // Event Listeners para expansão de rodadas
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

// Renderiza a Aba de Estatísticas do Banco de Dados
function renderizarEstatisticasBanco() {
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

// Animação de Pulsar ao Pontuar
function animarScore(time) {
  const el = time === 'A' ? scoreAEl : scoreBEl;
  el.style.transform = 'scale(1.25)';
  setTimeout(() => {
    el.style.transform = 'scale(1)';
  }, 200);
}

// Event Listeners dos Botões de Pontuação
document.querySelectorAll('.btn-point').forEach(btn => {
  btn.addEventListener('click', (e) => {
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

// Ações Globais
btnUndo.addEventListener('click', () => {
  if (partida.desfazer()) {
    audio.tocarUndo();
    atualizarInterface();
  }
});

btnRedo.addEventListener('click', () => {
  if (partida.refazer()) {
    audio.tocarClique();
    atualizarInterface();
  }
});

btnNewMatch.addEventListener('click', () => {
  partida.novaPartida();
  partidaSalvaNoHistorico = false;
  audio.tocarClique();
  atualizarInterface();
});

btnResetAll.addEventListener('click', () => {
  if (confirm("Deseja realmente zerar todo o placar e histórico de vitórias desta sessão?")) {
    partida.resetTotal();
    partidaSalvaNoHistorico = false;
    audio.tocarClique();
    atualizarInterface();
    mostrarToast("🔄 Placar e histórico da sessão reiniciados!");
  }
});

btnToggleSound.addEventListener('click', () => {
  somHabilitado = !somHabilitado;
  if (somHabilitado) {
    btnToggleSound.classList.remove('muted');
    btnToggleSound.title = "Desativar Sons Táteis";
  } else {
    btnToggleSound.classList.add('muted');
    btnToggleSound.title = "Ativar Sons Táteis";
  }
});

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

// Ações de Salvar e Carregar Partida
btnSaveGame.addEventListener('click', () => {
  StorageManager.salvarEstadoAtual(partida);
  audio.tocarClique();
  mostrarToast("💾 Partida salva com sucesso no Banco de Dados local!");
});

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

// Gestão do Modal do Banco de Dados
btnOpenDb.addEventListener('click', () => {
  renderizarHistoricoBanco();
  renderizarEstatisticasBanco();
  dbModal.classList.add('active');
  audio.tocarClique();
});

function fecharModalBanco() {
  dbModal.classList.remove('active');
}

btnCloseDbX.addEventListener('click', fecharModalBanco);
btnCloseDbModal.addEventListener('click', fecharModalBanco);

// Alternar Abas do Banco de Dados
tabBtnMatches.addEventListener('click', () => {
  tabBtnMatches.classList.add('active');
  tabBtnStats.classList.remove('active');
  tabContentMatches.classList.add('active');
  tabContentStats.classList.remove('active');
});

tabBtnStats.addEventListener('click', () => {
  tabBtnStats.classList.add('active');
  tabBtnMatches.classList.remove('active');
  tabContentStats.classList.add('active');
  tabContentMatches.classList.remove('active');
  renderizarEstatisticasBanco();
});

// Limpar Banco de Dados
btnClearDb.addEventListener('click', () => {
  if (confirm("Deseja realmente apagar todo o histórico de partidas arquivadas do Banco de Dados?")) {
    StorageManager.limparTodoHistorico();
    renderizarHistoricoBanco();
    renderizarEstatisticasBanco();
    mostrarToast("🗑️ Histórico do Banco de Dados limpo!");
  }
});

// Modal de Vitória
btnModalNewGame.addEventListener('click', () => {
  victoryModal.classList.remove('active');
  partida.novaPartida();
  partidaSalvaNoHistorico = false;
  atualizarInterface();
});

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

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  // Carrega automaticamente o último estado se existir
  if (StorageManager.existeJogoSalvo()) {
    const dados = StorageManager.carregarEstadoSalvo();
    if (dados) {
      partida.carregarDeObjeto(dados);
    }
  }
  atualizarInterface();
});
