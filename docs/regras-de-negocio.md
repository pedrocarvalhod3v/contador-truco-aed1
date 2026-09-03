# Regras de Negócio do Jogo de Truco

Este documento formaliza as regras implementadas no motor do **Contador de Truco**.

---

## 1. Pontuação e Tentos

- Cada partida é disputada até que uma das equipes atinja **12 tentos**.
- A pontuação de cada rodada/mão segue a progressão clássica:
  - **Mão Normal:** 1 ponto
  - **Truco:** 3 pontos
  - **Seis / Retruco:** 6 pontos
  - **Nove / Vale Quatro:** 9 pontos
  - **Doze / Queda:** 12 pontos (encerra a partida se aceito e ganho)

---

## 2. Casos Especiais

### 2.1 Mão de 11
- Ocorre quando uma equipe atinge **11 tentos** (enquanto o adversário tem 10 ou menos).
- A dupla com 11 pontos recebe suas 3 cartas e tem o direito de examiná-las em conjunto antes de jogar:
  - **Se aceitar jogar:** a rodada vale automaticamente **3 pontos**.
  - **Se recusar/correr:** a equipe adversária ganha automaticamente **1 ponto**.
- **Regra Rígida:** É expressamente **proibido pedir Truco na Mão de 11**. Quem pedir truco perde a mão imediatamente.

### 2.2 Mão de Ferro (11 x 11)
- Ocorre quando o placar empata em **11 a 11**.
- Todos os jogadores devem jogar "às escuras" (sem ver as cartas na mão).
- A mão vale 1 ponto e quem vencê-la ganha o jogo (chegando a 12).

---

## 3. Dinâmica da Mesa (Rotação)

- A mesa é composta por 4 jogadores dispostos alternadamente entre as duas duplas:
  - Jogador 1 (Equipe A)
  - Jogador 2 (Equipe B)
  - Jogador 3 (Equipe A)
  - Jogador 4 (Equipe B)
- **Mão:** O primeiro jogador a falar/jogar cartas na rodada.
- **Pé / Distribuidor:** O jogador responsável por embaralhar e distribuir as cartas.
- A cada mão finalizada, os papéis rotacionam no sentido horário (gerenciado pelo **TAD Fila Circular**).
