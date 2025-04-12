import Game from "./models/Game.mjs";

const STORAGE_NAME = "GameData";
function saveLocalStorage(gameObjects) {
    localStorage.setItem(STORAGE_NAME, gameObjects);
}

function retriveGamesFromLocalStorage() {
    return localStorage.getItem(STORAGE_NAME);
}

function outputJson(jsonstring) { 
    return JSON.parse(jsonstring);
}

function saveJSON(gameObjects) {
    saveToStorage(JSON.stringify(gameObjects));
}
