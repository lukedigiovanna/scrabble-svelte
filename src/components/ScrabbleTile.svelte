<script lang="ts">
    import Game, { tileValues } from "../core/Game";
    import { CELL_SIZE } from "../core/constants";
    export let letter: string;
    export let isBoardTile: boolean;
    export let tableInfo: {x: number, y: number} = {x: 0, y: 0};

    import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

    $: cursor = isBoardTile ? "default" : "grab";

    let isGrabbing = false;
    let mousePos = {x: 0, y: 0};
    let translation = {x: 0, y: 0};

    function handleMouseDown(event: any) {
        if (!isBoardTile) {
            // then we do whatever to whatever.
            cursor = "grabbing";
            isGrabbing = true;
            mousePos = {x: event.clientX, y: event.clientY};
            translation = {x: 0, y: 0};

            document.addEventListener("mouseup", handleMouseRelease);
            document.addEventListener("mousemove", handleMouseMove);
        }
    }

    function handleMouseMove(event: any) {
        if (isGrabbing) {
            // Calculate the new position of the Tile based on the mouse movement
            const deltaX = event.clientX - mousePos.x;
            const deltaY = event.clientY - mousePos.y;
            mousePos = {x: event.clientX, y: event.clientY};
            translation.x += deltaX;
            translation.y += deltaY;
        }
    }

    function handleMouseRelease(event: any) {
        if (!isBoardTile) {
            // then we do whatever to whatever.
            cursor = "grab";

            translation = {x: 0, y: 0};

            mousePos = { x: event.clientX, y: event.clientY };
            const offset = { x: mousePos.x - tableInfo.x, y: mousePos.y - tableInfo.y };
            const boardPos = { x: Math.floor(offset.x / CELL_SIZE), y: Math.floor(offset.y / CELL_SIZE)};

            dispatch('update_board', {...boardPos, letter});

            // game.board[boardPos.y][boardPos.x] = letter;
            // console.log(boardPos, letter);
            // console.log(game.board);

            isGrabbing = false;
            document.removeEventListener("mouseup", handleMouseRelease);
            document.removeEventListener("mousemove", handleMouseMove);
        }
    }
</script>

<div class="tile center" style="
    cursor: {cursor}; 
    transform: translate({translation.x}px, {translation.y}px);
    width: { CELL_SIZE * 0.85 }px; height: { CELL_SIZE * 0.85 }px;" 
        on:mousedown={handleMouseDown}>
    <p class="letter">
        {letter}
    </p>
    <span class="tile-value">
        {tileValues[letter]}
    </span>
</div>

<style>
    p {
        margin: 0;
        padding: 0;
        font-size: 24px;
        font-weight: bold;
    }
    .tile {
        background-color: #fff;
        border-radius: 4px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: Arial, Helvetica, sans-serif;
        user-select: none;
    }
    .tile-value {
        position: absolute;
        right: 1px;
        bottom: 1px;
        font-size: 10px;
        font-weight: bold;
    }
</style>
