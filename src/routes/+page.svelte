<script lang="ts">
    import ScrabbleCell from "../components/ScrabbleCell.svelte";
    import ScrabbleTile from "../components/ScrabbleTile.svelte";
    import Game from "../core/Game";
    import { bonuses } from '../core/Game';
    import { TILE_SIZE } from "../core/constants";

    let game = new Game();

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

    let tilePos: {x: number, y: number} | null;

    function validCellPosition(x: number, y: number) {
        return x >= 0 && x < 15 && y >= 0 && y < 15;
    }

    function moveTile(info: CustomEvent<{x: number, y: number} | null>) {
        if (info.detail === null) {
            tilePos = null;
        }
        else {
            const {x, y} = info.detail;
            if (validCellPosition(x, y) && game.board[y][x].status === 'empty')
                tilePos = {x, y};
            else
                tilePos = null;
        }
    }

    function setTile(x: number, y: number, letter: string) {
        if (validCellPosition(x, y) && (letter === '' || game.board[y][x].status === 'empty')) {
            game.board[y][x].letter = letter;
            game.board[y][x].status = letter === '' ? 'empty' : 'placed';
            return true;
        }
        return false;
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
            {#each row as a, j (i + "-" + j)}
                <ScrabbleCell cell={a} 
                        bonus={bonuses[i][j]} 
                        highlighted={tilePos != null && tilePos.x == j && tilePos.y == i}
                        position={{x: j, y: i}}
                        setTile={setTile}
                        moveTile={moveTile} />
            {/each}
        </div> 
    {/each}
</div>

{#each game.players as player}
    <div class="tiles row">
        {#each player.tiles as letter, i}
            {#if letter !== null}
                <ScrabbleTile tableInfo={tableInfo} letter={letter} isMovableTile={true} 
                    on:set_tile={(info) => { // info is a SetTileEvent
                        if (setTile(info.detail.x, info.detail.y, info.detail.letter)) {
                            // then remove this tile from the player's tiles
                            player.tiles[i] = null;
                        }
                    }}
                    on:move_tile={moveTile}/>
            {:else}
                <div style="
                    width: { TILE_SIZE }px;
                    height: { TILE_SIZE }px;
                "></div>
            {/if}
        {/each}
    </div>
{/each}

<button on:click={() => {
    if (game.submitWord()) {
        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 15; j++) {
                if (game.board[i][j].status === 'placed') {
                    game.board[i][j].status = 'submitted';
                }
            }
        }

        const player = game.players[game.playerTurn];
        for (let i = 0; i < player.tiles.length; i++) {
            if (player.tiles[i] == null) {
                player.tiles[i] = game.drawTile();
            }
        }

        
    }
}}>
    Submit
</button>