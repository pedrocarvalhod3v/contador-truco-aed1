"""
Interface de Linha de Comando (CLI) Interativa - Contador de Truco (AED1)
Permite testar visualmente no terminal todas as operações de TADs, Undo/Redo e Pontuação.
"""

import sys
import os

# Adiciona diretório raiz ao PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from python.game.partida import TADPartida
from python.game.regras import RegrasTruco
from python.db.repositorio import RepositorioPartida


def limpar_tela():
    os.system('cls' if os.name == 'nt' else 'clear')


def exibir_interface(partida: TADPartida, repo: RepositorioPartida):
    placar = partida.placar
    mesa = partida.obter_mesa()
    mao = partida.obter_mao()
    distribuidor = partida.obter_distribuidor()
    
    print("=" * 64)
    print(" 🃏 CONTADOR DE TRUCO — ESTRUTURAS DE DADOS I (AED1 + SQLite) 🃏 ")
    print("=" * 64)
    print(f" Partida: Rodada #{partida.numero_rodada}  | Início: {partida.data_inicio[:19].replace('T', ' ')}")
    print(f" Vitórias Acumuladas: [{placar.nome_equipe_a}: {placar.vitorias_a}] x [{placar.nome_equipe_b}: {placar.vitorias_b}]")
    print("-" * 64)
    print(f"  [1] {placar.nome_equipe_a:^16}  vs  [2] {placar.nome_equipe_b:^16}")
    print(f"       >>> {placar.pontos_a:2d} <<<                >>> {placar.pontos_b:2d} <<<")
    print("-" * 64)
    
    # Status especiais
    em_11, eq = RegrasTruco.verificar_mao_de_11(placar.pontos_a, placar.pontos_b)
    if em_11:
        if eq == "AMBAS":
            print(" ⚠️  MÃO DE FERRO! (11 x 11) — Jogo às escuras!")
        else:
            nome_11 = placar.nome_equipe_a if eq == "A" else placar.nome_equipe_b
            print(f" ⚠️  MÃO DE 11 para {nome_11}! (Proibido pedir truco)")
            
    if placar.tem_vencedor():
        print(f" 🏆 PARTIDA ENCERRADA! VENCEDOR: {placar.obter_vencedor()} (Salvo no BD SQLite) 🏆")

    print("-" * 64)
    print(" 🔄 GESTÃO DA MESA (TAD Fila Circular):")
    print(f"   • Mão da Rodada (Frente da Fila): {mao}")
    print(f"   • Distribuidor / Dá as Cartas:   {distribuidor}")
    print(f"   • Ordem da Mesa: {' -> '.join(mesa)}")
    print("-" * 64)
    print(f" ⏪ Pilha de Undo (LIFO): {partida.pilha_undo.tamanho()} estados salvos")
    print(f" ⏩ Pilha de Redo (LIFO): {partida.pilha_redo.tamanho()} estados para recuperar")
    print(f" 📜 TAD Lista (Histórico): {partida.historico_rodadas.tamanho()} rodadas nesta queda")
    print(f" 🗄️  Banco SQLite (truco.db): {'[Jogo Salvo Disponível]' if repo.existe_jogo_salvo() else '[Sem jogo pendente]'}")
    print("=" * 64)
    print(" PONTUAÇÃO: [1] +1 Mão  | [3] +3 Truco  | [6] +6 Seis  | [9] +9  | [12] +12")
    print(" AÇÕES TAD: [U] Desfazer (Undo) | [R] Refazer (Redo) | [H] Histórico Mãos")
    print(" BANCO DADOS: [S] Salvar Jogo  | [C] Carregar Jogo  | [B] Consultar BD SQLite")
    print(" CONFIG:    [E] Alterar Nomes das Equipes | [P] Nova Partida | [Q] Sair")
    print("=" * 64)



def exibir_menu_banco(repo: RepositorioPartida):
    """Exibe o painel de histórico de partidas e estatísticas do SQLite."""
    while True:
        limpar_tela()
        print("=" * 64)
        print(" 🗄️  BANCO DE DADOS RELACIONAL SQLITE — ESTATÍSTICAS & HISTÓRICO ")
        print("=" * 64)
        
        stats = repo.obter_estatisticas_gerais()
        print(f" Total de Partidas Concluídas: {stats['total_partidas']}")
        print(f" Total de Rodadas/Mãos Registradas: {stats['total_rodadas']}")
        print(f" Média de Rodadas por Partida: {stats['media_rodadas_por_partida']}")
        print("-" * 64)
        print(" 🏆 RANKING DE VITÓRIAS POR EQUIPE:")
        if not stats["ranking_vencedores"]:
            print("   (Nenhuma partida concluída no banco ainda)")
        else:
            for rank, r in enumerate(stats["ranking_vencedores"], 1):
                print(f"   #{rank} {r['vencedor']}: {r['vitorias']} vitória(s)")

        print("-" * 64)
        print(" 📜 ÚLTIMAS PARTIDAS REGISTRADAS:")
        partidas = repo.listar_partidas(limite=5)
        if not partidas:
            print("   (Nenhuma partida salva no histórico)")
        else:
            for p in partidas:
                data = p['data_inicio'][:16].replace('T', ' ') if p['data_inicio'] else 'N/D'
                print(f"   • Partida #{p['id']} ({data}): {p['equipe_a']} {p['pontos_a']} x {p['pontos_b']} {p['equipe_b']} -> Vencedor: {p['vencedor']} ({p['total_rodadas']} mãos)")

        print("=" * 64)
        print(" [D] Detalhes de uma Partida com Rodadas | [V] Voltar ao Jogo")
        print("=" * 64)
        op = input("Escolha uma opção: ").strip().upper()

        if op == 'V':
            break
        elif op == 'D':
            p_id_str = input("Digite o ID da partida para ver as rodadas: ").strip()
            if p_id_str.isdigit():
                p_id = int(p_id_str)
                detalhes = repo.obter_partida_com_rodadas(p_id)
                if not detalhes:
                    input("Partida não encontrada! Pressione Enter...")
                else:
                    print(f"\n--- DETALHES DA PARTIDA #{p_id} ---")
                    print(f"Equipes: {detalhes['equipe_a']} vs {detalhes['equipe_b']} | Vencedor: {detalhes['vencedor']}")
                    print(f"Placar Final: {detalhes['pontos_a']} x {detalhes['pontos_b']} em {detalhes['total_rodadas']} mãos")
                    print("\nTrilha de Rodadas (TAD Lista):")
                    for r in detalhes.get("rodadas", []):
                        print(f"  • Mão #{r['numero_rodada']}: {r['equipe']} +{r['pontos_ganhos']} pts -> Placar: {r['placar_apos']} (Mão: {r['mao']})")
                    input("\nPressione Enter para voltar ao menu do banco...")


