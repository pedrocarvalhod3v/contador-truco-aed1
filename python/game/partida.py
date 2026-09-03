"""
TAD Partida - Módulo Integrador do Contador de Truco
Algoritmos e Estruturas de Dados I (AED1) - Módulo 6 (Integração e Projeto Final)

Combina:
- TAD Placar (Pontuação e Quedas)
- TAD Lista Encadeada (Histórico de Rodadas)
- TAD Pilha (Desfazer/Refazer - Undo/Redo)
- TAD Fila Circular (Gestão e Rotação da Mesa)
"""

from typing import Dict, Any, List, Optional
from datetime import datetime
from python.tads.lista_encadeada import ListaEncadeada
from python.tads.pilha import Pilha
from python.tads.fila_circular import FilaCircular
from python.game.placar import TADPlacar
from python.game.regras import RegrasTruco


class SnapshotJogo:
    """Snapshot imutável do estado para permitir Undo/Redo na Pilha."""
    def __init__(self, pontos_a: int, pontos_b: int, descricao: str):
        self.pontos_a = pontos_a
        self.pontos_b = pontos_b
        self.descricao = descricao

    def para_dicionario(self) -> Dict[str, Any]:
        return {
            "pontos_a": self.pontos_a,
            "pontos_b": self.pontos_b,
            "descricao": self.descricao
        }

    @classmethod
    def de_dicionario(cls, dados: Dict[str, Any]) -> 'SnapshotJogo':
        return cls(
            pontos_a=dados["pontos_a"],
            pontos_b=dados["pontos_b"],
            descricao=dados["descricao"]
        )


