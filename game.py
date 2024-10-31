import numpy as np
import random

# Constantes pour les joueurs et le statut de la case
EMPTY = 0
PLAYER_X = 1
PLAYER_O = -1
FULL = 0

# Initialiser le plateau
board = np.zeros((3, 3), dtype=int)

# Fonctions du jeu
def get_actions(board):
    """Retourne les positions libres pour effectuer un mouvement"""
    return [(i, j) for i in range(3) for j in range(3) if board[i, j] == EMPTY]

def play_move(board, player, move):
    """Effectue un mouvement pour un joueur donné sur une position spécifique"""
    i, j = move
    if board[i, j] == EMPTY:
        board[i, j] = player
    else:
        print("!!! tentative d'écrire sur une case occupée !!!")

def check_winner(board):
    """Vérifie s'il y a un gagnant ou si le plateau est plein"""
    for ligne in board:
        if np.all(ligne == PLAYER_X): return PLAYER_X
        if np.all(ligne == PLAYER_O): return PLAYER_O
    for col in board.T:
        if np.all(col == PLAYER_X): return PLAYER_X
        if np.all(col == PLAYER_O): return PLAYER_O
    if np.all(np.diag(board) == PLAYER_X): return PLAYER_X
    if np.all(np.diag(board) == PLAYER_O): return PLAYER_O
    if np.all(np.diag(np.fliplr(board)) == PLAYER_X): return PLAYER_X
    if np.all(np.diag(np.fliplr(board)) == PLAYER_O): return PLAYER_O
    if not np.any(board == EMPTY): return FULL
    return None

def evaluation(board):
    """Fonction d'évaluation pour le joueur X ou O"""
    def count_open_lines(board, player):
        lines = 0
        for row in board:
            if np.all((row == player) | (row == EMPTY)):
                lines += 1
        for col in board.T:
            if np.all((col == player) | (col == EMPTY)):
                lines += 1
        if np.all((np.diag(board) == player) | (np.diag(board) == EMPTY)):
            lines += 1
        if np.all((np.diag(np.fliplr(board)) == player) | (np.diag(np.fliplr(board)) == EMPTY)):
            lines += 1
        return lines
    score_max = count_open_lines(board, PLAYER_X)
    score_min = count_open_lines(board, PLAYER_O)
    return score_max - score_min

def minimax(board, depth, is_player_X_turn, alpha, beta):
    """Minimax avec élagage alpha-bêta pour optimiser les mouvements"""
    winner = check_winner(board)
    if winner == PLAYER_X:
        return 10
    elif winner == PLAYER_O:
        return -10
    elif winner == FULL:
        return 0
    if depth == 0:
        return evaluation(board)

    if is_player_X_turn:
        best_score = -float('inf')
        for move in get_actions(board):
            play_move(board, PLAYER_X, move)
            score = minimax(board, depth - 1, False, alpha, beta)
            board[move[0], move[1]] = EMPTY
            best_score = max(score, best_score)
            alpha = max(alpha, score)
            if alpha >= beta:
                break
        return best_score
    else:
        best_score = float('inf')
        for move in get_actions(board):
            play_move(board, PLAYER_O, move)
            score = minimax(board, depth - 1, True, alpha, beta)
            board[move[0], move[1]] = EMPTY
            best_score = min(score, best_score)
            beta = min(beta, score)
            if alpha >= beta:
                break
        return best_score

def best_move(board, player):
    """Trouve le meilleur coup pour le joueur donné en utilisant minimax"""
    best_score = -float('inf') if player == PLAYER_X else float('inf')
    move = None
    for action in get_actions(board):
        play_move(board, player, action)
        score = minimax(board, 3, player == PLAYER_X, -float('inf'), float('inf'))
        board[action[0], action[1]] = EMPTY
        if (player == PLAYER_X and score > best_score) or (player == PLAYER_O and score < best_score):
            best_score = score
            move = action
    return move

def playerO(board):
    """Joueur O (IA) utilise la fonction best_move pour choisir le coup"""
    return best_move(board, PLAYER_O)

def playerX(board):
    """Joueur X (IA) utilise la fonction best_move pour choisir le coup"""
    return best_move(board, PLAYER_X)

def tic_tac_toe():
    """Fonction principale du jeu Tic Tac Toe"""
    global board
    current_player = PLAYER_X
    while True:
        winner = check_winner(board)
        if winner is not None:
            if winner == FULL:
                return "Match nul !"
            else:
                return f"Le joueur {'X' if winner == PLAYER_X else 'O'} a gagné !"

        if current_player == PLAYER_X:
            move = playerX(board)
            play_move(board, PLAYER_X, move)
            current_player = PLAYER_O
        else:
            move = playerO(board)
            play_move(board, PLAYER_O, move)
            current_player = PLAYER_X
