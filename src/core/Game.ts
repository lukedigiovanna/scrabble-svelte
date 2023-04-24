import { hasWord } from "./dictionary";
import type { Cell } from "./types";

export const tileValues: {[key: string]: number;} = {
    "A": 1,
    "B": 3,
    "C": 3,
    "D": 2,
    "E": 1,
    "F": 4,
    "G": 2,
    "H": 4,
    "I": 1,
    "J": 8,
    "K": 5,
    "L": 1,
    "M": 3,
    "N": 1,
    "O": 1,
    "P": 3,
    "Q": 10,
    "R": 1,
    "S": 1,
    "T": 1,
    "U": 1,
    "V": 4,
    "W": 4,
    "X": 8,
    "Y": 4,
    "Z": 10
}

export const letterFrequencies = [
  { letter: 'A', frequency: 9 },
  { letter: 'B', frequency: 2 },
  { letter: 'C', frequency: 2 },
  { letter: 'D', frequency: 4 },
  { letter: 'E', frequency: 12 },
  { letter: 'F', frequency: 2 },
  { letter: 'G', frequency: 3 },
  { letter: 'H', frequency: 2 },
  { letter: 'I', frequency: 9 },
  { letter: 'J', frequency: 1 },
  { letter: 'K', frequency: 1 },
  { letter: 'L', frequency: 4 },
  { letter: 'M', frequency: 2 },
  { letter: 'N', frequency: 6 },
  { letter: 'O', frequency: 8 },
  { letter: 'P', frequency: 2 },
  { letter: 'Q', frequency: 1 },
  { letter: 'R', frequency: 6 },
  { letter: 'S', frequency: 4 },
  { letter: 'T', frequency: 6 },
  { letter: 'U', frequency: 4 },
  { letter: 'V', frequency: 2 },
  { letter: 'W', frequency: 2 },
  { letter: 'X', frequency: 1 },
  { letter: 'Y', frequency: 2 },
  { letter: 'Z', frequency: 1 },
];

function fillScrabbleLetters(): string[] {
  const letters: string[] = [];

  for (const { letter, frequency } of letterFrequencies) {
    for (let i = 0; i < frequency; i++) {
      letters.push(letter);
    }
  }

  return letters;
}

function generateBoard(): Cell[][] {
    const table: Cell[][] = [];
    for (let i = 0; i < 15; i++) {
        const row: Cell[] = [];
        for (let j = 0; j < 15; j++) {
            row.push({letter: "", status: "empty"});
        }
        table.push(row);
    }
    return table;
}

export interface Player {
    tiles: (string|null)[];
    score: number;
}

export const bonuses = [  
    ['TW', '', '', 'DL', '', '', '', 'TW', '', '', '', 'DL', '', '', 'TW'],
    ['', 'DW', '', '', '', 'TL', '', '', '', 'TL', '', '', '', 'DW', ''],
    ['', '', 'DW', '', '', '', 'DL', '', 'DL', '', '', '', 'DW', '', ''],
    ['DL', '', '', 'DW', '', '', '', 'DL', '', '', '', 'DW', '', '', 'DL'],
    ['', '', '', '', 'DW', '', '', '', '', '', 'DW', '', '', '', ''],
    ['', 'TL', '', '', '', 'TL', '', '', '', 'TL', '', '', '', 'TL', ''],
    ['', '', 'DL', '', '', '', 'DL', '', 'DL', '', '', '', 'DL', '', ''],
    ['TW', '', '', 'DL', '', '', '', 'ST', '', '', '', 'DL', '', '', 'TW'],
    ['', '', 'DL', '', '', '', 'DL', '', 'DL', '', '', '', 'DL', '', ''],
    ['', 'TL', '', '', '', 'TL', '', '', '', 'TL', '', '', '', 'TL', ''],
    ['', '', '', '', 'DW', '', '', '', '', '', 'DW', '', '', '', ''],
    ['DL', '', '', 'DW', '', '', '', 'DL', '', '', '', 'DW', '', '', 'DL'],
    ['', '', 'DW', '', '', '', 'DL', '', 'DL', '', '', '', 'DW', '', ''],
    ['', 'DW', '', '', '', 'TL', '', '', '', 'TL', '', '', '', 'DW', ''],
    ['TW', '', '', 'DL', '', '', '', 'TW', '', '', '', 'DL', '', '', 'TW']
];

// number of tiles per player
const NUM_TILES = 7;

export default class Game {
    tileBag: string[];
    board: Cell[][];
    players: Player[];
    playerTurn: number;

    constructor() {
        this.tileBag = fillScrabbleLetters();
        this.board = generateBoard();
        this.players = [];
        this.playerTurn = 0;
    }
    
