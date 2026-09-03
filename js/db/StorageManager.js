/**
 * StorageManager - Camada de Persistência e Banco de Dados Web (AED1)
 * Gerencia o armazenamento relacional-like no LocalStorage/IndexedDB.
 */

export class StorageManager {
  static KEYS = {
    HISTORICO_PARTIDAS: 'truco_db_historico_partidas',
    ESTADO_ATIVO: 'truco_db_estado_ativo'
  };

  /**
   * Salva uma partida finalizada e todas as suas rodadas no histórico persistente.
   */
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

      historico.unshift(registro); // Mais recente no topo
      localStorage.setItem(this.KEYS.HISTORICO_PARTIDAS, JSON.stringify(historico));
      return registro.id;
    } catch (e) {
      console.error("Erro ao salvar partida no LocalStorage:", e);
      return null;
    }
  }

  /**
   * Salva o snapshot da partida em andamento para retomada posterior.
   */
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

  /**
   * Carrega os dados serializados da partida em andamento.
   */
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

  /**
   * Verifica se há um jogo ativo salvo no storage.
   */
  static existeJogoSalvo() {
    return localStorage.getItem(this.KEYS.ESTADO_ATIVO) !== null;
  }

  /**
   * Remove o jogo ativo salvo.
   */
  static limparEstadoSalvo() {
    localStorage.removeItem(this.KEYS.ESTADO_ATIVO);
  }

  /**
   * Retorna a lista de todas as partidas finalizadas.
   */
  static listarPartidas() {
    try {
      const bruto = localStorage.getItem(this.KEYS.HISTORICO_PARTIDAS);
      return bruto ? JSON.parse(bruto) : [];
    } catch (e) {
      console.error("Erro ao listar partidas:", e);
      return [];
    }
  }

  /**
   * Obtém os dados completos de uma partida específica pelo seu ID.
   */
  static obterPartidaPorId(id) {
    const partidas = this.listarPartidas();
    return partidas.find(p => p.id === Number(id)) || null;
  }

  /**
   * Calcula estatísticas globais sobre todas as partidas arquivadas.
   */
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

  /**
   * Limpa todo o histórico de partidas arquivadas.
   */
  static limparTodoHistorico() {
    localStorage.removeItem(this.KEYS.HISTORICO_PARTIDAS);
  }
}
