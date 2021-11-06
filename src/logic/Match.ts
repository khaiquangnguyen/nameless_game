import Board from "./Board";
import BoardObject from "./BoardObject";
import Character from "./playable_characters/Character";
import Player from "./Player";
import SelfPlayer from "./SelfPlayer";

export enum TurnPhaseE {
    MOVE = 'Move',
    ATK = 'Attack',
    END = 'End',
}

const nextPhases: { [k in TurnPhaseE]: TurnPhaseE[] } = {
    [TurnPhaseE.MOVE]: [TurnPhaseE.ATK, TurnPhaseE.END],
    [TurnPhaseE.ATK]: [TurnPhaseE.END],
    [TurnPhaseE.END]: [],
};

export default class Match {
    players: Player[] = [];
    turnOwner?: Player;
    board?: Board;
    turnPhase?: TurnPhaseE;
    turnCharater?: Character;


    addPlayer(player: Player) {
        this.players.push(player);
        return this;
    }

    startTurn(player: Player) {
        this.turnOwner = player;
        this.turnPhase = TurnPhaseE.MOVE;
        return this;
    }

    setBoard(board: Board) {
        this.board = board;
        this.board.setMatch(this);
        return this;
    }

    setTurnCharacter(char?: Character) {
        if (!char || char.owner === this.turnOwner) {
            this.turnCharater = char;
        }
    }

    toNextPhase(nextPhase: TurnPhaseE) {
        if (this.turnPhase) {
            const canGoToNextPhase = nextPhases[this.turnPhase].includes(nextPhase);
            if (canGoToNextPhase) {
                this.turnPhase = nextPhase;
            }
        }
        else {
            this.turnPhase = TurnPhaseE.MOVE;
        }
        if (this.turnPhase === TurnPhaseE.END) {
            this.toNextPlayer();
        }
    }

    toNextPlayer() {
        if (!this.turnOwner) {
            this.turnOwner = this.players[0];
        }
        const currentOwnerIndex = this.players.findIndex((player) => player === this.turnOwner);
        const nextOwnerIndex = (currentOwnerIndex + 1) % this.players.length;
        this.turnOwner = this.players[nextOwnerIndex];
        this.turnPhase = TurnPhaseE.MOVE;
        this.turnCharater = undefined;
    }

    isSelfTurn() {
        return this.turnOwner instanceof SelfPlayer;
    }

    isOtherTurn() {
        return !this.isSelfTurn();
    }

    isPhase(phase: TurnPhaseE) {
        return this.turnPhase === phase;
    }

    getNextPhases() {
        return this.turnPhase ? nextPhases[this.turnPhase] : [];
    }

    canPerformActionOn(object: BoardObject) {
        return object instanceof Character && object.owner === this.turnOwner;
    }
}

