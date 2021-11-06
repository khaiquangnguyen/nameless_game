import { ReactComponent as PawnSprite } from '../../icons/pawn.svg';
import BoardNode from "../BoardNode";
import BoardObject from '../BoardObject';
import Character, { CharacterTypeE } from "./Character";
import createCharacterFromType from './createCharacterFromType';

export default class PawnCharacter extends Character {
    sprite = PawnSprite;
    dmg = 1;
    characterType = CharacterTypeE.DEFENDER;
    hp = 1;
    movementRange = 1;
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
                return (rowDistance <= this.movementRange) && (columnDistance <= this.movementRange);
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

    onKillTaret(target: BoardObject) {
        if (target instanceof Character) {
            // transform into that character
            const newForm = createCharacterFromType(target.characterType);
            newForm.owner = this.owner;
            this.getBoard()?.removeObject(this);
            newForm.isLeader = this.isLeader;
            this.getBoard()?.replaceObject(this, newForm);
        }
    }
}