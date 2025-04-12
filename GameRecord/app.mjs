import Game from "./models/Game.mjs";

const STORAGE_NAME = "GameData";
let games = retrieveAllGames()

function retrieveAllGames() {
    let listOfRetrievedGames = outputJson(retrieveGamesFromLocalStorage()||"[]");
    let result = [];

    for(let i=0;i<listOfRetrievedGames.length;i++) {
        let entry = listOfRetrievedGames[i];
        result.push(new Game(
            entry.title,
            entry.designer,
            entry.artist,
            entry.publisher, 
            entry.year,
            entry.players,
            entry.time,
            entry.difficulty,
            entry.url,
            entry.playCount,
            entry.personalRating
        ));
    }
    return result;
}

function saveLocalStorage(gameObjects) {
    localStorage.setItem(STORAGE_NAME, gameObjects);
}

function retrieveGamesFromLocalStorage() {
    return localStorage.getItem(STORAGE_NAME);
}

function outputJson(jsonstring) { 
    return JSON.parse(jsonstring);
}

function saveJSON(gameObjects) {
    saveToStorage(JSON.stringify(gameObjects));
}

document.getElementById("importSource").onchange = function(event) {
    let file = event.target.files[0]; 
    const reader = new FileReader();
    reader.onload = (evt) => {
    saveLocalStorage(evt.target.result);
    };
    reader.readAsText(file);
}; 