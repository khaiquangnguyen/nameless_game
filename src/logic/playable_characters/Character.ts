import BoardNode from "../BoardNode";
import BoardObject from "../BoardObject";
import SelfPlayer from "../SelfPlayer";

export default abstract class Character extends BoardObject {
    protected abstract dmg: number;
    protected abstract hp: number;
    abstract getMovementNodes(): BoardNode[];
    abstract getAimNodes(): BoardNode[];
    abstract getHitNodes(aimNode: BoardNode): BoardNode[];
    isLeader = false;

    abstract characterType: CharacterTypeE;
    draggable = true;

    onAtkEnd(target: BoardObject) {
    }

    onAtkStart(target: BoardObject) {

    }

    onTakingDamageStart(attacker: BoardObject) {

    }

    onTakingDamageEnd(attacker: BoardObject) {

    }

    onTakeDmg(dmg: number) {
        this.hp -= dmg;
    }

    onDeath() {
    }

    onKillTaret(target: BoardObject) {

    }

    takeDmg(dmg: number, attacker: Character) {
        this.onTakeDmg(dmg);
        if (this.hp <= 0) {
            this.onDeath();
            attacker?.onKillTaret(this);
            this.getBoard()?.removeObject(this);
        }
    }

    canMoveToNode(node: BoardNode) {
        return this.getMovementNodes().includes(node);
    }

    computeDmg() {
        return this.dmg;
    }

    ownBySelf() {
        return this.owner instanceof SelfPlayer;
    }

    getHp() {
        return this.hp;
    }

    getDamage(target: BoardObject){
        return this.dmg
    }


}

export enum CharacterTypeE {
    ASSASIN = 'Cyber Ninja',
    SNIPER = 'Sniper',
    DEFENDER = 'Doomfist',
    PAWN = 'Pawn',
    QUEEN = 'Queen',
    HACKER = 'Hacker',
    VIP = 'Vip'

};