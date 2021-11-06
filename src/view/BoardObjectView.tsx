import styled from "styled-components";
import BoardObject from "../logic/BoardObject";

type PropsT = {
    boardObject: BoardObject;
};
export default function BoardObjectView({ boardObject }: PropsT) {
    const isOwnerTurn = boardObject?.boardNode?.board?.match?.turnOwner === boardObject?.owner;
    return (
        <Wrapper>
            <boardObject.sprite width='100%' height='100%' fill={boardObject.owner?.color || 'black'} opacity={isOwnerTurn ? 1 : '0.4'} />
        </Wrapper>
    );

}

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
`;