    submitWord(): boolean {
        // Need to validate the list of things
        // 1. In a line (vertical or horizontal)
        // 2. Validate all tiles are connected.
        // 3. Validate letter in the middle
        // 4. Validate all words are in the dictionary

        // first collect all the tiles that were placed and then validate the rules on them
        const placedTiles: any[] = [];
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                if (this.board[i][j].status === "placed") {
                    placedTiles.push({...this.board[i][j], row: i, col: j});
                }
            }
        }

        // first check there is a tile in the center
        let hasCenter = true;
        let makesCenter = false;
        if (this.board[7][7].status !== 'submitted') {
            hasCenter = false;
            // then make sure one of the tiles is on the center
            for (let i = 0; i < placedTiles.length; i++) {
                if (placedTiles[i].row === 7 && placedTiles[i].col === 7) {
                    hasCenter = true;
                    makesCenter = true;
                    break;
                }
            }
        }

        if (!hasCenter) {
            return false;
        }

        // now validate the rules
        
        let isValidPosition = true;
        // validate horizontal
        let orientation = 'horizontal';
        for (let i = 0; i < placedTiles.length - 1; i++) {
            if (placedTiles[i].row !== placedTiles[i + 1].row || placedTiles[i].col !== placedTiles[i + 1].col - 1) {
                isValidPosition = false;
                orientation = 'vertical';
                break;
            }
        }

        // validate vertical
        if (!isValidPosition) { // then check vertical
            isValidPosition = true;
            for (let i = 0; i < placedTiles.length - 1; i++) {
                if (placedTiles[i].col !== placedTiles[i + 1].col || placedTiles[i].row !== placedTiles[i + 1].row - 1) {
                    isValidPosition = false;
                    break;
                }
            }
        }

        // if the tiles aren't in a valid arrangement, then give up
        if (!isValidPosition) {
            return false;
        }

        let isAdjacent = makesCenter;
        if (!isAdjacent) {
            // then check each tile and see if it is adjacent 
            for (let i = 0; i < placedTiles.length; i++) {
                const {row, col} = placedTiles[i];
                // check top
                if (row > 0 && this.board[row - 1][col].status === 'submitted') isAdjacent = true;
                if (row < 14 && this.board[row + 1][col].status === 'submitted') isAdjacent = true;
                if (col > 0 && this.board[row][col - 1].status === 'submitted') isAdjacent = true;
                if (col < 14 && this.board[row][col + 1].status === 'submitted') isAdjacent = true;
                if (isAdjacent) {
                    break; // no need to continue testing.
                }
            }
        }

        if (!isAdjacent) {
            return false;
        }

        // now determine the words that were formed.
        let words: string[] = [];
        if (orientation === 'vertical') {
            let word = "";
            let row = placedTiles[0].row - 1;
            let col = placedTiles[0].col;
            // collect up
            while (row >= 0 && this.board[row][col].status === 'submitted') {
                word = this.board[row][col].letter + word;
                row--;
            }
            // collect the placed letters
            for (let i = 0; i < placedTiles.length; i++) {
                word += placedTiles[i].letter;
            }
            row = placedTiles[placedTiles.length - 1].row + 1;
            // collect down
            while (row <= 14 && this.board[row][col].status === 'submitted') {
                word = this.board[row][col].letter + word;
                row++;
            }
            words.push(word);

            // now collect any horizontal words.
            for (let i = 0; i < placedTiles.length; i++) {
                word = "";
                // collect left
                col = placedTiles[i].col - 1;
                row = placedTiles[i].row;
                while (col >= 0 && this.board[row][col].status === 'submitted') {
                    word = this.board[row][col].letter + word;
                    col--;
                }
                // collect letter
                word += placedTiles[i].letter;
                col = placedTiles[i].col + 1;
                // collect right
                while (col <= 14 && this.board[row][col].status === 'submitted') {
                    word += this.board[row][col].letter;
                    col++;
                }
                if (word.length > 1)
                    words.push(word);
            }   
        }
        else {
            let word = "";
            let row = placedTiles[0].row;
            let col = placedTiles[0].col - 1;
            // collect left
            while (col >= 0 && this.board[row][col].status === 'submitted') {
                word = this.board[row][col].letter + word;
                col--;
            }
            // collect the placed letters
            for (let i = 0; i < placedTiles.length; i++) {
                word += placedTiles[i].letter;
            }
            col = placedTiles[placedTiles.length - 1].col + 1;
            // collect down
            while (col <= 14 && this.board[row][col].status === 'submitted') {
                word = this.board[row][col].letter + word;
                col++;
            }
            words.push(word);

            // now collect any horizontal words.
            for (let i = 0; i < placedTiles.length; i++) {
                word = "";
                // collect up
                col = placedTiles[i].col;
                row = placedTiles[i].row - 1;
                while (row >= 0 && this.board[row][col].status === 'submitted') {
                    word = this.board[row][col].letter + word;
                    row--;
                }
                // collect letter
                word += placedTiles[i].letter;
                row = placedTiles[i].row + 1;
                // collect right
                while (row <= 14 && this.board[row][col].status === 'submitted') {
                    word += this.board[row][col].letter;
                    row++;
                }
                if (word.length > 1)
                    words.push(word);
            }   
        }

        console.log(words);

        if (words.length === 0) {
            return false;
        }

        for (let i = 0; i < words.length; i++) {
            if (!hasWord(words[i])) {
                return false;
            }
        }

        return true;
    }

    // draws a random tile from the bag and removes it from the bag
    drawTile(): string {
        const idx = Math.floor(Math.random() * this.tileBag.length);
        const tile = this.tileBag[idx];
        this.tileBag.splice(idx, 1);
        return tile;
    }

    // Adds a player to the game and gives them tiles.
    addPlayer(): Player {
        const newPlayer: Player = {
            score: 0,
            tiles: []
        };

        for (let i = 0; i < NUM_TILES; i++) {
            newPlayer.tiles.push(this.drawTile());
        }

        this.players.push(newPlayer);

        return newPlayer;
    }
}