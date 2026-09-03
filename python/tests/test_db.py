"""
Testes Unitários Automatizados para o Banco de Dados e Repositório SQLite (AED1)
Valida DDL, integridade relacional, persistência de rodadas e serialização de TADs.
"""

import unittest
from python.db.database import DatabaseManager
from python.db.repositorio import RepositorioPartida
from python.game.partida import TADPartida


class TestBancoDadosSQLite(unittest.TestCase):
    def setUp(self):
        # Utiliza SQLite em memória para garantir isolamento e velocidade nos testes
        self.db_manager = DatabaseManager(db_path=":memory:")
        self.repo = RepositorioPartida(self.db_manager)

    def test_inicializacao_e_tabelas(self):
        with self.db_manager.obter_conexao() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
            tabelas = [row["name"] for row in cursor.fetchall()]
            
            self.assertIn("partidas", tabelas)
            self.assertIn("rodadas", tabelas)
            self.assertIn("estado_salvo", tabelas)

    def test_salvar_partida_finalizada_e_rodadas(self):
        partida = TADPartida("Equipe Alpha", "Equipe Beta")
        partida.pontuar("A", 3)
        partida.pontuar("B", 1)
        partida.pontuar("A", 9)  # Alpha atinge 12 tentos e vence

        self.assertTrue(partida.placar.temVencedor if hasattr(partida.placar, 'temVencedor') else partida.placar.tem_vencedor())
        
        partida_id = self.repo.salvar_partida_finalizada(partida)
        self.assertIsInstance(partida_id, int)
        self.assertGreater(partida_id, 0)

        # Consulta partida com suas rodadas associadas
        detalhes = self.repo.obter_partida_com_rodadas(partida_id)
        self.assertIsNotNone(detalhes)
        self.assertEqual(detalhes["equipe_a"], "Equipe Alpha")
        self.assertEqual(detalhes["equipe_b"], "Equipe Beta")
        self.assertEqual(detalhes["pontos_a"], 12)
        self.assertEqual(detalhes["pontos_b"], 1)
        self.assertEqual(detalhes["vencedor"], "Equipe Alpha")
        self.assertEqual(detalhes["total_rodadas"], 3)
        self.assertEqual(len(detalhes["rodadas"]), 3)

        # Valida dados da primeira rodada salva
        r1 = detalhes["rodadas"][0]
        self.assertEqual(r1["numero_rodada"], 1)
        self.assertEqual(r1["equipe"], "Equipe Alpha")
        self.assertEqual(r1["pontos_ganhos"], 3)

    def test_salvar_e_carregar_estado_em_andamento(self):
        partida_orig = TADPartida("Time 1", "Time 2", ["J1", "J2", "J3", "J4"])
        partida_orig.pontuar("A", 3)
        partida_orig.pontuar("B", 6)

        # Salva estado ativo
        self.repo.salvar_estado_em_andamento(partida_orig)
        self.assertTrue(self.repo.existe_jogo_salvo())

        # Carrega estado ativo em uma nova instância
        partida_carregada = self.repo.carregar_estado_em_andamento()
        self.assertIsNotNone(partida_carregada)

        # Valida Placar
        self.assertEqual(partida_carregada.placar.pontos_a, 3)
        self.assertEqual(partida_carregada.placar.pontos_b, 6)
        self.assertEqual(partida_carregada.placar.nome_equipe_a, "Time 1")
        self.assertEqual(partida_carregada.placar.nome_equipe_b, "Time 2")

        # Valida TAD Lista de rodadas
        self.assertEqual(partida_carregada.historico_rodadas.tamanho(), 2)

        # Valida TAD Fila da mesa (deve ter rotacionado 2 vezes)
        mesa = partida_carregada.obter_mesa()
        self.assertEqual(mesa[0], "J3")

        # Valida TAD Pilha Undo (testa desfazer na instância carregada)
        sucesso_undo = partida_carregada.desfazer()
        self.assertTrue(sucesso_undo)
        self.assertEqual(partida_carregada.placar.pontos_b, 0)
        self.assertEqual(partida_carregada.placar.pontos_a, 3)

    def test_estatisticas_gerais(self):
        # Partida 1
        p1 = TADPartida("A", "B")
        p1.pontuar("A", 12)
        self.repo.salvar_partida_finalizada(p1)

        # Partida 2
        p2 = TADPartida("A", "B")
        p2.pontuar("B", 12)
        self.repo.salvar_partida_finalizada(p2)

        stats = self.repo.obter_estatisticas_gerais()
        self.assertEqual(stats["total_partidas"], 2)
        self.assertEqual(len(stats["ranking_vencedores"]), 2)


if __name__ == "__main__":
    unittest.main()
