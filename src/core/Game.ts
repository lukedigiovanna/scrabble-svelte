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
        // now validate the rules
        // 1. In a line (vertical or horizontal)
        // we can guarantee that the tiles are sorted from left to right and top to bottom
        // first check if it is horizontal
        let isHorizontal = true;
        // let word = "";
        for (let i = 0; i < placedTiles.length - 1; i++) {
            if (placedTiles[i].row !== placedTiles[i + 1].row || placedTiles[i].col !== placedTiles[i + 1].col - 1) {
                isHorizontal = false;
                break;
            }
        }
        
        return false;
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