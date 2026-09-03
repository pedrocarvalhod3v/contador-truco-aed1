"""
Regras de Negócio e Validações do Truco Paulista / Mineiro
Algoritmos e Estruturas de Dados I (AED1)
"""

from typing import Tuple


class RegrasTruco:
    """Regras formais de pontuação e condições especiais da partida de Truco."""

    VALORES_VALIDOS = (1, 3, 6, 9, 12)

    @classmethod
    def validar_pontos_rodada(cls, valor: int) -> bool:
        """Verifica se o incremento de pontuação é válido (1, 3, 6, 9 ou 12)."""
        return valor in cls.VALORES_VALIDOS

    @classmethod
    def proximo_valor_aposta(cls, valor_atual: int) -> int:
        """Retorna o próximo nível de aposta no Truco."""
        if valor_atual == 1:
            return 3
        elif valor_atual == 3:
            return 6
        elif valor_atual == 6:
            return 9
        elif valor_atual == 9:
            return 12
        return 12

    @classmethod
    def verificar_mao_de_11(cls, pontos_a: int, pontos_b: int) -> Tuple[bool, str | None]:
        """
        Identifica se o jogo entrou em 'Mão de 11'.
        Retorna (em_mao_de_11, equipe_com_11).
        Se ambas tiverem 11, é 'Mão de Ferro'.
        """
        if pontos_a == 11 and pontos_b == 11:
            return True, "AMBAS"  # Mão de Ferro
        elif pontos_a == 11:
            return True, "A"
        elif pontos_b == 11:
            return True, "B"
        return False, None

    @classmethod
    def verificar_mao_de_ferro(cls, pontos_a: int, pontos_b: int) -> bool:
        """Verifica se o jogo está no 11 x 11 (Mão de Ferro - jogo no escuro)."""
        return pontos_a == 11 and pontos_b == 11

    @classmethod
    def pode_pedir_truco(cls, pontos_a: int, pontos_b: int) -> bool:
        """
        Na Mão de 11 é estritamente proibido pedir truco.
        Quem pede truco na mão de 11 perde a mão/pontos automaticamente.
        """
        em_11, _ = cls.verificar_mao_de_11(pontos_a, pontos_b)
        return not em_11
