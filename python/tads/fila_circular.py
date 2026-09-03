"""
TAD Fila (FIFO) - Gerenciamento e Rotação da Mesa e Turnos
Algoritmos e Estruturas de Dados I (AED1) - Módulo 5 (Filas)
"""

from typing import Any, Optional, List


class NoFila:
    """Nó individual da Fila com ponteiro para o próximo."""
    def __init__(self, dado: Any):
        self.dado = dado
        self.proximo: Optional['NoFila'] = None


class FilaCircular:
    """
    Tipo Abstrato de Dados: Fila Dinâmica / Circular (FIFO - First In, First Out).
    Utilizada para gerenciar a rotação de posições dos jogadores na mesa:
    - Quem é o "Mão" (primeiro a jogar na rodada)
    - Quem é o "Pé" (último a jogar na rodada)
    - Quem distribui as cartas (Doador/Embaralhador)
    - Ordem de corte do baralho

    Complexidade:
    - enfileirar (enqueue): O(1)
    - desenfileirar (dequeue): O(1)
    - frente / peek: O(1)
    - rotacionar: O(1)
    - tamanho: O(1)
    """

    def __init__(self):
        self._frente: Optional[NoFila] = None
        self._fim: Optional[NoFila] = None
        self._tamanho: int = 0

    def esta_vazia(self) -> bool:
        """Verifica se a fila está vazia."""
        return self._tamanho == 0

    def tamanho(self) -> int:
        """Retorna o número de elementos na fila."""
        return self._tamanho

    def enfileirar(self, dado: Any) -> None:
        """
        Insere um novo elemento no final da fila (Enqueue).
        Complexidade: O(1)
        """
        novo_no = NoFila(dado)
        if self.esta_vazia():
            self._frente = novo_no
            self._fim = novo_no
        else:
            assert self._fim is not None
            self._fim.proximo = novo_no
            self._fim = novo_no
        self._tamanho += 1

    def desenfileirar(self) -> Optional[Any]:
        """
        Remove e retorna o elemento da frente da fila (Dequeue).
        Complexidade: O(1)
        """
        if self.esta_vazia():
            return None

        assert self._frente is not None
        dado = self._frente.dado
        self._frente = self._frente.proximo
        if self._frente is None:
            self._fim = None
        self._tamanho -= 1
        return dado

    def frente(self) -> Optional[Any]:
        """
        Consulta o elemento da frente da fila sem removê-lo.
        Complexidade: O(1)
        """
        if self.esta_vazia():
            return None
        assert self._frente is not None
        return self._frente.dado

    def rotacionar(self) -> Optional[Any]:
        """
        Rotaciona a fila: desenfileira o primeiro elemento e o coloca no final.
        Útil para passar a vez da 'Mão' e do 'Embaralhador' a cada nova rodada.
        Complexidade: O(1)
        """
        if self._tamanho <= 1:
            return self.frente()

        dado = self.desenfileirar()
        if dado is not None:
            self.enfileirar(dado)
        return self.frente()

    def para_lista(self) -> List[Any]:
        """
        Converte a fila em uma lista da frente para o fim.
        Complexidade: O(N)
        """
        elementos = []
        atual = self._frente
        while atual:
            elementos.append(atual.dado)
            atual = atual.proximo
        return elementos

    def limpar(self) -> None:
        """Esvazia a fila."""
        self._frente = None
        self._fim = None
        self._tamanho = 0

    def __len__(self) -> int:
        return self._tamanho
