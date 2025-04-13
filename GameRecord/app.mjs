import Game from "./Models/Game.mjs";

const STORAGE_NAME = "GameData";
let games = retrieveAllGames();
visuals();

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

function outputJson(input) {
    if (typeof input === "string") {
        try {
            return JSON.parse(input);
        } catch (err) {
            console.error("Invalid JSON string:", input);
            return [];
        }
    } else if (Array.isArray(input)) {
        return input;
    } else if (input === null || input === undefined) {
        return [];
    } else {
        return [input]; 
    }
}


function saveJSON(gameObjects) {
    saveLocalStorage(JSON.stringify(gameObjects));
}

document.getElementById("importSource").onchange = function (event) {
    let file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
        try {
            const rawData = JSON.parse(evt.target.result);
            games = rawData.map(entry => new Game(
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
            saveJSON(games);
            visuals();
        } catch (err) {
            alert("Failed to import JSON: " + err.message);
        }
    };
    reader.readAsText(file);
};

function visuals() {
    let htmlBuffer = "";
    for (let i = 0; i < games.length; i++) {
        htmlBuffer += `<div class="gameEntry">${htmlEntry(i)}<br><button data-index="${i}">Delete</button></div>`;
    }
    document.getElementById("display").innerHTML = htmlBuffer;
    attachInputListeners();
}

function createHTML(index, fieldName, fieldValue) {
    if (fieldName === "personalRating") {
        return `
            <label>${fieldName}: <span id="rating-value-${index}">${fieldValue}</span></label>
            <input type="range" min="0" max="10" step="1"
                value="${fieldValue}"
                data-name="${fieldName}"
                data-index="${index}"
                class="editable-field slider" />
            <br/>
        `;
    }

    let fieldType = typeof fieldValue === "number" ? "number" : "text";
    return `<label>${fieldName}</label>
            <input type="${fieldType}" data-name="${fieldName}" value="${fieldValue}" data-index="${index}" class="editable-field" />
            <br/>`;
}     

function htmlEntry(index) {
    let gameEntry = games[index];
    let fieldNames = Object.keys(gameEntry);
    let buffer = `<h3>${gameEntry.title}</h3>`;
    for (let i = 0; i < fieldNames.length; i++) {
        buffer += createHTML(index, fieldNames[i], gameEntry[fieldNames[i]]);
    }
    return buffer;
}

function attachInputListeners() {
    document.querySelectorAll(".editable-field").forEach(input => {
        input.addEventListener("input", function(e) {
            const index = parseInt(e.target.dataset.index);
            const key = e.target.dataset.name;
            let value = e.target.value;
            if (["playCount", "personalRating", "year"].includes(key)) {
                value = parseInt(value);
            }
            games[index][key] = value;
            if (key === "personalRating") {
                document.getElementById(`rating-value-${index}`).innerText = value;
            }
            saveJSON(games);
        });
    });
    document.querySelectorAll("#display button").forEach(deleteButton => {
        deleteButton.addEventListener("click", function(e) {
            const index = parseInt(e.target.dataset.index);
            if(index>-1 && index<games.length) {
                let modifiedGames = [];
                for(let i=0;i<games.length;i++) {
                    if(i!==index) {
                        modifiedGames.push(games[i]);
                    }
                }
                games = modifiedGames;
                saveJSON(games);
                visuals();
            }
        })
    });
}

document.getElementById("addGame").addEventListener("click", function() {
    let gameEntry = new Game(
        document.getElementById("title").value,
        document.getElementById("designer").value,
        document.getElementById("artist").value,
        document.getElementById("publisher").value,
        document.getElementById("year").value,
        document.getElementById("players").value,
        document.getElementById("time").value,
        document.getElementById("difficulty").value,
        document.getElementById("url").value,
        document.getElementById("playCount").value,
        document.getElementById("personalRating").value
    );
    games.push(gameEntry);
    saveJSON(games);
    visuals();
});

document.getElementById("sortingPlayers").onclick = function() {
    sortGamesList("players");
    visuals();
};
document.getElementById("sortRating").onclick = function() {
    sortGamesList("personalRating");
    visuals();
};
document.getElementById("sortingDifficulty").onclick = function() {
    sortGamesList("difficulty");
    visuals();
};
document.getElementById("sortPlayCount").onclick = function() {
    sortGamesList("playCount");
    visuals();
};


function sortGamesList(name) {
    games.sort(function(a, b) {
        if(a[name]<b[name]) {
            return -1;
		} else {
            return 1;
		}
    });
}