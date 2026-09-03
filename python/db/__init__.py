"""
Módulo de Banco de Dados e Persistência - Contador de Truco (AED1)
Gerencia conexão SQLite, tabelas relacionais e repositório de partidas.
"""

from python.db.database import DatabaseManager
from python.db.repositorio import RepositorioPartida

__all__ = ["DatabaseManager", "RepositorioPartida"]
