import { useContext } from "react";
import styled from "styled-components";
import { BoardContext } from "../App";
import BoardObject from "../logic/BoardObject";
import Match from "../logic/Match";
import Character from "../logic/playable_characters/Character";

type PropsT = {
    object?: BoardObject;
    match: Match;
};
export default function ObjectInspectionView({ object, match }: PropsT) {
    const { refreshView } = useContext(BoardContext);

    const isCharacter = object instanceof Character;
    const hp = isCharacter &&
        <li>
            hp: {object.getHp()}
        </li>;

    const turn = (
        <li>
            turn: {match.turnOwner?.name}
        </li>
    );

    const phase = (
        <li>
            phase: {match.turnPhase}
        </li>
    );

    const character = (
        <li>
            character: {match.turnCharater?.characterType}
        </li>
    );
    return (
        <Conatainer>
            <h2> Inspection </h2>
            <ul>
                {hp}
                {turn}
                {phase}
                {character}
            </ul>
            {match.getNextPhases().map((phase) =>
                <button onClick={() => {
                    match.toNextPhase(phase);
                    refreshView();
                }}>
                    {phase}
                </button>
            )}

        </Conatainer>
    );
}

const Conatainer = styled.div`
    text-align: start;
    margin-left: 12px;
`;