import { nanoid } from "nanoid";
import { FunctionComponent, SVGProps } from "react";
import BoardNode from "./BoardNode";
import Player from "./Player";

type BoardNodeT = BoardNode;
export default abstract class BoardObject {
    boardNode?: BoardNodeT;
    protected hp = Infinity;
    abstract sprite: FunctionComponent<SVGProps<SVGSVGElement> & { title?: string | undefined; }>;
    owner?: Player;
    id = nanoid();
    draggable = false;

    canMoveToNode(node: BoardNode) {
        return true;
    }

    getBoard() {
        return this.boardNode?.board;
    }

    setOwner(owner?: Player) {
        this.owner = owner;
        return this
    }

    getPos(){
        return this.boardNode?.getPos();
    }

}