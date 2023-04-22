export type SetTileEvent = CustomEvent<{x: number, y: number, letter: string}>;

export type CellStatus = 'empty' | 'submitted' | 'placed';
export interface Cell {
    letter: string;
    status: CellStatus;
}