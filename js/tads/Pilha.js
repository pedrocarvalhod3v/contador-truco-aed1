/**
 * TAD Pilha Dinâmica LIFO (AED1 - Módulo 4)
 * Usado para o mecanismo de Undo (Desfazer) e Redo (Refazer) do placar.
 */

export class NoPilha {
  constructor(dado, abaixo = null) {
    this.dado = dado;
    this.abaixo = abaixo;
  }
}

export class Pilha {
  constructor() {
    this._topo = null;
    this._tamanho = 0;
  }

  estaVazia() {
    return this._tamanho === 0;
  }

  tamanho() {
    return this._tamanho;
  }

  /**
   * Empilha um novo elemento no topo.
   * Complexidade: O(1)
   */
  push(dado) {
    const novoNo = new NoPilha(dado, this._topo);
    this._topo = novoNo;
    this._tamanho++;
  }

  /**
   * Desempilha e retorna o elemento do topo.
   * Complexidade: O(1)
   */
  pop() {
    if (this.estaVazia()) return null;
    const dado = this._topo.dado;
    this._topo = this._topo.abaixo;
    this._tamanho--;
    return dado;
  }

  /**
   * Consulta o topo sem desempilhar.
   * Complexidade: O(1)
   */
  topo() {
    if (this.estaVazia()) return null;
    return this._topo.dado;
  }

  limpar() {
    this._topo = null;
    this._tamanho = 0;
  }

  /**
   * Retorna os elementos da pilha do topo para a base.
   * Complexidade: O(N)
   */
  paraArray() {
    const arr = [];
    let atual = this._topo;
    while (atual) {
      arr.push(atual.dado);
      atual = atual.abaixo;
    }
    return arr;
  }
}
