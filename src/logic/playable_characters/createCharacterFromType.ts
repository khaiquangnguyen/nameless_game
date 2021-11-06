import AssasinCharacter from "./AssasinCharacter";
import { CharacterTypeE } from "./Character";
import DefenderCharacter from "./DefenderCharacter";
import HackerCharacter from "./HackerCharacter";
import PawnCharacter from "./PawnCharacter";
import QueenCharacter from "./QueenCharacter";
import SniperCharacter from "./SniperCharacter";
import VipCharacter from "./VipCharacter";

export default function createCharacterFromType(type: CharacterTypeE) {
    const map = {
        [CharacterTypeE.ASSASIN]: new AssasinCharacter(),
        [CharacterTypeE.SNIPER]: new SniperCharacter(),
        [CharacterTypeE.DEFENDER]: new DefenderCharacter(),
        [CharacterTypeE.PAWN]: new PawnCharacter(),
        [CharacterTypeE.QUEEN]: new QueenCharacter(),
        [CharacterTypeE.HACKER]: new HackerCharacter(),
        [CharacterTypeE.VIP]: new VipCharacter(),


    };
    return map[type];
}