def main():
    repo = RepositorioPartida()
    partida = TADPartida("NÓS", "ELES", ["Jogador 1 (Nós)", "Jogador 2 (Eles)", "Jogador 3 (Nós)", "Jogador 4 (Eles)"])
    partida_ja_salva_no_bd = False

    while True:
        limpar_tela()
        exibir_interface(partida, repo)
        opcao = input("\nEscolha uma opção: ").strip().upper()

        if opcao == 'Q':
            print("Encerrando o programa. Até a próxima partida de truco!")
            break

        # Pontuação via dígitos ou atalhos
        elif opcao in ['1', '3', '6', '9', '12', 'A', 'T', 'S', 'N', 'D']:
            # Se for a tecla 'S', verifica se o usuário pretendia Salvar ou +6 Seis
            if opcao == 'S' and not ('6' in opcao):
                # 'S' agora salva o jogo no banco!
                repo.salvar_estado_em_andamento(partida)
                input("\n💾 Jogo salvo com sucesso no Banco de Dados SQLite! Pressione Enter...")
                continue

            if partida.placar.tem_vencedor():
                input("A partida já encerrou! Pressione [P] para nova partida. Enter para continuar...")
                continue

            valores_map = {'1': 1, '3': 3, '6': 6, '9': 9, '12': 12, 'A': 1, 'T': 3, 'N': 9, 'D': 12}
            valor = valores_map.get(opcao, 1)
            
            eq = input(f"Quem ganhou os +{valor} pontos? [1] {partida.placar.nome_equipe_a} | [2] {partida.placar.nome_equipe_b}: ").strip()
            if eq == '1':
                partida.pontuar('A', valor)
            elif eq == '2':
                partida.pontuar('B', valor)
            else:
                input("Opção de equipe inválida! Pressione Enter...")
                continue

            # Auto-salva no SQLite se a partida acabou de ser vencida
            if partida.placar.tem_vencedor() and not partida_ja_salva_no_bd:
                repo.salvar_partida_finalizada(partida)
                partida_ja_salva_no_bd = True

        elif opcao == 'U':
            if not partida.desfazer():
                input("Nada a desfazer! Pressione Enter...")

        elif opcao == 'R':
            if not partida.refazer():
                input("Nada a refazer! Pressione Enter...")

        elif opcao == 'H':
            print("\n--- HISTÓRICO DE RODADAS (TAD LISTA) ---")
            rodadas = partida.historico_rodadas.para_lista()
            if not rodadas:
                print("Nenhuma rodada registrada ainda.")
            else:
                for r in rodadas:
                    print(f"Rodada #{r['numero']}: {r['equipe']} +{r['pontos_ganhos']} pts | Placar: {r['placar_apos']} | Mão: {r['mao']}")
            input("\nPressione Enter para voltar...")

        elif opcao == 'P':
            partida.nova_partida()
            partida_ja_salva_no_bd = False

        elif opcao == 'C':
            if not repo.existe_jogo_salvo():
                input("\n⚠️ Nenhum jogo salvo encontrado no banco! Pressione Enter...")
            else:
                partida_carregada = repo.carregar_estado_em_andamento()
                if partida_carregada:
                    partida = partida_carregada
                    partida_ja_salva_no_bd = partida.placar.tem_vencedor()
                    input("\n📂 Partida carregada com sucesso do Banco SQLite! Pressione Enter...")
                else:
                    input("\nErro ao restaurar jogo salvo. Pressione Enter...")

        elif opcao == 'E':
            print("\n--- PERSONALIZAÇÃO DE EQUIPES ---")
            novo_a = input(f"Novo nome para Equipe A [{partida.placar.nome_equipe_a}]: ").strip()
            novo_b = input(f"Novo nome para Equipe B [{partida.placar.nome_equipe_b}]: ").strip()
            
            if novo_a:
                partida.placar.nome_equipe_a = novo_a
            if novo_b:
                partida.placar.nome_equipe_b = novo_b

            # Atualiza mesa mantendo a ordem atual
            partida.fila_mesa.limpar()
            partida.fila_mesa.enfileirar(f"Jogador 1 ({partida.placar.nome_equipe_a})")
            partida.fila_mesa.enfileirar(f"Jogador 2 ({partida.placar.nome_equipe_b})")
            partida.fila_mesa.enfileirar(f"Jogador 3 ({partida.placar.nome_equipe_a})")
            partida.fila_mesa.enfileirar(f"Jogador 4 ({partida.placar.nome_equipe_b})")
            input("\n✅ Nomes das equipes atualizados com sucesso! Pressione Enter...")

        elif opcao == 'B':
            exibir_menu_banco(repo)



if __name__ == "__main__":
    main()

