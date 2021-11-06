import BoardNode from "./BoardNode";
import BoardObject from "./BoardObject";
import Match, { TurnPhaseE } from "./Match";
import Character from "./playable_characters/Character";
import AssasinCharacter from "./playable_characters/AssasinCharacter";

export default class Board {
    gridWidth = 8;
    gridHeight = 8;
    grid: BoardNode[][];
    match?: Match;
    objects: BoardObject[] = [];

    constructor(width: number, height: number) {
        this.gridWidth = width;
        this.gridHeight = height;
        this.grid = [];
        for (let y = 0; y < this.gridHeight; y++) {
            const row = [];
            for (let x = 0; x < this.gridWidth; x++) {
                row.push(new BoardNode(this));
            }
            this.grid.push(row);
        }
    }

    at(row: number, column: number) {
        return this.grid[row][column];
    }

    addObject(object: BoardObject, row: number, column: number) {
        if (row < this.gridHeight && column < this.gridWidth) {
            this.grid[row][column].updateChild(object);
            this.objects.push(object);
        }
    }

    setMatch(match: Match) {
        this.match = match;
    }

    moveToPosition(object: BoardObject, row: number, column: number) {
        const node = this.at(row, column);
        if (!node) return;
        this.moveToNode(object, node);
    }

    moveToNode(object: BoardObject, node: BoardNode) {
        if (node.child == null && object.canMoveToNode(node)) {
            if (object.boardNode) {
                object.boardNode.removeChild();
            }
            node.updateChild(object);
            return true;
        }
        return false;
    }

    moveBy(object: BoardObject, rowDistance: number, columnDistance: number) {
        const objectPos = object?.getPos();
        if (!objectPos) return;
        const { row, column } = objectPos;
        const newRow = Math.min(this.gridHeight - 1, Math.max(row - rowDistance, 0));
        const newColumn = Math.min(this.gridWidth - 1, Math.max(column - columnDistance));

        this.moveToPosition(object, newRow, newColumn);
    }

    removeObject(object: BoardObject) {
        object.boardNode?.removeChild();
        if (this.match?.turnCharater === object) {
            this.match.setTurnCharacter(undefined);
            this.objects.filter((o) => o !== object);
        }
    }

    replaceObject(oldObject: BoardObject, newObject: BoardObject) {
        const rowPos = oldObject?.getPos()?.row;
        const columnPos = oldObject?.getPos()?.column;
        if (rowPos == null || columnPos == null) return;
        this.removeObject(oldObject);
        this.addObject(newObject, rowPos, columnPos);
        if (this.match?.turnCharater === oldObject && newObject instanceof Character) {
            this.match.setTurnCharacter(newObject);
        }
    }

    findObject(object: BoardObject) {
        const grid = this.grid;
        for (let row = 0; row < this.gridHeight; row++) {
            for (let column = 0; column < this.gridWidth; column++) {
                if (grid[row][column].child === object) {
                    return {
                        row, column
                    };
                }
            }
        }
        return undefined;
    }

    findNode(node: BoardNode) {
        const grid = this.grid;
        for (let row = 0; row < this.gridHeight; row++) {
            for (let column = 0; column < this.gridWidth; column++) {
                if (grid[row][column] === node) {
                    return {
                        row, column
                    };
                }
            }
        }
        return undefined;
    }

    playerMoveCharacterToNode(attacker: Character, targetNode: BoardNode) {
        if (this.match?.canPerformActionOn(attacker) && this.match?.turnPhase === TurnPhaseE.MOVE) {
            //  if ninja, kill the other character straight up, trigger nothing
            if (attacker instanceof AssasinCharacter && targetNode.child instanceof Character) {
                targetNode.removeChild();
            }
            const moveSuccess = this.moveToNode(attacker, targetNode);
            if (moveSuccess) {
                this.match?.setTurnCharacter(attacker);
                if (attacker instanceof AssasinCharacter) {
                    this.match?.toNextPhase(TurnPhaseE.END);
                }
                else {
                    this.match?.toNextPhase(TurnPhaseE.ATK);
                }
            }
        }
    }

    characterAtk(attacker: Character, defender: BoardObject) {
        attacker.onAtkStart(defender);
        const dmg = attacker.computeDmg();
        if (defender instanceof Character) {
            defender.onTakingDamageStart(attacker);
            defender.takeDmg(dmg, attacker);
            attacker.onAtkEnd(defender);
            defender.onTakingDamageEnd(attacker);
        }
        this.match?.toNextPhase(TurnPhaseE.END);
    }
}

