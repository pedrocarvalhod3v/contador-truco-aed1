/**
 * Regras e Validações do Truco Paulista / Mineiro (AED1)
 */

export class RegrasTruco {
  static VALORES_VALIDOS = [1, 3, 6, 9, 12];

  static validarPontosRodada(valor) {
    return RegrasTruco.VALORES_VALIDOS.includes(valor);
  }

  static verificarMaoDe11(pontosA, pontosB) {
    if (pontosA === 11 && pontosB === 11) {
      return { emMaoDe11: true, equipe: "AMBAS", maoDeFerro: true };
    }
    if (pontosA === 11) {
      return { emMaoDe11: true, equipe: "A", maoDeFerro: false };
    }
    if (pontosB === 11) {
      return { emMaoDe11: true, equipe: "B", maoDeFerro: false };
    }
    return { emMaoDe11: false, equipe: null, maoDeFerro: false };
  }

  static podePedirTruco(pontosA, pontosB) {
    const status = RegrasTruco.verificarMaoDe11(pontosA, pontosB);
    return !status.emMaoDe11;
  }
}
