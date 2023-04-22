<script lang="ts">
    import ScrabbleTile from "./ScrabbleTile.svelte";
    import { CELL_SIZE } from "../core/constants";

    export let letter: string;
    export let bonus: string;
    export let highlighted: boolean = false;
    export let position: {x: number, y: number};
    export let moveTile: (...args: any[]) => void;
    export let setTile: (...args: any[]) => void;

    const names: {[key: string]: string;} = {
        "DL": "DOUBLE LETTER SCORE",
        "TL": "TRIPLE LETTER SCORE",
        "DW": "DOUBLE WORD SCORE",
        "TW": "TRIPLE WORD SCORE"
    };

    const colors: { [key: string]: string } = {
        "DL": "#FDEBD0", // light peach
        "TL": "#FADBD8", // light coral
        "DW": "#D6EAF8", // light blue
        "TW": "#F5B7B1", // light salmon
        "ST": "#D2B48C",
        "": "#F5DEB3"
    };
</script>

<div class="cell center" style="
    background-color: {colors[bonus]}; 
    width: {CELL_SIZE - 2}px; 
    height: {CELL_SIZE - 2}px;
    border-color: {highlighted ? "#444" : "black"};
    opacity: {highlighted ? "0.6" : "1.0"}">
    {#if letter.length > 0}
        <ScrabbleTile letter={letter} isMovableTile={true}
            on:move_tile={moveTile}
            on:set_tile={(info) => {
                setTile(position.x, position.y, "");
                setTile(info.detail.x, info.detail.y, info.detail.letter);
            }} />
    {:else if bonus === "ST"}
        <p class="start-text">
            ★
        </p>
    {:else if bonus.length > 0}
        <p class="bonus-text">
            {names[bonus]}
        </p>
    {/if}
</div>

<style>
    .cell {
        border: 1px solid black;
        background-color: #F5DEB3;
        font-family: Arial, Helvetica, sans-serif;
        user-select: none;
        transition: 0.3s ease-in-out;
    }
    .bonus-text {
        text-align: center;
        font-size: 7px;
        font-weight: bold;
    }
    .start-text {
        text-align: center;
        font-weight: bold;
        font-size: 22px;
    }
    .center {
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>