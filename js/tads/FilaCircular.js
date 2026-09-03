/**
 * TAD Fila Dinâmica / Circular FIFO (AED1 - Módulo 5)
 * Usado para gerenciar a rotação de posições na mesa (Mão, Pé, Distribuidor).
 */

export class NoFila {
  constructor(dado) {
    this.dado = dado;
    this.proximo = null;
  }
}

export class FilaCircular {
  constructor() {
    this._frente = null;
    this._fim = null;
    this._tamanho = 0;
  }

  estaVazia() {
    return this._tamanho === 0;
  }

  tamanho() {
    return this._tamanho;
  }

  /**
   * Enfileira no final.
   * Complexidade: O(1)
   */
  enfileirar(dado) {
    const novoNo = new NoFila(dado);
    if (this.estaVazia()) {
      this._frente = novoNo;
      this._fim = novoNo;
    } else {
      this._fim.proximo = novoNo;
      this._fim = novoNo;
    }
    this._tamanho++;
  }

  /**
   * Desenfileira do início.
   * Complexidade: O(1)
   */
  desenfileirar() {
    if (this.estaVazia()) return null;
    const dado = this._frente.dado;
    this._frente = this._frente.proximo;
    if (!this._frente) {
      this._fim = null;
    }
    this._tamanho--;
    return dado;
  }

  /**
   * Consulta o primeiro elemento sem remover.
   * Complexidade: O(1)
   */
  frente() {
    if (this.estaVazia()) return null;
    return this._frente.dado;
  }

  /**
   * Rotaciona a fila (o primeiro vai para o final).
   * Complexidade: O(1)
   */
  rotacionar() {
    if (this._tamanho <= 1) return this.frente();
    const dado = this.desenfileirar();
    if (dado !== null) {
      this.enfileirar(dado);
    }
    return this.frente();
  }

  /**
   * Converte a fila para array ordenado da frente ao fim.
   * Complexidade: O(N)
   */
  paraArray() {
    const arr = [];
    let atual = this._frente;
    while (atual) {
      arr.push(atual.dado);
      atual = atual.proximo;
    }
    return arr;
  }

  limpar() {
    this._frente = null;
    this._fim = null;
    this._tamanho = 0;
  }
}
