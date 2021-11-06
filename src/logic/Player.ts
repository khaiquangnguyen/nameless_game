import { CharacterTypeE } from "./playable_characters/Character";

export default class Player {
    name: string;
    characters: CharacterTypeE[] = [];
    color: string;

    constructor(name: string, color: string) {
        this.name = name;
        this.color = color;
    }

    addCharacter(character: CharacterTypeE) {
        this.characters.push(character);
    }
}