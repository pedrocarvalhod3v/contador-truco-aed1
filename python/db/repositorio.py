"""
Repositório de Partidas e Rodadas - Camada de Acesso a Dados (AED1)
Fornece operações CRUD e consultas analíticas integradas ao SQLite.
"""

import json
from datetime import datetime
from typing import Optional, List, Dict, Any
from python.db.database import DatabaseManager
from python.game.partida import TADPartida


class RepositorioPartida:
    """Repositório de persistência para o motor de Truco."""

    def __init__(self, db_manager: Optional[DatabaseManager] = None):
        self.db = db_manager or DatabaseManager()

    def salvar_partida_finalizada(self, partida: TADPartida) -> int:
        """
        Persiste uma partida finalizada e todas as suas rodadas (TAD Lista) no banco relacional.
        Retorna o ID da partida gerado no banco.
        """
        placar = partida.placar
        vencedor = placar.obter_vencedor() or "Empate / Interrompida"
        total_rodadas = partida.historico_rodadas.tamanho()
        data_fim = datetime.now().isoformat()

        with self.db.obter_conexao() as conn:
            cursor = conn.cursor()

            # 1. Insere registro mestre da Partida
            cursor.execute("""
                INSERT INTO partidas (
                    data_inicio, data_fim, equipe_a, equipe_b,
                    pontos_a, pontos_b, vitorias_a, vitorias_b,
                    vencedor, total_rodadas, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'FINALIZADA')
            """, (
                partida.data_inicio,
                data_fim,
                placar.nome_equipe_a,
                placar.nome_equipe_b,
                placar.pontos_a,
                placar.pontos_b,
                placar.vitorias_a,
                placar.vitorias_b,
                vencedor,
                total_rodadas
            ))

            partida_id = cursor.lastrowid

            # 2. Insere todas as rodadas associadas (TAD Lista Encadeda)
            rodadas = partida.historico_rodadas.para_lista()
            for r in rodadas:
                cursor.execute("""
                    INSERT INTO rodadas (
                        partida_id, numero_rodada, equipe,
                        pontos_ganhos, placar_apos, mao,
                        distribuidor, data_hora
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    partida_id,
                    r.get("numero", 1),
                    r.get("equipe", ""),
                    r.get("pontos_ganhos", 1),
                    r.get("placar_apos", ""),
                    r.get("mao", ""),
                    r.get("distribuidor", ""),
                    r.get("data_hora", datetime.now().strftime("%H:%M:%S"))
                ))

            conn.commit()
            return partida_id

    def salvar_estado_em_andamento(self, partida: TADPartida, slot: str = "partida_ativa") -> None:
        """
        Salva o snapshot serializado completo da partida ativa na tabela estado_salvo.
        Permite que o jogador feche a aplicação e retome de onde parou.
        """
        estado_dict = partida.para_dicionario()
        estado_json = json.dumps(estado_dict)
        atualizado_em = datetime.now().isoformat()

        with self.db.obter_conexao() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO estado_salvo (slot, estado_json, atualizado_em)
                VALUES (?, ?, ?)
                ON CONFLICT(slot) DO UPDATE SET
                    estado_json = excluded.estado_json,
                    atualizado_em = excluded.atualizado_em
            """, (slot, estado_json, atualizado_em))
            conn.commit()

    def carregar_estado_em_andamento(self, slot: str = "partida_ativa") -> Optional[TADPartida]:
        """
        Carrega o snapshot da partida ativa e reconstrói todas as estruturas (Pilha, Fila, Lista, Placar).
        Retorna uma nova instância de TADPartida ou None se não houver jogo salvo.
        """
        with self.db.obter_conexao() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT estado_json FROM estado_salvo WHERE slot = ?", (slot,))
            linha = cursor.fetchone()

            if not linha:
                return None

            estado_dict = json.loads(linha["estado_json"])
            return TADPartida.de_dicionario(estado_dict)

    def existe_jogo_salvo(self, slot: str = "partida_ativa") -> bool:
        """Verifica se existe um jogo salvo no slot especificado."""
        with self.db.obter_conexao() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT 1 FROM estado_salvo WHERE slot = ?", (slot,))
            return cursor.fetchone() is not None

    def limpar_estado_salvo(self, slot: str = "partida_ativa") -> None:
        """Remove o estado salvo do slot."""
        with self.db.obter_conexao() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM estado_salvo WHERE slot = ?", (slot,))
            conn.commit()

    def listar_partidas(self, limite: int = 50) -> List[Dict[str, Any]]:
        """Retorna uma lista resumida das últimas partidas finalizadas."""
        with self.db.obter_conexao() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT id, data_inicio, data_fim, equipe_a, equipe_b,
                       pontos_a, pontos_b, vitorias_a, vitorias_b,
                       vencedor, total_rodadas, status
                FROM partidas
                ORDER BY id DESC
                LIMIT ?
            """, (limite,))
            
            linhas = cursor.fetchall()
            return [dict(linha) for linha in linhas]

    def obter_partida_com_rodadas(self, partida_id: int) -> Optional[Dict[str, Any]]:
        """Retorna os dados completos de uma partida incluindo a lista de todas as rodadas."""
        with self.db.obter_conexao() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM partidas WHERE id = ?", (partida_id,))
            partida_row = cursor.fetchone()

            if not partida_row:
                return None

            cursor.execute("""
                SELECT * FROM rodadas 
                WHERE partida_id = ? 
                ORDER BY numero_rodada ASC
            """, (partida_id,))
            rodadas_rows = cursor.fetchall()

            partida_dict = dict(partida_row)
            partida_dict["rodadas"] = [dict(r) for r in rodadas_rows]
            return partida_dict

    def obter_estatisticas_gerais(self) -> Dict[str, Any]:
        """Calcula métricas agregadas sobre todas as partidas salvas no banco de dados."""
        with self.db.obter_conexao() as conn:
            cursor = conn.cursor()

            cursor.execute("SELECT COUNT(*) as total FROM partidas")
            total_partidas = cursor.fetchone()["total"]

            cursor.execute("SELECT COUNT(*) as total FROM rodadas")
            total_rodadas = cursor.fetchone()["total"]

            cursor.execute("""
                SELECT vencedor, COUNT(*) as vitorias 
                FROM partidas 
                WHERE vencedor IS NOT NULL AND status = 'FINALIZADA'
                GROUP BY vencedor 
                ORDER BY vitorias DESC
            """)
            ranking_vencedores = [dict(r) for r in cursor.fetchall()]

            cursor.execute("""
                SELECT 
                    AVG(total_rodadas) as media_rodadas,
                    AVG(pontos_a) as media_pts_a,
                    AVG(pontos_b) as media_pts_b
                FROM partidas
            """)
            medias = cursor.fetchone()

            return {
                "total_partidas": total_partidas,
                "total_rodadas": total_rodadas,
                "ranking_vencedores": ranking_vencedores,
                "media_rodadas_por_partida": round(medias["media_rodadas"] or 0, 2),
                "media_pontos_a": round(medias["media_pts_a"] or 0, 2),
                "media_pontos_b": round(medias["media_pts_b"] or 0, 2)
            }

    def limpar_todo_banco(self) -> None:
        """Limpa completamente todas as tabelas do banco de dados (útil para testes e reset)."""
        with self.db.obter_conexao() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM rodadas")
            cursor.execute("DELETE FROM partidas")
            cursor.execute("DELETE FROM estado_salvo")
            conn.commit()
