/**
 * TAD Partida - Orquestrador Integrador (AED1 - Módulo 6)
 * Integra TAD Placar, TAD Lista (Histórico), TAD Pilha (Undo/Redo) e TAD Fila (Mesa).
 */

import { ListaEncadeada } from '../tads/ListaEncadeada.js';
import { Pilha } from '../tads/Pilha.js';
import { FilaCircular } from '../tads/FilaCircular.js';
import { TADPlacar } from './TADPlacar.js';
import { RegrasTruco } from './RegrasTruco.js';

export class TADPartida {
  constructor(nomeEquipeA = "Nós", nomeEquipeB = "Eles", jogadores = null) {
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

  static deObjeto(dados) {
    const partida = new TADPartida();
    partida.carregarDeObjeto(dados);
    return partida;
  }
}
