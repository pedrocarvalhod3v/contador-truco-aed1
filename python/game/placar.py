"""
TAD Placar - Gerenciamento de Tentos e Partidas
Algoritmos e Estruturas de Dados I (AED1) - Módulo 2 (TADs)
"""

from typing import Dict, Any


class TADPlacar:
    """
    Tipo Abstrato de Dados: Placar do Truco.
    Encapsula o estado da pontuação (tentos de 0 a 12) e vitórias acumuladas.
    """

    PONTOS_VITORIA: int = 12

    def __init__(self, nome_equipe_a: str = "Nós", nome_equipe_b: str = "Eles"):
        self.nome_equipe_a = nome_equipe_a
        self.nome_equipe_b = nome_equipe_b
        self.pontos_a = 0
        self.pontos_b = 0
        self.vitorias_a = 0
        self.vitorias_b = 0

    def pontuar_a(self, valor: int) -> int:
        """Adiciona pontos para a Equipe A (limitado a 12). Retorna nova pontuação."""
        if valor <= 0:
            raise ValueError("Valor de pontuação deve ser positivo.")
        self.pontos_a = min(self.PONTOS_VITORIA, self.pontos_a + valor)
        return self.pontos_a

    def pontuar_b(self, valor: int) -> int:
        """Adiciona pontos para a Equipe B (limitado a 12). Retorna nova pontuação."""
        if valor <= 0:
            raise ValueError("Valor de pontuação deve ser positivo.")
        self.pontos_b = min(self.PONTOS_VITORIA, self.pontos_b + valor)
        return self.pontos_b

    def definir_pontos(self, pontos_a: int, pontos_b: int) -> None:
        """Define os pontos diretamente (usado em snapshots de Undo/Redo)."""
        self.pontos_a = max(0, min(self.PONTOS_VITORIA, pontos_a))
        self.pontos_b = max(0, min(self.PONTOS_VITORIA, pontos_b))

    def tem_vencedor(self) -> bool:
        """Verifica se alguma equipe atingiu 12 pontos."""
        return self.pontos_a >= self.PONTOS_VITORIA or self.pontos_b >= self.PONTOS_VITORIA

    def obter_vencedor(self) -> str | None:
        """Retorna o nome da equipe vencedora ou None se a partida estiver em andamento."""
        if self.pontos_a >= self.PONTOS_VITORIA:
            return self.nome_equipe_a
        if self.pontos_b >= self.PONTOS_VITORIA:
            return self.nome_equipe_b
        return None

    def registrar_vitoria_e_reiniciar(self) -> None:
        """Registra a vitória no histórico de partidas e zera o placar atual."""
        if self.pontos_a >= self.PONTOS_VITORIA:
            self.vitorias_a += 1
        elif self.pontos_b >= self.PONTOS_VITORIA:
            self.vitorias_b += 1
        self.pontos_a = 0
        self.pontos_b = 0

    def reset_total(self) -> None:
        """Zera pontos e vitórias."""
        self.pontos_a = 0
        self.pontos_b = 0
        self.vitorias_a = 0
        self.vitorias_b = 0

    def para_dicionario(self) -> Dict[str, Any]:
        """Exporta o estado atual do placar."""
        return {
            "equipe_a": self.nome_equipe_a,
            "equipe_b": self.nome_equipe_b,
            "pontos_a": self.pontos_a,
            "pontos_b": self.pontos_b,
            "vitorias_a": self.vitorias_a,
            "vitorias_b": self.vitorias_b,
            "tem_vencedor": self.tem_vencedor(),
            "vencedor": self.obter_vencedor()
        }

    def carregar_de_dicionario(self, dados: Dict[str, Any]) -> None:
        """Restaura o estado a partir de um dicionário serializado."""
        self.nome_equipe_a = dados.get("equipe_a", self.nome_equipe_a)
        self.nome_equipe_b = dados.get("equipe_b", self.nome_equipe_b)
        self.pontos_a = dados.get("pontos_a", 0)
        self.pontos_b = dados.get("pontos_b", 0)
        self.vitorias_a = dados.get("vitorias_a", 0)
        self.vitorias_b = dados.get("vitorias_b", 0)

