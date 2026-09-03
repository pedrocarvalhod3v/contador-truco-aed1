/**
 * TAD Lista Simplesmente Encadeada Dinâmica (AED1 - Módulo 3)
 * Usado para armazenar o histórico linear de rodadas e mãos da partida.
 */

export class NoLista {
  constructor(dado) {
    this.dado = dado;
    this.proximo = null;
  }
}

export class ListaEncadeada {
  constructor() {
    this._cabeca = null;
    this._cauda = null;
    this._tamanho = 0;
  }

  estaVazia() {
    return this._tamanho === 0;
  }

  tamanho() {
    return this._tamanho;
  }

  /**
   * Insere um elemento no final da lista.
   * Complexidade: O(1)
   */
  inserirFim(dado) {
    const novoNo = new NoLista(dado);
    if (this.estaVazia()) {
      this._cabeca = novoNo;
      this._cauda = novoNo;
    } else {
      this._cauda.proximo = novoNo;
      this._cauda = novoNo;
    }
    this._tamanho++;
  }

  /**
   * Remove o último elemento da lista.
   * Complexidade: O(N)
   */
  removerFim() {
    if (this.estaVazia()) return null;

    if (this._tamanho === 1) {
      const dado = this._cabeca.dado;
      this._cabeca = null;
      this._cauda = null;
      this._tamanho = 0;
      return dado;
    }

    let atual = this._cabeca;
    while (atual.proximo && atual.proximo !== this._cauda) {
      atual = atual.proximo;
    }

    const dado = this._cauda.dado;
    this._cauda = atual;
    this._cauda.proximo = null;
    this._tamanho--;
    return dado;
  }

  /**
   * Obtém elemento por índice (0-based).
   * Complexidade: O(N)
   */
  obter(indice) {
    if (indice < 0 || indice >= this._tamanho) return null;
    let atual = this._cabeca;
    for (let i = 0; i < indice; i++) {
      atual = atual.proximo;
    }
    return atual ? atual.dado : null;
  }

  /**
   * Converte a lista encadeada para um array JavaScript.
   * Complexidade: O(N)
   */
  paraArray() {
    const arr = [];
    let atual = this._cabeca;
    while (atual) {
      arr.push(atual.dado);
      atual = atual.proximo;
    }
    return arr;
  }

  limpar() {
    this._cabeca = null;
    this._cauda = null;
    this._tamanho = 0;
  }
}