class TADPartida:
    """
    Controlador e Orquestrador Central da Partida de Truco.
    Integra as estruturas de dados requeridas no roteiro de AED1.
    """

    def __init__(
        self,
        nome_equipe_a: str = "Nós",
        nome_equipe_b: str = "Eles",
        jogadores: Optional[List[str]] = None
    ):
        self.placar = TADPlacar(nome_equipe_a, nome_equipe_b)
        self.historico_rodadas = ListaEncadeada()
        self.pilha_undo = Pilha()
        self.pilha_redo = Pilha()
        self.fila_mesa = FilaCircular()
        self.numero_rodada: int = 1
        self.data_inicio: str = datetime.now().isoformat()

        # Inicializa fila de posições da mesa (4 jogadores em duplas alternadas)
        lista_jogadores = jogadores or [
            f"{nome_equipe_a} 1",
            f"{nome_equipe_b} 1",
            f"{nome_equipe_a} 2",
            f"{nome_equipe_b} 2"
        ]
        for jogador in lista_jogadores:
            self.fila_mesa.enfileirar(jogador)

        # Não precisa empilhar estado vazio inicial, empilha a cada jogada
        # self._salvar_estado("Início da Partida")

    def _salvar_estado(self, descricao: str) -> None:
        """Empilha o estado atual na pilha de Undo."""
        snap = SnapshotJogo(self.placar.pontos_a, self.placar.pontos_b, descricao)
        self.pilha_undo.push(snap)

    def pontuar(self, equipe: str, valor: int) -> Dict[str, Any]:
        """
        Adiciona pontos a uma equipe ('A' ou 'B') conforme regras de Truco.
        Atualiza histórico na Lista, salva estado na Pilha e rotaciona Fila da mesa.
        """
        if self.placar.tem_vencedor():
            return {
                "sucesso": False,
                "mensagem": f"Partida já encerrada! Vencedor: {self.placar.obter_vencedor()}"
            }

        if not RegrasTruco.validar_pontos_rodada(valor):
            return {
                "sucesso": False,
                "mensagem": f"Valor de pontos inválido: {valor}. Deve ser 1, 3, 6, 9 ou 12."
            }

        nome_equipe = self.placar.nome_equipe_a if equipe.upper() == 'A' else self.placar.nome_equipe_b
        
        # Salva estado antes da pontuação para Undo
        self._salvar_estado(f"+{valor} pontos para {nome_equipe}")
        
        # Ao realizar nova ação, limpa a pilha de Redo
        self.pilha_redo.limpar()

        # Aplica a pontuação
        if equipe.upper() == 'A':
            self.placar.pontuar_a(valor)
        else:
            self.placar.pontuar_b(valor)

        # Registra no TAD Lista (Histórico)
        registro_rodada = {
            "numero": self.numero_rodada,
            "equipe": nome_equipe,
            "pontos_ganhos": valor,
            "placar_apos": f"{self.placar.pontos_a} x {self.placar.pontos_b}",
            "distribuidor": self.obter_distribuidor(),
            "mao": self.obter_mao()
        }
        self.historico_rodadas.inserir_fim(registro_rodada)
        self.numero_rodada += 1

        # Rotaciona a mesa no TAD Fila (o próximo jogador vira a Mão)
        self.fila_mesa.rotacionar()

        return {
            "sucesso": True,
            "pontos_a": self.placar.pontos_a,
            "pontos_b": self.placar.pontos_b,
            "tem_vencedor": self.placar.tem_vencedor(),
            "vencedor": self.placar.obter_vencedor(),
            "mao_de_11": RegrasTruco.verificar_mao_de_11(self.placar.pontos_a, self.placar.pontos_b),
            "mao_de_ferro": RegrasTruco.verificar_mao_de_ferro(self.placar.pontos_a, self.placar.pontos_b)
        }

    def desfazer(self) -> bool:
        """
        Executa Undo (Desfazer) utilizando o TAD Pilha.
        Restaura o placar para o snapshot anterior.
        """
        if self.pilha_undo.esta_vazia():
            return False

        # Recupera o snapshot do topo que guarda o estado anterior
        estado_restaurar = self.pilha_undo.pop()
        if estado_restaurar:
            # Salva o estado atual na pilha de Redo para permitir refazer
            self.pilha_redo.push(SnapshotJogo(self.placar.pontos_a, self.placar.pontos_b, estado_restaurar.descricao))
            self.placar.definir_pontos(estado_restaurar.pontos_a, estado_restaurar.pontos_b)
            self.historico_rodadas.remover_fim()
            if self.numero_rodada > 1:
                self.numero_rodada -= 1
            return True
        return False

    def refazer(self) -> bool:
        """
        Executa Redo (Refazer) utilizando o TAD Pilha.
        Recupera uma ação desfeita anteriormente.
        """
        if self.pilha_redo.esta_vazia():
            return False

        estado_redo: SnapshotJogo = self.pilha_redo.pop()
        if estado_redo:
            # Salva o estado atual na pilha de Undo
            self.pilha_undo.push(SnapshotJogo(self.placar.pontos_a, self.placar.pontos_b, estado_redo.descricao))
            self.placar.definir_pontos(estado_redo.pontos_a, estado_redo.pontos_b)
            self.numero_rodada += 1
            return True
        return False

    def obter_mao(self) -> str:
        """Retorna o jogador que é a 'Mão' na rodada atual (frente da fila)."""
        return self.fila_mesa.frente() or "Jogador 1"

    def obter_distribuidor(self) -> str:
        """Retorna o jogador que dá as cartas (quem está no pé/fim da fila)."""
        jogadores = self.fila_mesa.para_lista()
        return jogadores[-1] if jogadores else "Distribuidor"

    def obter_mesa(self) -> List[str]:
        """Retorna a lista ordenada dos jogadores na mesa."""
        return self.fila_mesa.para_lista()

    def nova_partida(self) -> None:
        """Inicia uma nova partida mantendo o placar de vitórias acumuladas."""
        self.placar.registrar_vitoria_e_reiniciar()
        self.historico_rodadas.limpar()
        self.pilha_undo.limpar()
        self.pilha_redo.limpar()
        self.numero_rodada = 1
        self.data_inicio = datetime.now().isoformat()

    def reiniciar_tudo(self) -> None:
        """Reinicia completamente o placar, histórico, pilhas e quedas."""
        self.placar.reset_total()
        self.historico_rodadas.limpar()
        self.pilha_undo.limpar()
        self.pilha_redo.limpar()
        self.numero_rodada = 1
        self.data_inicio = datetime.now().isoformat()


    def para_dicionario(self) -> Dict[str, Any]:
        """
        Serializa todo o estado interno dos TADs da partida em um dicionário.
        Utilizado para salvar o estado ativo no Banco de Dados SQLite.
        """
        return {
            "data_inicio": self.data_inicio,
            "numero_rodada": self.numero_rodada,
            "placar": self.placar.para_dicionario(),
            "historico_rodadas": self.historico_rodadas.para_lista(),
            # Pilhas armazenam da base para o topo para facilitar a reconstrução
            "pilha_undo": [s.para_dicionario() for s in reversed(self.pilha_undo.para_lista())],
            "pilha_redo": [s.para_dicionario() for s in reversed(self.pilha_redo.para_lista())],
            "mesa": self.fila_mesa.para_lista()
        }

    def carregar_de_dicionario(self, dados: Dict[str, Any]) -> None:
        """
        Restaura o estado completo de todos os TADs a partir de um dicionário serializado.
        """
        self.data_inicio = dados.get("data_inicio", datetime.now().isoformat())
        self.numero_rodada = dados.get("numero_rodada", 1)

        # Restaura Placar
        if "placar" in dados:
            self.placar.carregar_de_dicionario(dados["placar"])

        # Restaura TAD Lista (Histórico)
        self.historico_rodadas.limpar()
        for rodada in dados.get("historico_rodadas", []):
            self.historico_rodadas.inserir_fim(rodada)

        # Restaura TAD Pilha Undo
        self.pilha_undo.limpar()
        for snap_dado in dados.get("pilha_undo", []):
            self.pilha_undo.push(SnapshotJogo.de_dicionario(snap_dado))

        # Restaura TAD Pilha Redo
        self.pilha_redo.limpar()
        for snap_dado in dados.get("pilha_redo", []):
            self.pilha_redo.push(SnapshotJogo.de_dicionario(snap_dado))

        # Restaura TAD Fila (Mesa)
        self.fila_mesa.limpar()
        for jogador in dados.get("mesa", []):
            self.fila_mesa.enfileirar(jogador)

    @classmethod
    def de_dicionario(cls, dados: Dict[str, Any]) -> 'TADPartida':
        """Cria e retorna uma nova instância de TADPartida carregada com os dados fornecidos."""
        partida = cls.__new__(cls)
        partida.placar = TADPlacar()
        partida.historico_rodadas = ListaEncadeada()
        partida.pilha_undo = Pilha()
        partida.pilha_redo = Pilha()
        partida.fila_mesa = FilaCircular()
        partida.carregar_de_dicionario(dados)
        return partida

