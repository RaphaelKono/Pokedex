let loadedPokemon = 12;
let currentPokemon = [];
let currentSpecies = [];
let currentEvo = [];
let isLoading = false;
let femalesign = '<img src="assets/img/female-24.png">';
let malesign = '<img src="assets/img/male-3-24.png"></img>';
let doubleDMG = [];
let halfDMG = [];
let noDMG = [];
let quadrupleDMG = [];
let quarterDMG = [];
let thisPokeType = '';
let isDetailLoading = false;

// --------------------Search-Functions -------------------------------------

//Pre-Filter Pokemon in input-field
function filterPokemon() {
    let search = document.getElementById('search').value;
    search = search.toLowerCase();
    let list = document.getElementById('list');
    list.innerHTML = '';
    if (search.length > 1)
        showOptions(search, list);
}

function showOptions(search, list) {
    allPokemonNames.forEach(name => showOptionValue(name, search, list));
}

function showOptionValue(name, search, list) {
    if (name.toLowerCase().includes(search))
        list.innerHTML += `<option value="${name}">`;
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && !isNaN(n - 0);
}

async function searchPokemon() {
    loadedPokemon = 12;
    isLoading = true;
    resetForSearch();
    let search = document.getElementById('search').value;
    search = convertToID(capitalizeFirstLetter(search));
    await loadPokemonAPI(search);
    pushIntoArray(search);
    document.getElementById('pokemonList').innerHTML += templatePokemonInfo(search);
    renderPokemonType(search, 'pokemonType');
    closeDetails();
}

function resetForSearch() {
    document.getElementById('loadButton').classList.add('d-none');
    document.getElementById('pokemonList').innerHTML = '';
}

function convertToID(search) {
    if (!isNumber(search))
        search = allPokemonNames.indexOf(search) + 1;
    return search;
}


function pushIntoArray(i) {
    allPokemon.splice(i - 1, 1, currentPokemon);
}



// ------------------------------------------------------------

// ---------------------Render list of pokemon--------------------------
function init() {
    document.getElementById('pokemonList').innerHTML = '';
    renderPokemon();
    loadEventListener();
}


function loadEventListener() {
    let input1 = document.getElementById('search');
    input1.addEventListener("keypress", listenToEnterKey);
}

function listenToEnterKey() {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("searchbtn").click();
    }
}


async function renderMorePokemon() {
    document.getElementById('loadButton').classList.add('d-none');
    await renderPokemon();
    window.onscroll = async function(ev) {
        if (isScrollEnd())
            await loadMorePokemon();;
    };
}

function isScrollEnd() {
    return (window.innerHeight + window.scrollY) >= document.body.offsetHeight && !isLoading;
}

async function loadMorePokemon() {
    isLoading = true;
    document.getElementById('loadingScreen').classList.remove('d-none');
    await renderPokemon();
    document.getElementById('loadingScreen').classList.add('d-none');
    isLoading = false;
}


async function renderPokemon() {
    for (let i = loadedPokemon - 11; i <= loadedPokemon; i++) {
        if (i < 899) {
            await loadPokemonAPI(i);
            pushIntoArray(i);
            document.getElementById('pokemonList').innerHTML += templatePokemonInfo(i, allPokemonNames[currentPokemon.id - 1]);
            const precursor = 'pokemonType';
            renderPokemonType(i, precursor);
        }
    }
    loadedPokemon = loadedPokemon + 12;
}

// ----------------------------------------------

// ----------General render-Functions-----------


function renderPokemonType(i, idPrecursor) {
    let currentType = allPokemon[i - 1].types;
    let htmlElem;
    htmlElem = decisionType(i, idPrecursor);
    for (let j = 0; j < currentType.length; j++) {
        const typeArr = currentType[j].type.name;
        htmlElem.innerHTML += templatePokemonType(i, j, poketypes[typeArr], idPrecursor);
        document.getElementById(`${idPrecursor}${i}${j}`).classList.add(typeArr);
    }
}


function decisionType(i, idPrecursor) {
    let typesElem;
    if (idPrecursor === 'pokemonType') {
        typesElem = document.getElementById(`types${i}`);
    } else {
        typesElem = document.getElementById('pokeDetailTypes');
        typesElem.innerHTML = '';
    }
    return typesElem;
}


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


function normalizeID(id) {
    id = '000' + id;
    id = id.substring(id.length - 3, id.length);
    return id;
}

function numberWithCommas(x) {
    return x.toString().replace(/\./g, ',');
}


function nameDecision(obj) {
    let germanName;
    for (let j = 0; j < obj.names.length; j++) {
        const element = obj.names[j];
        if (element.language.name == 'de') {
            germanName = obj.names[j].name;
        };
    }
    return germanName;
}


function loadGen(x, y) {
    loadedPokemon = x;
    init();
    document.getElementById('whatGeneration').innerHTML = y;
    if (document.getElementById('loadButton').classList.value.includes('d-none') == true) {
        document.getElementById('loadButton').classList.remove('d-none');
    }

}