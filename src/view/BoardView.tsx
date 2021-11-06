import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import Board from "../logic/Board";
import BoardNode from "../logic/BoardNode";
import { TurnPhaseE } from "../logic/Match";
import Character from "../logic/playable_characters/Character";
import SelfPlayer from "../logic/SelfPlayer";
import NodeView, { NodeStateE } from "./NodeView";

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}

function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
}


type PropsT = {
    board: Board;
    setObjectToInspect: (object: any) => void;
};

export default function BoardView({ board, setObjectToInspect }: PropsT) {
    const { height, width } = useWindowDimensions();
    const maxCellWidth = Math.floor((width - 200) / board.gridWidth);
    const maxCellHeight = Math.floor(height / board.gridHeight);
    const cellSize = Math.round(Math.min(maxCellHeight, maxCellWidth) * 0.85);
    const boardWidth = cellSize * board.gridWidth;
    const boardHeight = cellSize * board.gridHeight;
    const [movementHighlightNodes, setMovementHighlightNodes] = useState<BoardNode[]>([]);
    const [aimHighlightNodes, setAimHighlightNodes] = useState<BoardNode[]>([]);
    const [targetHighlightNodes, setTargetHighlightNodes] = useState<BoardNode[]>([]);
    const match = board.match;
    const phase = match?.turnPhase;
    const turnCharacter = match?.turnCharater;

    React.useEffect(() => {
        if (phase === TurnPhaseE.ATK && turnCharacter) {
            setAimHighlightNodes(turnCharacter.getAimNodes());
        }
    }, [match, phase, turnCharacter]);

    function onMouseEnter(node: BoardNode) {
        // other turns or our move turn
        if (phase === TurnPhaseE.MOVE || !match?.isSelfTurn()) {
            if (node.child instanceof Character) {
                // highlight movement nodes
                const movementNodes = node.child?.getMovementNodes();
                setMovementHighlightNodes(movementNodes);
            }
        }
        // atk turn
        if (phase === TurnPhaseE.ATK && match?.isSelfTurn()) {
            if (turnCharacter?.getAimNodes().includes(node)) {
                setTargetHighlightNodes(turnCharacter.getHitNodes(node));
            }
        }
    };

    function onMouseLeave(node: BoardNode) {
        if (node.child instanceof Character) {
            setMovementHighlightNodes([]);
        }
    };
    const getNodeState = React.useCallback((node: BoardNode) => {
        if (match?.turnPhase === TurnPhaseE.MOVE) {
            if (movementHighlightNodes.includes(node)) {
                return NodeStateE.MOVABLE_HIGHLIGHT;
            }
        }
        if (match?.turnPhase === TurnPhaseE.ATK) {
            if (targetHighlightNodes.includes(node)) {
                return NodeStateE.HIT_AREA_HIGHLIGHT;
            }
            else if (aimHighlightNodes.includes(node)) {
                return NodeStateE.AIM_HIGHLIGHT;
            }
            return undefined;

        }
    }, [aimHighlightNodes, match, movementHighlightNodes, targetHighlightNodes]);

    const renderNodes = () => {
        return board.grid.map((row, rowIndex) => {
            return row.map((node, columnIndex) => (
                <NodeView
                    key={`${rowIndex},${columnIndex}`}
                    size={cellSize}
                    x={columnIndex}
                    y={rowIndex}
                    node={node}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    setObjectToInspect={setObjectToInspect}
                    state={getNodeState(node)}
                />
            ));
        });
    };

    return (
        <StyledBoard width={boardWidth} height={boardHeight}>
            {renderNodes()}
        </StyledBoard>
    );
}


const StyledBoard = styled.div<{ width: number, height: number; }>`
    width: ${({ width }) => width}px;
    height: ${({ height }) => height}px;
    border: 1px solid gray;
    position: relative;
`;