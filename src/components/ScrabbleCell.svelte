<script lang="ts">
    import type Game from "../core/Game";
    import ScrabbleTile from "./ScrabbleTile.svelte";
    import { CELL_SIZE } from "../core/constants";

    export let letter: string;
    export let bonus: string;

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

    $: backgroundColor = colors[bonus];
</script>

<div class="cell center" style="background-color: {backgroundColor}; width: {CELL_SIZE - 2}px; height: {CELL_SIZE - 2}px;">
    {#if letter.length > 0}
    <ScrabbleTile letter={letter} isBoardTile={true} />
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