"""
Gerenciador de Conexão e Esquema do Banco de Dados SQLite (AED1)
Responsável pela inicialização DDL e gestão segura de conexões relacionais.
"""

import sqlite3
import os
from typing import Optional


class DatabaseManager:
    """Gerenciador central de conexão e inicialização de tabelas SQLite."""

    def __init__(self, db_path: Optional[str] = None):
        """
        Inicializa o gerenciador. Se db_path for None, usa o arquivo padrão 'truco.db'
        na raiz do projeto ou aceita ':memory:' para testes unitários.
        """
        if db_path is None:
            # Caminho padrão na raiz do projeto
            raiz = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
            self.db_path = os.path.join(raiz, "truco.db")
            self._mem_conn = None
        elif db_path == ":memory:":
            self.db_path = ":memory:"
            # Para :memory:, mantém a conexão aberta para não perder os dados em memória
            self._mem_conn = sqlite3.connect(":memory:")
            self._mem_conn.row_factory = sqlite3.Row
            self._mem_conn.execute("PRAGMA foreign_keys = ON;")
        else:
            self.db_path = db_path
            self._mem_conn = None

        self.inicializar_banco()

    def obter_conexao(self) -> sqlite3.Connection:
        """Abre e retorna uma conexão configurada com suporte a Foreign Keys e Row Dict."""
        if self._mem_conn is not None:
            return self._mem_conn

        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA foreign_keys = ON;")
        return conn

    def inicializar_banco(self) -> None:
        """Cria as tabelas relacionais do sistema caso não existam."""
        with self.obter_conexao() as conn:
            cursor = conn.cursor()

            # Tabela de Partidas
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS partidas (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    data_inicio TEXT NOT NULL,
                    data_fim TEXT,
                    equipe_a TEXT NOT NULL,
                    equipe_b TEXT NOT NULL,
                    pontos_a INTEGER NOT NULL DEFAULT 0,
                    pontos_b INTEGER NOT NULL DEFAULT 0,
                    vitorias_a INTEGER NOT NULL DEFAULT 0,
                    vitorias_b INTEGER NOT NULL DEFAULT 0,
                    vencedor TEXT,
                    total_rodadas INTEGER NOT NULL DEFAULT 0,
                    status TEXT NOT NULL DEFAULT 'EM_ANDAMENTO'
                );
            """)

            # Tabela de Rodadas / Mãos (Trilha auditável ligada ao TAD Lista)
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS rodadas (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    partida_id INTEGER NOT NULL,
                    numero_rodada INTEGER NOT NULL,
                    equipe TEXT NOT NULL,
                    pontos_ganhos INTEGER NOT NULL,
                    placar_apos TEXT NOT NULL,
                    mao TEXT NOT NULL,
                    distribuidor TEXT NOT NULL,
                    data_hora TEXT NOT NULL,
                    FOREIGN KEY (partida_id) REFERENCES partidas(id) ON DELETE CASCADE
                );
            """)

            # Tabela de Estados Salvos (Para retomar jogo em andamento)
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS estado_salvo (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    slot TEXT UNIQUE NOT NULL,
                    estado_json TEXT NOT NULL,
                    atualizado_em TEXT NOT NULL
                );
            """)

            # Criação de índices para otimização de consultas
            cursor.execute("""
                CREATE INDEX IF NOT EXISTS idx_rodadas_partida 
                ON rodadas(partida_id);
            """)

            cursor.execute("""
                CREATE INDEX IF NOT EXISTS idx_partidas_data 
                ON partidas(data_inicio DESC);
            """)

            conn.commit()
