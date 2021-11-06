import { ReactComponent as PunchSprite } from '../../icons/punch.svg';
import BoardNode from "../BoardNode";
import BoardObject from '../BoardObject';
import Character, { CharacterTypeE } from "./Character";

export default class DenfenderCharacter extends Character {
    sprite = PunchSprite;
    dmg = 2;
    characterType = CharacterTypeE.DEFENDER;
    hp = 4;
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
                const rowCondition = rowDistance === 0 && columnDistance <= this.movementRange * 2;
                const columnCondition = columnDistance === 0 && rowDistance <= this.movementRange;
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