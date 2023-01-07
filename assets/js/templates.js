function templatePokemonInfo(i) {
    return `
    <div id="pokemon${currentPokemon.id}" onclick="initDetails(${currentPokemon.id})" class="card">
        <img src="${currentPokemon.sprites.other['official-artwork'].front_default}" class="card-img">
        <div class="card-body">
            <span>#${normalizeID(currentPokemon.id)}</span>
            <p class="card-text"><b>${allPokemonNames[currentPokemon.id - 1]}</b></p>
        </div>
        <div class="poke-types card-body" id="types${i}"></div>
    </div>
    `;
}

function templatePokemonType(i, j, germanType, idPrecursor) {
    return `
    <div id="${idPrecursor}${i}${j}" class="pokemon-type">
    ${(germanType)}
    </div>
    `;
}

function templateEvolution1Info(info1, germanName) {
    return `
    <div class="d-flex flex-column align-items-center justify-content-center certain-width">
        <img src="${info1.sprites.other['official-artwork'].front_default}" class="card-small-img-top" onclick="initDetails(${info1.id})">
        <h4>${germanName} <span class="gray"> Nr. #${normalizeID(info1.id)}</span></h4>
    </div>`;
}

function templateEvolution2Info(x, y, info1) {
    return `
    <div id="evo${info1}" class="d-flex align-items-center justify-content-center justForMedia">
        <div class="d-flex flex-column align-items-center justify-content-center justForMediaChild">
            ${x}
            <h6>${y}</h6>
            <img src="assets/img/arrow-18-64.png" class="evoarrow">
        </div>
    </div>
    `
}

function renderLocationEvo(htmlElement, englishName) {
    let param1 = '',
        param2;
    param2 = 'Bei der Steinskulptur im Sandturmkessel (Naturzone in der Galar-Region) mit mind. 49 KP Schaden (durch Gegner verursacht)';
    htmlElement.innerHTML += templateEvolution2Info(param1, param2, englishName);
}

function renderCriticalHitsEvo(htmlElement, englishName) {
    let param1 = '',
        param2;
    param2 = 'Drei Volltreffer in einem Kampf';
    htmlElement.innerHTML += templateEvolution2Info(param1, param2, englishName);
}

function renderTowerofWatersEvo(htmlElement) {
    let param1 = '',
        param2;
    param2 = 'Training im Turm des Wassers';
    htmlElement.innerHTML += templateEvolution2Info(param1, param2, 'urshifu1');
    document.getElementById('evourshifu1').innerHTML += '<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10191.png" class="card-img-top">';
}

function renderTowerofDarknessEvo(htmlElement) {
    let param1 = '',
        param2;
    param2 = 'Training im Turm des Unlichts';
    htmlElement.innerHTML += templateEvolution2Info(param1, param2, 'urshifu');
}

function renderSpinEvo(htmlElement) {
    let param1 = '',
        param2;
    param2 = 'Zuckeritem und Kontrollstick drehen';
    htmlElement.innerHTML += templateEvolution2Info(param1, param2, 'alcremie');
}

function renderShedEvo(htmlElement, englishName) {
    let param1 = '',
        param2;
    param2 = 'Platz im Team und ein Pokeball';
    htmlElement.innerHTML += templateEvolution2Info(param1, param2, englishName);
}

async function renderTradeEvo(evoDetailArr, htmlElement, englishName) {
    let param1 = await heldItem(evoDetailArr);
    let param2 = `Tausch`;
    htmlElement.innerHTML += templateEvolution2Info(param1, param2, englishName);
}

async function renderTriggerItemEvo(evoDetailArr, htmlElement, englishName) {
    let currentItem = await loadItemAPI(evoDetailArr[2][1].url);
    let param1 = `<img src=${currentItem.sprites.default}>`;
    let param2 = '';
    htmlElement.innerHTML += templateEvolution2Info(param1, param2, englishName);
}

function renderFriendshipEvo(evoDetailArr, htmlElement, englishName) {
    let param2 = isDayOrNight(evoDetailArr);
    let param1 = '<img src="assets/img/rare-candy.png">' + `<div class="d-flex"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/soothe-bell.png"><h6> > ${evoDetailArr[8][1]}</h6></div>`;
    htmlElement.innerHTML += templateEvolution2Info(param1, param2, englishName);
}

async function renderHoldItemEvo(evoDetailArr, htmlElement, englishName) {
    let param1 = await heldItem(evoDetailArr);
    let param2 = isDayOrNight(evoDetailArr);
    htmlElement.innerHTML += templateEvolution2Info(param1, param2, englishName);
}

async function renderknownMoveEvo(evoDetailArr, htmlElement, englishName) {
    let moveName = await loadMove(evoDetailArr[3][1].name);
    moveName = nameDecision(moveName);
    let param1 = '<img src="assets//img/rare-candy.png">'
    let param2 = 'Kennt ' + moveName;
    htmlElement.innerHTML += templateEvolution2Info(param1, param2, englishName);
}

async function renderPartyMemberEvo(evoDetailArr, htmlElement, englishName) {
    let partyMemb = await loadPokemonAPI(evoDetailArr[11][1].name);
    let param1 = '<img src="assets/img/rare-candy.png">';
    let param2 = `<img src="${partyMemb.sprites.front_default}">`;
    htmlElement.innerHTML += templateEvolution2Info(param1, param2, englishName);
}

function renderSimpleLvlUpEvo(evoDetailArr, htmlElement, englishName) {
    let param1 = '<img src="assets/img/rare-candy.png">';
    let param2 = 'Lvl. ' + evoDetailArr[9][1];
    htmlElement.innerHTML += templateEvolution2Info(param1, param2, englishName);
}



function isDayOrNight(newarr) {
    if (newarr[14][1] == 'day') {
        param2 = 'am Tag';
    } else if (newarr[14][1] == 'night') {
        param2 = 'in der Nacht';
    } else {
        param2 = '';
    }
    return param2;
}

async function heldItem(newarr) {
    param1 = '';
    if (newarr[1][1]) {
        currentItem = await loadItemAPI(newarr[1][1].url);
        param1 = `<img src=${currentItem.sprites.default}>`;
    }
    return param1;
}