import { ReactComponent as NinjaSprite } from '../../icons/katana.svg';
import BoardNode from "../BoardNode";
import Character, { CharacterTypeE } from "./Character";
export default class AssasinCharacter extends Character {
    sprite = NinjaSprite;
    dmg = Infinity;
    characterType = CharacterTypeE.ASSASIN;
    hp = 1;
    atkRange = 0;
    movementRange = Infinity;

    getMovementNodes(): BoardNode[] {
        // ninja can move vertical and horizontal
        const position = this.boardNode?.getPos();
        const rowPos = position?.row;
        const columnPos = position?.column;
        if (rowPos == null || columnPos == null) return [];
        const diagonalNodes = (this.getBoard()?.grid.map((row, rowIndex) => {
            return row.filter((cell, columnIndex) => Math.abs(rowPos - rowIndex) === Math.abs(columnPos - columnIndex));
        }).flat()) || [];
        return diagonalNodes;
    }

    getAimNodes(): BoardNode[] {
        return this.boardNode ? [this.boardNode] : [];
    }

    getHitNodes(aimNode: BoardNode): BoardNode[] {
        return aimNode ? [aimNode] : [];
    }

}