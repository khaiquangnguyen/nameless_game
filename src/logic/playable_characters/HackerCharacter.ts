import { ReactComponent as SniperSprite } from '../../icons/crosshair.svg';
import BoardNode from "../BoardNode";
import BoardObject from '../BoardObject';
import Character, { CharacterTypeE } from "./Character";

export default class Hacker extends Character {
    sprite = SniperSprite;
    dmg = 1;
    characterType = CharacterTypeE.HACKER;
    hp = 3;
    movementRange = 3;
    atkRange = 2;

    getMovementNodes(): BoardNode[] {
        const position = this.boardNode?.getPos();
        const rowPos = position?.row;
        const columnPos = position?.column;
        if (rowPos == null || columnPos == null) return [];
        const movementNodes = (this.getBoard()?.grid.map((row, rowIndex) => {
            return row.filter((cell, columnIndex) => {
                const rowDistance = Math.abs(rowPos - rowIndex);
                const columnDistance = Math.abs(columnPos - columnIndex);
                const rowCondition = rowDistance <= this.movementRange;
                const columnCondition = columnDistance <= this.movementRange;
                return rowCondition || columnCondition;

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

    onAtkEnd(target: BoardObject) {
        const targetPos = target?.boardNode?.getPos();
        const selfPos = this.boardNode?.getPos();
        if (!targetPos || !selfPos) return;
        const { row: targetRowPos, column: targetColumnPos } = targetPos;
        const { row: selfRowPos, column: selfColumnPos } = selfPos;
        const atkVectorRow = selfRowPos - targetRowPos;
        const atkVectorColumn = selfColumnPos - targetColumnPos;
        const atkVectorRowUnitVector = atkVectorRow === 0 ? 0 : atkVectorRow / Math.abs(atkVectorRow);
        const atkVectorCOlumnUnitVector = atkVectorColumn === 0 ? 0 : atkVectorColumn / Math.abs(atkVectorColumn);
        this.getBoard()?.moveBy(target, atkVectorRowUnitVector, atkVectorCOlumnUnitVector);
        this.getBoard()?.moveBy(target, atkVectorRowUnitVector, atkVectorCOlumnUnitVector);

    }
}