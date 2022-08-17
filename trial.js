// async function loadAllPokemon() {
//     for (let i = 1; i < 899; i++) {
//         let url = `https://pokeapi.co/api/v2/pokemon-species/${i}/`;
//         let response = await fetch(url);
//         let thisPokemon = await response.json();
//         if (i < 494) {
//             newPokemon.push(thisPokemon.names[5].name);
//         } else if (i >= 494) {
//             newPokemon.push(thisPokemon.names[4].name);
//         }
//     }
// }

// async function loadAllTypes() {
//     for (let i = 1; i < 19; i++) {
//         let url = `https://pokeapi.co/api/v2/type/${i}/`
//         let response = await fetch(url);
//         let thisType = await response.json();
//         types.push(thisType.names[4].name);
//     }
// }


// async function renderPokemonName(i) {
//     let pokemonCard = document.getElementById('pokemonList');
//     let currentspecies = await loadPokemonSpeciesAPI(i);
//     germanName = nameDecision(currentspecies);
//     pokemonCard.innerHTML += templatePokemonInfo(i, germanName);
// }

// function nameDecision(obj) {
//     let germanName;
//     for (let j = 0; j < obj.names.length; j++) {
//         const element = obj.names[j];
//         if (element.language.name == 'de') {
//             germanName = obj.names[j].name;
//         };
//     }
//     return germanName;
// }