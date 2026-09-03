"""
Testes Unitários Automatizados para o Motor de Truco e TAD Partida
Testa Placar, Regras, Partida, Undo/Redo, Rotação e Condição de Vitória
"""

import unittest
from python.game.placar import TADPlacar
from python.game.regras import RegrasTruco
from python.game.partida import TADPartida


class TestTADPlacar(unittest.TestCase):
    def setUp(self):
        self.placar = TADPlacar("Nós", "Eles")

    def test_pontuacao_inicial(self):
        self.assertEqual(self.placar.pontos_a, 0)
        self.assertEqual(self.placar.pontos_b, 0)
        self.assertFalse(self.placar.tem_vencedor())

    def test_adicao_pontos_e_vitoria(self):
        self.placar.pontuar_a(3)
        self.assertEqual(self.placar.pontos_a, 3)
        
        self.placar.pontuar_a(9)
        self.assertEqual(self.placar.pontos_a, 12)
        self.assertTrue(self.placar.tem_vencedor())
        self.assertEqual(self.placar.obter_vencedor(), "Nós")

    def test_limite_maximo_pontos(self):
        self.placar.pontuar_b(15)
        self.assertEqual(self.placar.pontos_b, 12)


class TestRegrasTruco(unittest.TestCase):
    def test_valores_validos(self):
        self.assertTrue(RegrasTruco.validar_pontos_rodada(1))
        self.assertTrue(RegrasTruco.validar_pontos_rodada(3))
        self.assertTrue(RegrasTruco.validar_pontos_rodada(6))
        self.assertTrue(RegrasTruco.validar_pontos_rodada(9))
        self.assertTrue(RegrasTruco.validar_pontos_rodada(12))
        self.assertFalse(RegrasTruco.validar_pontos_rodada(2))
        self.assertFalse(RegrasTruco.validar_pontos_rodada(5))

    def test_mao_de_11(self):
        em_11, eq = RegrasTruco.verificar_mao_de_11(11, 8)
        self.assertTrue(em_11)
        self.assertEqual(eq, "A")

        em_11, eq = RegrasTruco.verificar_mao_de_11(11, 11)
        self.assertTrue(em_11)
        self.assertEqual(eq, "AMBAS")
        self.assertTrue(RegrasTruco.verificar_mao_de_ferro(11, 11))


class TestTADPartidaIntegrada(unittest.TestCase):
    def setUp(self):
        self.partida = TADPartida("Dupla Alpha", "Dupla Beta", ["P1", "P2", "P3", "P4"])

    def test_fluxo_pontuacao_e_historico(self):
        # Mão 1: Alpha ganha 3 pontos (Truco)
        res = self.partida.pontuar("A", 3)
        self.assertTrue(res["sucesso"])
        self.assertEqual(self.partida.placar.pontos_a, 3)
        self.assertEqual(self.partida.historico_rodadas.tamanho(), 1)

        # Mão 2: Beta ganha 1 ponto
        res = self.partida.pontuar("B", 1)
        self.assertTrue(res["sucesso"])
        self.assertEqual(self.partida.placar.pontos_b, 1)
        self.assertEqual(self.partida.historico_rodadas.tamanho(), 2)

    def test_undo_e_redo(self):
        self.partida.pontuar("A", 3)
        self.assertEqual(self.partida.placar.pontos_a, 3)

        # Desfazer
        sucesso_undo = self.partida.desfazer()
        self.assertTrue(sucesso_undo)
        self.assertEqual(self.partida.placar.pontos_a, 0)
        self.assertEqual(self.partida.historico_rodadas.tamanho(), 0)

        # Refazer
        sucesso_redo = self.partida.refazer()
        self.assertTrue(sucesso_redo)
        self.assertEqual(self.partida.placar.pontos_a, 3)

    def test_rotacao_de_mesa_na_fila(self):
        primeira_mao = self.partida.obter_mao()
        self.assertEqual(primeira_mao, "P1")

        self.partida.pontuar("A", 1)
        segunda_mao = self.partida.obter_mao()
        self.assertEqual(segunda_mao, "P2")


if __name__ == "__main__":
    unittest.main()
