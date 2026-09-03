# Relatório Técnico — Etapa N2 (AED1)
**Disciplina:** Algoritmos e Estruturas de Dados I  
**Curso:** Engenharia de Software  
**Projeto:** Contador e Gerenciador de Truco Integrador  

---

## 1. Estruturas Avançadas Implementadas na N2

A etapa N2 integrou duas estruturas de dados com disciplinas específicas de acesso à memória:

### 1.1 TAD Pilha (LIFO — Last In, First Out)
- **Finalidade:** Implementar o motor de **Desfazer (Undo)** e **Refazer (Redo)**.
- **Funcionamento:**
  - A cada nova pontuação, um `Snapshot` contendo os pontos de ambas as equipes e a descrição da jogada é empilhado (`push`) na `pilhaUndo`, enquanto a `pilhaRedo` é esvaziada.
  - Ao acionar `Desfazer`, o topo de `pilhaUndo` é desempilhado e transferido para `pilhaRedo`. O novo topo passa a ser o estado ativo do jogo.
  - Ao acionar `Refazer`, o elemento do topo de `pilhaRedo` é restaurado e reempilhado em `pilhaUndo`.

### 1.2 TAD Fila Circular (FIFO — First In, First Out)
- **Finalidade:** Gerenciamento do fluxo de rotação de papéis dos jogadores na mesa.
- **Funcionamento:**
  - Quatro posições são enfileiradas. A frente da fila (`front`) determina quem é o **Mão** da rodada (primeiro a jogar).
  - O último elemento da fila determina quem é o **Distribuidor / Doador** (quem dá as cartas e é o Pé).
  - A operação `rotacionar()` (executada a cada nova rodada) desenfileira o jogador da frente e o re-enfileira no final em tempo constante $O(1)$.

---

## 2. Tabela de Complexidade Assintótica (Big-O)

Abaixo consta a análise formal de complexidade temporal e espacial das estruturas e operações implementadas:

| TAD / Estrutura | Operação | Complexidade Temporal (Melhor Caso) | Complexidade Temporal (Pior Caso) | Complexidade Espacial | Justificativa Teórica |
|---|---|:---:|:---:|:---:|---|
| **TAD Pilha** | `push(dado)` | $O(1)$ | $O(1)$ | $O(1)$ | Alocação de novo nó e ajuste do ponteiro do topo. |
| **TAD Pilha** | `pop()` | $O(1)$ | $O(1)$ | $O(1)$ | Remoção direta da referência do topo. |
| **TAD Pilha** | `topo()` / `peek` | $O(1)$ | $O(1)$ | $O(1)$ | Leitura direta do ponteiro `_topo`. |
| **TAD Fila** | `enfileirar(dado)` | $O(1)$ | $O(1)$ | $O(1)$ | Inserção direta utilizando o ponteiro `_fim`. |
| **TAD Fila** | `desenfileirar()` | $O(1)$ | $O(1)$ | $O(1)$ | Remoção direta utilizando o ponteiro `_frente`. |
| **TAD Fila** | `rotacionar()` | $O(1)$ | $O(1)$ | $O(1)$ | Combinação de `desenfileirar()` + `enfileirar()`. |
| **TAD Lista** | `inserirFim(dado)` | $O(1)$ | $O(1)$ | $O(1)$ | Inserção com ponteiro de cauda (`_cauda`). |
| **TAD Lista** | `removerFim()` | $O(N)$ | $O(N)$ | $O(1)$ | Necessidade de percorrer até o penúltimo nó. |
| **TAD Lista** | `obter(indice)` | $O(1)$ | $O(N)$ | $O(1)$ | Percurso linear dos nós até o índice desejado. |

---

## 3. Conclusão da Integração (Módulo 6)

A combinação dos TADs resultou em um sistema altamente coeso e desacoplado:
1. O **TAD Partida** orquestra todas as estruturas sem violar o encapsulamento interno de nenhuma delas.
2. A integridade das jogadas é garantida pelas pilhas de *Undo/Redo*, prevenindo erros humanos na pontuação durante partidas de Truco.
3. A rotação de mesa gerenciada pelo TAD Fila automatiza a alternância de doadores de cartas e mãos, eliminando discussões de jogo.
