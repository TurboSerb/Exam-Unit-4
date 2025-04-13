import Game from "./Models/Game.mjs";

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
    retrieveAllGames();
    visuals();
    };
    reader.readAsText(file);
}; 

function visuals() { 
    let htmlBuffer = "";
    for(let i=0;i<games.length;i++) {
htmlBuffer += `<div class="gameEntry">${htmlEntry(i)}</div>`;
    }
    document.getElementById("display").innerHTML = htmlBuffer;
}

function createHTML(index, fieldName, fieldValue) {
    let fieldType = "text";
    return `<label>${fieldName}</label><input type="${fieldType}" data-name="${fieldName}" value ="${fieldValue}" data-index="${index}" />`;
}

function htmlEntry(index) {
    let gameEntry = games[index];
let fieldNames = Object.keys(gameEntry);
let buffer = "";
for(let i =0;i<fieldNames.length;i++) {
    buffer += createHTML(index, fieldNames[i], gameEntry[fieldNames[i]]);
}
return buffer;
}
