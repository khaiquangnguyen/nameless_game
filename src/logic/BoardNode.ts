import { nanoid } from "nanoid";
import Board from "./Board";
import BoardObject from "./BoardObject";

export default class BoardNode {
    board: Board;
    child?: BoardObject;
    id = nanoid();

    constructor(board: Board) {
        this.board = board;
    }

    updateChild(el: Exclude<typeof this.child, null | undefined>) {
        this.child = el;
        el.boardNode = this;
    }

    removeChild() {
        this.child = undefined;
    }

    getPos() {
        const grid = this.board.grid;
        for (let row = 0; row < this.board.gridHeight; row++) {
            for (let column = 0; column < this.board.gridWidth; column++) {
                if (grid[row][column] === this) {
                    return {
                        row, column
                    };
                }
            }
        }
        return null;
    }
}