import React, { useContext, useMemo, useState } from "react";
import styled from "styled-components";
import { BoardContext } from "../App";
import BoardNode from "../logic/BoardNode";
import { TurnPhaseE } from "../logic/Match";
import Character from "../logic/playable_characters/Character";
import AssasinCharacter from "../logic/playable_characters/AssasinCharacter";
import SelfPlayer from "../logic/SelfPlayer";
import BoardObjectView from "./BoardObjectView";

export enum NodeStateE {
    HOVER_HIGHLIGHT,
    MOVABLE_HIGHLIGHT,
    DROP_HIGHLIGHT,
    AIM_HIGHLIGHT,
    HIT_AREA_HIGHLIGHT,
}

type PropsT = {
    size: number,
    x: number,
    y: number,
    node: BoardNode;
    onMouseEnter: (node: BoardNode) => void;
    onMouseLeave: (node: BoardNode) => void;
    setObjectToInspect: (object: any) => void;
    state?: NodeStateE;
};

export default function NodeView({ size, x, y, node, onMouseEnter, onMouseLeave, setObjectToInspect, state }: PropsT) {
    const { refreshView } = useContext(BoardContext);

    const renderChildObject = node.child && <BoardObjectView boardObject={node.child} />;
    const [nodeLocalState, setNodeLocalState] = useState<NodeStateE | null>();

    const { background } = useMemo(() => {
        const nodeState = nodeLocalState || state;
        if (nodeState === NodeStateE.MOVABLE_HIGHLIGHT) {
            return { background: 'lightgray' };
        }
        if (nodeState === NodeStateE.AIM_HIGHLIGHT) {
            return { background: 'green' };
        }
        if (nodeState === NodeStateE.HIT_AREA_HIGHLIGHT) {
            return { color: 'red', background: 'red' };
        }
        if (nodeState === NodeStateE.HOVER_HIGHLIGHT) {
            return { color: 'red', background: 'blue' };
        }
        return { color: 'lightgray', background: 'transparent' };
    }, [nodeLocalState, state]);

    function onDrop(ev: React.DragEvent<HTMLDivElement>) {
        setNodeLocalState(null);
        ev.preventDefault();
        const characterId = ev.dataTransfer.getData('text',);
        const character = node.board.objects.find((object) => object.id === characterId);
        if (character && character instanceof Character && node.board.match?.canPerformActionOn(character)) {
            node.board.playerMoveCharacterToNode(character, node);
            onMouseLeave(node);
            refreshView();
        }
    }

    function onClick(e: React.MouseEvent<HTMLDivElement>) {
        setObjectToInspect(node.child);
        if (node.child && node.child instanceof Character) {
            if (node.board.match?.turnCharater && node.board.match.isPhase(TurnPhaseE.ATK)) {
                node.board.characterAtk(node.board.match?.turnCharater, node.child);
                refreshView();
            }
            else {
                node?.board?.match?.setTurnCharacter(node.child);
            }
        }
    }

    function onMouseDown(e: React.MouseEvent<HTMLDivElement>) {
        setObjectToInspect(node.child);
        if (node.child && node.board.match && node.child instanceof Character) {
            node.board.match.setTurnCharacter(node.child);
        }
    }
    return (
        <StyledNode
            draggable={false}
            size={size}
            x={x} y={y}
            onMouseEnter={() => onMouseEnter(node)}
            onMouseLeave={() => onMouseLeave(node)}
            onClick={onClick}
            onMouseDown={onMouseDown}
        >
            <NodeContentContainer
                draggable={node.child?.draggable}
                onDrop={onDrop}
                onDragStart={(ev) => {
                    // ev.preventDefault();
                    if (node.child?.draggable) ev.dataTransfer.setData('text', node.child?.id);
                }
                }
                onDragOver={(ev) => ev.preventDefault()}
                onDragEnter={(ev) => {
                    setNodeLocalState(NodeStateE.DROP_HIGHLIGHT);
                }}
                onDragLeave={(ev) => {
                    setNodeLocalState(null);
                }}
                background={background}
            >
                {renderChildObject}
            </NodeContentContainer>
        </StyledNode>
    );
}

const StyledNode = styled.div<{ size: number, x: number, y: number; }>`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    width: ${({ size }) => size}px;
    height: ${({ size }) => size}px;
    left: ${({ x, size }) => x * size}px;
    top: ${({ y, size }) => y * size}px;
    padding: 0.25em;
    box-sizing: border-box;
`;

const NodeContentContainer = styled.div<{ background: string; }>`
    border: 1px solid lightgray;
    background-color: ${({ background }) => background};
    border-radius: 4px;
    width: 100%;
    height: 100%;
`;