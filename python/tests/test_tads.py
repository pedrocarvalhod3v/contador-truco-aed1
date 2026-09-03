"""
Testes Unitários Automatizados para os TADs (AED1)
Testa Lista Encadeada, Pilha e Fila Circular
"""

import unittest
from python.tads.lista_encadeada import ListaEncadeada
from python.tads.pilha import Pilha
from python.tads.fila_circular import FilaCircular


class TestTADListaEncadeada(unittest.TestCase):
    def setUp(self):
        self.lista = ListaEncadeada()

    def test_lista_inicial_vazia(self):
        self.assertTrue(self.lista.esta_vazia())
        self.assertEqual(self.lista.tamanho(), 0)
        self.assertEqual(len(self.lista), 0)

    def test_inserir_fim(self):
        self.lista.inserir_fim("A")
        self.lista.inserir_fim("B")
        self.lista.inserir_fim("C")
        self.assertFalse(self.lista.esta_vazia())
        self.assertEqual(self.lista.tamanho(), 3)
        self.assertEqual(self.lista.para_lista(), ["A", "B", "C"])

    def test_inserir_inicio(self):
        self.lista.inserir_inicio("C")
        self.lista.inserir_inicio("B")
        self.lista.inserir_inicio("A")
        self.assertEqual(self.lista.para_lista(), ["A", "B", "C"])

    def test_obter_por_indice(self):
        self.lista.inserir_fim("Item 0")
        self.lista.inserir_fim("Item 1")
        self.assertEqual(self.lista.obter(0), "Item 0")
        self.assertEqual(self.lista.obter(1), "Item 1")
        self.assertIsNone(self.lista.obter(5))
        self.assertIsNone(self.lista.obter(-1))

    def test_remover_fim(self):
        self.lista.inserir_fim(10)
        self.lista.inserir_fim(20)
        self.lista.inserir_fim(30)
        removido = self.lista.remover_fim()
        self.assertEqual(removido, 30)
        self.assertEqual(self.lista.tamanho(), 2)
        self.assertEqual(self.lista.para_lista(), [10, 20])

    def test_limpar_lista(self):
        self.lista.inserir_fim(1)
        self.lista.limpar()
        self.assertTrue(self.lista.esta_vazia())
        self.assertEqual(self.lista.tamanho(), 0)


class TestTADPilha(unittest.TestCase):
    def setUp(self):
        self.pilha = Pilha()

    def test_pilha_inicial_vazia(self):
        self.assertTrue(self.pilha.esta_vazia())
        self.assertEqual(self.pilha.tamanho(), 0)
        self.assertIsNone(self.pilha.topo())

    def test_push_e_pop(self):
        self.pilha.push("Snapshot 1")
        self.pilha.push("Snapshot 2")
        self.assertEqual(self.pilha.tamanho(), 2)
        self.assertEqual(self.pilha.topo(), "Snapshot 2")

        desempilhado = self.pilha.pop()
        self.assertEqual(desempilhado, "Snapshot 2")
        self.assertEqual(self.pilha.topo(), "Snapshot 1")
        self.assertEqual(self.pilha.tamanho(), 1)

    def test_pop_pilha_vazia(self):
        self.assertIsNone(self.pilha.pop())

    def test_limpar_pilha(self):
        self.pilha.push(1)
        self.pilha.push(2)
        self.pilha.limpar()
        self.assertTrue(self.pilha.esta_vazia())


class TestTADFilaCircular(unittest.TestCase):
    def setUp(self):
        self.fila = FilaCircular()

    def test_fila_inicial_vazia(self):
        self.assertTrue(self.fila.esta_vazia())
        self.assertEqual(self.fila.tamanho(), 0)

    def test_enfileirar_e_desenfileirar(self):
        self.fila.enfileirar("Jogador 1")
        self.fila.enfileirar("Jogador 2")
        self.assertEqual(self.fila.frente(), "Jogador 1")
        self.assertEqual(self.fila.tamanho(), 2)

        removido = self.fila.desenfileirar()
        self.assertEqual(removido, "Jogador 1")
        self.assertEqual(self.fila.frente(), "Jogador 2")
        self.assertEqual(self.fila.tamanho(), 1)

    def test_rotacionar(self):
        self.fila.enfileirar("J1")
        self.fila.enfileirar("J2")
        self.fila.enfileirar("J3")
        self.fila.enfileirar("J4")

        self.fila.rotacionar()
        self.assertEqual(self.fila.frente(), "J2")
        self.assertEqual(self.fila.para_lista(), ["J2", "J3", "J4", "J1"])


if __name__ == "__main__":
    unittest.main()
