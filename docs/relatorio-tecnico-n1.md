# Relatório Técnico — Etapa N1 (AED1)
**Disciplina:** Algoritmos e Estruturas de Dados I  
**Curso:** Engenharia de Software  
**Projeto:** Contador e Gerenciador de Truco Modular  

---

## 1. Introdução e Objetivos

O objetivo da etapa N1 é demonstrar a correta aplicação dos conceitos de **Modularização**, **Passagem de Parâmetros por Valor e Referência**, especificação formal de **Tipos Abstratos de Dados (TADs)** e manipulação de **Listas** com estratégias de alocação de memória.

---

## 2. Especificação dos TADs Fundamentais

### 2.1 TAD Placar
- **Interface Pública:**
  - `pontuarA(valor: int) -> int` / `pontuarB(valor: int) -> int`: Incrementa a pontuação da equipe respeitando o teto de 12 tentos.
  - `definirPontos(pontosA: int, pontosB: int) -> void`: Altera diretamente os tentos (utilizado pela pilha de Undo).
  - `temVencedor() -> bool`: Verifica se a pontuação atingiu 12 tentos.
  - `obterVencedor() -> string | null`: Retorna o identificador da equipe vencedora.
- **Encapsulamento:** Os campos `pontosA`, `pontosB`, `vitoriasA` e `vitoriasB` são mantidos isolados e apenas manipulados por meio de métodos autorizados.

### 2.2 TAD Lista Encadeada (Histórico de Rodadas)
- **Representação Interna:** Estrutura dinâmica de nós encadeados (`NoLista`), contendo o dado armazenado e uma referência (`proximo`) para o próximo nó.
- **Vantagem sobre Alocação Estática:** Não há desperdício de memória pré-alocada nem risco de *overflow* caso a partida tenha dezenas de rodadas disputadas.

---

## 3. Alocação de Memória: Estática vs. Dinâmica

| Característica | Alocação Estática (Array de Tamanho Fixo) | Alocação Dinâmica (Lista Encadeada) |
|---|---|---|
| **Tempo de Alocação** | Em tempo de compilação ou inicialização fixa | Em tempo de execução sob demanda (`new` / `malloc`) |
| **Consumo de Memória** | Fixo (desperdiça espaço se poucas rodadas forem jogadas) | Exato (cresce e encolhe conforme rodadas são criadas/removidas) |
| **Inserção no Fim** | $O(1)$ amortizado ou restrito à capacidade máxima | $O(1)$ utilizando ponteiro de cauda (`_cauda`) |
| **Fragmentação** | Baixa (bloco contíguo) | Pode ocorrer fragmentação de heap |

---

## 4. Modularização e Passagem de Parâmetros

1. **Separação Interface vs. Implementação:** A camada de UI (`app.js` / `cli.py`) desconhece como os nós encadeados estão organizados; ela interage exclusivamente com a interface do TAD.
2. **Passagem por Valor vs. Referência:**
   - Valores primitivos de pontos e pontuação são passados por valor para garantir imutabilidade nos cálculos.
   - Instâncias dos TADs e snapshots de estado são repassados por referência para evitar cópias profundas desnecessárias de memória.
