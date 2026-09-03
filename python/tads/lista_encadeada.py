"""
TAD Lista Encadeada Simples - Histórico de Partidas e Rodadas
Algoritmos e Estruturas de Dados I (AED1) - Módulo 3 (Listas)
"""

from typing import Any, Optional, List


class NoLista:
    """Nó individual da Lista Encadeada com ponteiro para o próximo."""
    def __init__(self, dado: Any):
        self.dado = dado
        self.proximo: Optional['NoLista'] = None


class ListaEncadeada:
    """
    Tipo Abstrato de Dados: Lista Simplesmente Encadeada Dinâmica.
    Utilizada para armazenar o histórico linear das rodadas e mãos jogadas.
    
    Complexidade:
    - Inserção no fim: O(1) com ponteiro de cauda / O(N) sem cauda (aqui implementado com cauda O(1))
    - Remoção do fim: O(N)
    - Busca por índice: O(N)
    - Tamanho: O(1)
    """

    def __init__(self):
        self._cabeca: Optional[NoLista] = None
        self._cauda: Optional[NoLista] = None
        self._tamanho: int = 0

    def esta_vazia(self) -> bool:
        """Verifica se a lista não possui nós."""
        return self._tamanho == 0

    def tamanho(self) -> int:
        """Retorna o número de elementos armazenados na lista."""
        return self._tamanho

    def inserir_fim(self, dado: Any) -> None:
        """
        Insere um novo elemento no final da lista encadeada.
        Complexidade: O(1)
        """
        novo_no = NoLista(dado)
        if self.esta_vazia():
            self._cabeca = novo_no
            self._cauda = novo_no
        else:
            assert self._cauda is not None
            self._cauda.proximo = novo_no
            self._cauda = novo_no
        self._tamanho += 1

    def inserir_inicio(self, dado: Any) -> None:
        """
        Insere um novo elemento no início da lista encadeada.
        Complexidade: O(1)
        """
        novo_no = NoLista(dado)
        if self.esta_vazia():
            self._cabeca = novo_no
            self._cauda = novo_no
        else:
            novo_no.proximo = self._cabeca
            self._cabeca = novo_no
        self._tamanho += 1

    def remover_fim(self) -> Optional[Any]:
        """
        Remove e retorna o último elemento da lista encadeada.
        Complexidade: O(N)
        """
        if self.esta_vazia():
            return None

        if self._tamanho == 1:
            dado = self._cabeca.dado  # type: ignore
            self._cabeca = None
            self._cauda = None
            self._tamanho = 0
            return dado

        # Percorrer até o penúltimo
        atual = self._cabeca
        while atual and atual.proximo != self._cauda:
            atual = atual.proximo

        dado = self._cauda.dado  # type: ignore
        self._cauda = atual
        if self._cauda:
            self._cauda.proximo = None
        self._tamanho -= 1
        return dado

    def obter(self, indice: int) -> Optional[Any]:
        """
        Obtém o elemento na posição informada (0-indexado).
        Complexidade: O(N)
        """
        if indice < 0 or indice >= self._tamanho:
            return None

        atual = self._cabeca
        for _ in range(indice):
            if atual:
                atual = atual.proximo
        return atual.dado if atual else None

    def para_lista(self) -> List[Any]:
        """
        Converte os elementos da estrutura encadeada para uma lista padrão.
        Complexidade: O(N)
        """
        elementos = []
        atual = self._cabeca
        while atual:
            elementos.append(atual.dado)
            atual = atual.proximo
        return elementos

    def limpar(self) -> None:
        """Esvazia toda a estrutura liberando referências."""
        self._cabeca = None
        self._cauda = None
        self._tamanho = 0

    def __iter__(self):
        atual = self._cabeca
        while atual:
            yield atual.dado
            atual = atual.proximo

    def __len__(self) -> int:
        return self._tamanho
