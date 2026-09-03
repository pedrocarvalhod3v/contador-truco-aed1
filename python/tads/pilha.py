"""
TAD Pilha (LIFO) - Mecanismo de Desfazer/Refazer (Undo/Redo)
Algoritmos e Estruturas de Dados I (AED1) - Módulo 4 (Pilhas)
"""

from typing import Any, Optional, List


class NoPilha:
    """Nó individual da Pilha encadeada com ponteiro para o nó anterior (abaixo)."""
    def __init__(self, dado: Any, abaixo: Optional['NoPilha'] = None):
        self.dado = dado
        self.abaixo = abaixo


class Pilha:
    """
    Tipo Abstrato de Dados: Pilha Dinâmica (LIFO - Last In, First Out).
    Utilizada fundamentalmente no gerenciamento de Undo (desfazer jogadas) 
    e Redo (refazer jogadas) no Contador de Truco.

    Complexidade:
    - push: O(1)
    - pop: O(1)
    - topo / peek: O(1)
    - esta_vazia: O(1)
    - tamanho: O(1)
    """

    def __init__(self, capacidade_maxima: Optional[int] = None):
        self._topo: Optional[NoPilha] = None
        self._tamanho: int = 0
        self._capacidade_maxima = capacidade_maxima

    def esta_vazia(self) -> bool:
        """Verifica se a pilha não contém elementos."""
        return self._tamanho == 0

    def tamanho(self) -> int:
        """Retorna o número de elementos atualmente empilhados."""
        return self._tamanho

    def push(self, dado: Any) -> bool:
        """
        Empilha um novo elemento no topo.
        Se houver limite de capacidade e estiver cheia, descarta a base ou recusa.
        Complexidade: O(1)
        """
        novo_no = NoPilha(dado, self._topo)
        self._topo = novo_no
        self._tamanho += 1
        return True

    def pop(self) -> Optional[Any]:
        """
        Desempilha e retorna o elemento do topo da pilha.
        Retorna None se a pilha estiver vazia.
        Complexidade: O(1)
        """
        if self.esta_vazia():
            return None

        assert self._topo is not None
        dado = self._topo.dado
        self._topo = self._topo.abaixo
        self._tamanho -= 1
        return dado

    def topo(self) -> Optional[Any]:
        """
        Consulta o elemento do topo sem removê-lo (peek).
        Complexidade: O(1)
        """
        if self.esta_vazia():
            return None
        assert self._topo is not None
        return self._topo.dado

    def limpar(self) -> None:
        """Esvazia toda a pilha."""
        self._topo = None
        self._tamanho = 0

    def para_lista(self) -> List[Any]:
        """
        Retorna os elementos da pilha do topo para a base.
        Complexidade: O(N)
        """
        elementos = []
        atual = self._topo
        while atual:
            elementos.append(atual.dado)
            atual = atual.abaixo
        return elementos

    def __len__(self) -> int:
        return self._tamanho
