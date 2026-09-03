# 🃏 Contador de Truco — Algoritmos e Estruturas de Dados I (AED1)

Projeto acadêmico integrador desenvolvido para o curso de **Engenharia de Software**, demonstrando a aplicação prática de **Tipos Abstratos de Dados (TADs)**, **Modularização**, **Pilhas (Undo/Redo)**, **Filas (Gestão de Mesa)** e **Listas Encadeadas (Histórico)** nas etapas avaliativas **N1** e **N2**.

---

## 🚀 Como Executar o Projeto

### 1. Interface Web Moderna (PWA / Browser)
A aplicação web foi desenvolvida com **HTML5, Vanilla CSS (Glassmorphism / Dark UI) e JavaScript Modular (ES6)** sem dependências pesadas de build.

Para executar localmente:
```bash
# Opção A: Iniciar um servidor HTTP local via Python
python -m http.server 8000

# Depois, abra no navegador:
# http://localhost:8000
```
Ou simplesmente abra o arquivo `index.html` em qualquer navegador moderno.

---

### 2. Interface de Linha de Comando (CLI em Python)
Para testar a versão interativa de terminal com os TADs em Python:
```bash
python python/cli.py
```

---

### 3. Execução dos Testes Unitários Automatizados
Para executar a bateria de testes automatizados com validação de 100% dos TADs e regras:
```bash
python -m unittest discover -s python/tests -p "test_*.py" -v
```

---

## 📂 Estrutura do Projeto

```
├── index.html                   # Interface Web principal do Contador
├── css/
│   └── styles.css               # Design System Vanilla CSS (Glassmorphism, Dark Mode)
├── js/
│   ├── db/
│   │   └── StorageManager.js    # Camada de Persistência Web & LocalStorage
│   ├── tads/
│   │   ├── ListaEncadeada.js    # TAD Lista Encadeada (Histórico de Rodadas)
│   │   ├── Pilha.js             # TAD Pilha LIFO (Undo/Redo)
│   │   └── FilaCircular.js      # TAD Fila FIFO (Rotação de Turnos/Mesa)
│   ├── game/
│   │   ├── TADPlacar.js         # TAD Placar (Tentos e Vitórias)
│   │   ├── RegrasTruco.js       # Regras (Mão de 11, Mão de Ferro, Valores)
│   │   └── TADPartida.js        # Integrador Geral do Jogo
│   └── app.js                   # Controlador da Interface, Banco e Áudio Web
├── python/
│   ├── db/                      # Camada de Banco de Dados Relacional SQLite
│   │   ├── database.py          # Gerenciador de conexão SQLite e DDL
│   │   └── repositorio.py       # CRUD de Partidas, Rodadas e Snapshots
│   ├── tads/                    # TADs implementados em Python
│   │   ├── lista_encadeada.py
│   │   ├── pilha.py
│   │   └── fila_circular.py
│   ├── game/                    # Motor de regras em Python
│   │   ├── placar.py
│   │   ├── regras.py
│   │   └── partida.py
│   ├── cli.py                   # Interface interativa CLI de terminal com menu SQLite
│   └── tests/                   # Testes unitários (unittest)
│       ├── test_db.py           # Testes do Banco de Dados SQLite (:memory:)
│       ├── test_tads.py         # Testes de Lista, Pilha e Fila
│       └── test_game.py         # Testes de Regras e Partida
├── truco.db                     # Arquivo de Banco de Dados SQLite relacional
├── docs/
│   ├── relatorio-tecnico-n1.md  # Relatório acadêmico N1 (TADs, Alocação, Listas)
│   ├── relatorio-tecnico-n2.md  # Relatório acadêmico N2 (Pilhas, Filas, Big-O)
│   ├── regras-de-negocio.md     # Detalhamento das regras do Truco
│   └── arquitetura.md           # Diagrama das camadas e Modelo Relacional ER
├── batalha_final_N1_N2.md       # Roteiro da disciplina AED1
└── prompt-antigravity-contador-truco.md # Especificação acadêmica do prompt
```

---

## 🗄️ Camada de Banco de Dados e Persistência

O projeto conta com persistência completa em ambos os ecossistemas:

### 1. Python (SQLite Relacional Nativo — `truco.db`)
- **Tabelas Normalizadas**:
  - `partidas`: Registra metadados consolidados (equipes, pontuação final, vencedor, data/hora e total de rodadas).
  - `rodadas`: Trilha auditável de cada mão jogada (ligada ao `TADListaEncadeada`) com chave estrangeira em cascata.
  - `estado_salvo`: Armazena snapshots serializados em JSON de todos os TADs de uma partida em andamento para retomada instantânea.
- **Consultas Analíticas**: Cálculo de total de jogos, ranking de vitórias por equipe, média de mãos por partida e médias de pontuação.

### 2. Web (StorageManager & Modal de Banco)
- **Persistência no Navegador**: Histórico completo de partidas concluídas com detalhamento expansível de rodadas.
- **Salvamento do Estado**: Permite salvar e carregar partidas no meio do jogo.
- **Modal Interativo**: Interface Glassmorphism com abas de "Partidas Arquivadas" e "Estatísticas & Ranking".

---

## 📊 Mapeamento de Competências de AED1

| Módulo do Roteiro | Conceito Aplicado | Componente no Projeto |
|---|---|---|
| **Módulo 1** | Modularização & Passagem de Parâmetros | Separação em módulos coesos e funções com escopo restrito |
| **Módulo 2** | TADs & Alocação de Memória | `TADPlacar` e comparação de alocação estática vs dinâmica |
| **Módulo 3** | Listas Lineares | `TADListaEncadeada` armazenando o log de todas as rodadas |
| **Módulo 4** | Pilhas (LIFO) | `TADPilha` para o motor completo de **Desfazer (Undo)** e **Refazer (Redo)** |
| **Módulo 5** | Filas (FIFO) | `TADFilaCircular` para a **rotação de posições na mesa** (Mão, Pé, Distribuidor) |
| **Módulo 6** | Projeto Integrador & Persistência | `TADPartida` + `DatabaseManager` / `StorageManager` |

