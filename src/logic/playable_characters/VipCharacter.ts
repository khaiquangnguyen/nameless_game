import { ReactComponent as SniperSprite } from '../../icons/crosshair.svg';
import BoardNode from "../BoardNode";
import Character, { CharacterTypeE } from "./Character";

export default class VipCharacter extends Character {
    sprite = SniperSprite;
    dmg = 5;
    characterType = CharacterTypeE.VIP;
    hp = 10;

     movementRange = 5;
    atkRange = 1;

    getMovementNodes(): BoardNode[] {
        const position = this.boardNode?.getPos();
        const rowPos = position?.row;
        const columnPos = position?.column;
        if (rowPos == null || columnPos == null) return [];
        const movementNodes = (this.getBoard()?.grid.map((row, rowIndex) => {
            return row.filter((cell, columnIndex) => {
                const rowDistance = Math.abs(rowPos - rowIndex);
                const columnDistance = Math.abs(columnPos - columnIndex);
                const diagonalCondition = rowDistance === columnDistance && rowDistance <= this.movementRange;
                const rowCondition = rowDistance === 0 && columnDistance <= this.movementRange;
                const columnCondition = columnDistance === 0 && rowDistance <= this.movementRange;
                return diagonalCondition || rowCondition || columnCondition;

            });
        }).flat()) || [];
        return movementNodes;
    }

    getAimNodes(): BoardNode[] {
        // 
        const position = this.boardNode?.getPos();
        const rowPos = position?.row;
        const columnPos = position?.column;
        if (rowPos == null || columnPos == null) return [];
        const movementNodes = (this.getBoard()?.grid.map((row, rowIndex) => {
            return row.filter((cell, columnIndex) => {
                const rowDistance = Math.abs(rowPos - rowIndex);
                const columnDistance = Math.abs(columnPos - columnIndex);
                return (rowDistance <= this.atkRange) && (columnDistance <= this.atkRange);
            });
        }).flat()) || [];

        return movementNodes;
    }
    getHitNodes(aimNode: BoardNode): BoardNode[] {
        return [aimNode];
    }
}