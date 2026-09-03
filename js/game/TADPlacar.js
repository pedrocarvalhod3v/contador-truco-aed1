/**
 * TAD Placar - Gerenciamento de Pontos e Vitórias (AED1 - Módulo 2)
 */

export class TADPlacar {
  static PONTOS_VITORIA = 12;

  constructor(nomeEquipeA = "Nós", nomeEquipeB = "Eles") {
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

