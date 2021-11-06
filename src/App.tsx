import React, { useCallback } from 'react';
import styled from 'styled-components';
import Board from './logic/Board';
import BoardObject from './logic/BoardObject';
import EnemyPlayer from './logic/EnemyPlayer';
import Match from './logic/Match';
import AssasinCharacter from './logic/playable_characters/AssasinCharacter';
import DefenderCharacter from './logic/playable_characters/DefenderCharacter';
import PawnCharacter from './logic/playable_characters/PawnCharacter';
import SniperCharacter from './logic/playable_characters/SniperCharacter';
import SelfPlayer from './logic/SelfPlayer';
import BoardView from './view/BoardView';
import ObjectInspectionView from './view/ObjectInspectionView';

const player = new SelfPlayer('khai', 'blue');
const enemyPlayer = new EnemyPlayer('enemy', 'red');

const match = new Match();
const board = new Board(14, 11);

match.setBoard(board)
  .addPlayer(player)
  .addPlayer(enemyPlayer)
  .startTurn(player);

const ninja = new AssasinCharacter().setOwner(player);
const sniper = new SniperCharacter().setOwner(player);
const puncher = new DefenderCharacter().setOwner(player);
const pawn = new PawnCharacter().setOwner(player);

const enemyNinja = new AssasinCharacter().setOwner(enemyPlayer);
const enemySniper = new SniperCharacter().setOwner(enemyPlayer);


board.addObject(ninja, 9, 5);
board.addObject(sniper, 9, 3);
board.addObject(puncher, 8, 3);
board.addObject(pawn, 7, 3);
board.addObject(enemyNinja, 0, 5);
board.addObject(enemySniper, 0, 3);

type BoardContextT = {
  refreshView: () => void;
};

export const BoardContext = React.createContext<BoardContextT>({
  refreshView: () => { }
});

function App() {
  const [, setRefreshState] = React.useState(true);

  const [objectToInspect, setObjectToInspect] = React.useState<BoardObject>();
  const refreshView = useCallback(
    () => {
      setRefreshState((prev) => !prev);
    },
    [],
  );
  return (
    <BoardContext.Provider value={{ refreshView }}>
      <Game>
        <BoardView board={board} setObjectToInspect={setObjectToInspect} />
        <ObjectInspectionView object={objectToInspect} match={match} />
      </Game>
    </BoardContext.Provider>
  );
}

export default App;

const Game = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: whitesmoke;
  padding: 4em;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;
