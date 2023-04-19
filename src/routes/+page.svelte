<script lang="ts">
    import ScrabbleCell from "../components/ScrabbleCell.svelte";
    import ScrabbleTile from "../components/ScrabbleTile.svelte";
    import Game from "../core/Game";
    import { bonuses } from '../core/Game';

    const game = new Game();

    game.addPlayer();
    game.addPlayer();

    let boardElement: HTMLDivElement;

    function getTableInfo() {
        if (boardElement) {
            const rect = boardElement.getBoundingClientRect()
            return {x: rect.x, y: rect.y};
        }
        return {x: 0, y: 0};
    }

    $: tableInfo = getTableInfo();

    function setTile(info: CustomEvent<{x: number, y: number, letter: string}>) {
        game.board[info.detail.y][info.detail.x] = info.detail.letter;
        
    }
</script>

<style>
    div.row {
        display: flex;
        flex-direction: row;
    }

    div.tiles {
        background-color: #D2B48C;
        width: fit-content;
        padding: 5px;
        border-radius: 3px;
        margin: 4px;
        justify-content: space-between;
        gap: 5px;
    }
</style>

<div bind:this={boardElement}>
    {#each game.board as row, i}
        <div class="row">
            {#each row as a, j}
                <ScrabbleCell letter={a} bonus={bonuses[i][j]} />
            {/each}
        </div> 
    {/each}
</div>

<div class="tiles row">
    {#each game.players[0].tiles as tile}
        <ScrabbleTile tableInfo={tableInfo} letter={tile} isBoardTile={false} on:update_board={setTile}/>
    {/each}
</div>