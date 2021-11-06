import { ReactComponent as SniperSprite } from '../../icons/crosshair.svg';
import BoardNode from "../BoardNode";
import Character, { CharacterTypeE } from "./Character";

export default class SniperCharacter extends Character {
    sprite = SniperSprite;
    dmg = 2;
    characterType = CharacterTypeE.SNIPER;
    hp = 1;
    movementRange = 2;
    atkRange = Infinity;

    getMovementNodes(): BoardNode[] {
        const position = this.boardNode?.getPos();
        const rowPos = position?.row;
        const columnPos = position?.column;
        if (rowPos == null || columnPos == null) return [];
        const movementNodes = (this.getBoard()?.grid.map((row, rowIndex) => {
            return row.filter((cell, columnIndex) => {
                const rowDistance = Math.abs(rowPos - rowIndex);
                const columnDistance = Math.abs(columnPos - columnIndex);
                const rowCondition = rowDistance === 0 && columnDistance <= this.movementRange;
                const columnCondition = columnDistance === 0 && rowDistance <= this.movementRange;
                return rowCondition || columnCondition;

            });
        }).flat()) || [];
        return movementNodes;
    }

    getAimNodes(): BoardNode[] {
        // ninja can move vertical and horizontal
        const position = this.boardNode?.getPos();
        const rowPos = position?.row;
        const columnPos = position?.column;
        if (rowPos == null || columnPos == null) return [];
        const rowNodes = this.getBoard()?.grid[rowPos] || [];
        const columnNodes = this.getBoard()?.grid.map((row) => row[columnPos]) || [];
        const diagonalNodes = (this.getBoard()?.grid.map((row, rowIndex) => {
            return row.filter((cell, columnIndex) => Math.abs(rowPos - rowIndex) === Math.abs(columnPos - columnIndex));
        }).flat()) || [];

        return [...rowNodes, ...columnNodes, ...diagonalNodes];
    }
    getHitNodes(aimNode: BoardNode): BoardNode[] {
        return [aimNode];
    }
}