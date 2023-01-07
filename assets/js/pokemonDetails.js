async function initDetails(x) {
    if (isDetailLoading == false) {
        isDetailLoading = true;
        resetPokeType();
        window.scrollTo(0, 0);
        await loadPokemonAPI(x);
        allPokemon.splice(x - 1, 1, currentPokemon);
        await loadPokemonSpeciesAPI(x);
        allSpecies.splice(x - 1, 1, currentSpecies);
        renderScaffold(x);
        renderTopCardDetails(x);
        await renderInfo(x);
        isDetailLoading = false;
    }
}

function renderScaffold(x) {
    document.getElementById('pokedexList').classList.add('d-none');
    document.getElementById('evolutionID').classList.add('d-none');
    document.getElementById('pokemonDetails').classList.remove('d-none');
    document.getElementById('pokeInfo').innerHTML = `<p class="${adaptTypeCss(x)}" onclick="renderInfo(${x})">Info</p>`;
    document.getElementById('pokeStats').innerHTML = `<p onclick="renderBaseStats(${x})">Basiswerte</p>`;
    document.getElementById('pokeEvos').innerHTML = `<p onclick="loadEvolution(${x})">Evolution</p>`;
}

function resetDMGarrays() {
    doubleDMG = [];
    halfDMG = [];
    noDMG = [];
    quadrupleDMG = [];
    quarterDMG = [];
}

async function renderInfo(x) {
    document.getElementById('infoID').classList.remove('d-none');
    document.getElementById('pokeInfo').innerHTML = `<p class="${adaptTypeCss(x)}" onclick="renderInfo(${x})">Info</p>`;
    document.getElementById('evolutionID').classList.add('d-none');
    document.getElementById('pokeEvos').innerHTML = `<p onclick="loadEvolution(${x})">Evolution</p>`;
    document.getElementById('base-statsID').classList.add('d-none');
    document.getElementById('pokeStats').innerHTML = `<p onclick="renderBaseStats(${x})">Basiswerte</p>`;
    resetDMGarrays();
    await loadPokemonTypes(x);
    renderDescription(x);
    renderInfoBox(x);
    calculateWeakness(x);
    renderWeakAndStrong(x);
    await loadAbilities(x);
};

function renderInfoBox(x) {
    document.getElementById('pokeWeightID').innerHTML = numberWithCommas(allPokemon[x - 1].weight * 10 / 100) + 'kg';
    document.getElementById('pokeHeightID').innerHTML = numberWithCommas(allPokemon[x - 1].height / 10 + 'm');
    renderGenderRate(x);
}

async function loadPokemonTypes(x) {
    for (let j = 0; j < allPokemon[x - 1].types.length; j++) {
        let germanType = await loadPokemonTypeAPI(j, x);
        loadDMG(germanType.damage_relations.double_damage_from, doubleDMG);
        loadDMG(germanType.damage_relations.half_damage_from, halfDMG);
        loadDMG(germanType.damage_relations.no_damage_from, noDMG);
    }
}


function loadDMG(DMGtype, DMGarr) {
    for (let k = 0; k < DMGtype.length; k++) {
        const type = DMGtype[k].name;
        DMGarr.push(type);
    }
}

function renderTopCardDetails(x) {
    let pokename = document.getElementById(`pokeNameID`);
    let germanName = allPokemonNames[x - 1];
    pokename.innerHTML = germanName;
    document.getElementById('pokeGenusID').innerHTML = allSpecies[x - 1].genera[4].genus;
    document.getElementById('pokemonID').innerHTML = '#' + normalizeID(x);
    document.getElementById('pokemonSpritesID').innerHTML = `<img src="${allPokemon[x-1].sprites.other['official-artwork'].front_default}" class="card-img-top">`;
    let precursor = 'pokemonDetailType';
    renderPokemonType(x, precursor);
    adaptTypeCss(x);
    document.getElementById('pokemonDetailsDiv').classList.add(thisPokeType);
    document.getElementById('pokemonSpritesID').classList.add(thisPokeType);
    addArrows(x);
}

function adaptTypeCss(x) {
    thisPokeType = allPokemon[x - 1].types[0].type.name;
    if (thisPokeType == 'flying' || thisPokeType == 'dragon' || thisPokeType == 'ground') {
        thisPokeType = `${thisPokeType}2`
    }
    return thisPokeType;
}

function addArrows(x) {
    if (x > 1) {
        document.getElementById('priorPokemon').innerHTML = `<img onclick="initDetails(${x-1})" src="assets/img/arrow-91-24.png" class="arrow">`;
    } else if (x <= 1) {
        document.getElementById('priorPokemon').innerHTML = `<img onclick="initDetails(${898})" src="assets/img/arrow-91-24.png" class="arrow">`;
    }
    if (x < 898) {
        document.getElementById('nextPokemonn').innerHTML = `<img onclick="initDetails(${x+1})" src="assets/img/arrow-27-24.png" class="arrow">`;
    } else if (x >= 898) {
        document.getElementById('nextPokemonn').innerHTML = `<img onclick="initDetails(${1})" src="assets/img/arrow-27-24.png" class="arrow">`;
    }
}


function renderDescription(x) {
    for (let i = 0; i < allSpecies[x - 1].flavor_text_entries.length; i++) {
        const element = allSpecies[x - 1].flavor_text_entries[i];
        if (element.language.name == 'de') {
            document.getElementById('pokeDescrptnID').innerHTML = allSpecies[x - 1].flavor_text_entries[i].flavor_text;
        };
    }
}

function renderGenderRate(x) {
    let pokeGender = document.getElementById('pokemonGenderID');
    switch (allSpecies[x - 1].gender_rate) {
        case -1:
            pokeGender.innerHTML = '/';
            break;
        case 0:
            pokeGender.innerHTML = 'Nur männlich ' + malesign;
            break;
        case 1:
            pokeGender.innerHTML = 1 + femalesign + ' : ' + 7 + malesign;
            break;
        case 2:
            pokeGender.innerHTML = 1 + femalesign + ' : ' + 3 + malesign;
            break;
        case 4:
            pokeGender.innerHTML = 1 + femalesign + ' : ' + 1 + malesign;
            break;
        case 6:
            pokeGender.innerHTML = 3 + femalesign + ' : ' + 1 + malesign;
            break;
        case 7:
            pokeGender.innerHTML = 7 + femalesign + ' : ' + 1 + malesign;
            break;
        case 8:
            pokeGender.innerHTML = 'Nur weiblich ' + femalesign;
            break;
    }
}

function calculateWeakness() {
    let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index)
    quarterDMG = findDuplicates(halfDMG);
    quadrupleDMG = findDuplicates(doubleDMG);
    removeStrongWeaknessesandResistances(doubleDMG, quadrupleDMG);
    removeStrongWeaknessesandResistances(halfDMG, quarterDMG);
    removeStrongWeaknessesandResistances(doubleDMG, noDMG);
    neutralizeWeaknessNResistance(doubleDMG, halfDMG);
    neutralizeWeaknessNResistance(halfDMG, doubleDMG);
}

function renderWeakAndStrong() {
    damageDecision(noDMG, 'immunityheader', 'immunity', 'Immun gegen');
    damageDecision(quarterDMG, 'quarterheader', 'quarter', 'Super resistent gegen');
    damageDecision(halfDMG, 'halfheader', 'half', 'Resistent gegen');
    damageDecision(doubleDMG, 'doubleheader', 'double', 'Anfällig gegen');
    damageDecision(quadrupleDMG, 'quadrupleheader', 'quadruple', 'Stark anfällig gegen');
}

function damageDecision(DMGarr, headerElement, DMGelement, text) {
    document.getElementById(headerElement).innerHTML = '';
    document.getElementById(DMGelement).innerHTML = '';
    if (DMGarr.length != 0) {
        document.getElementById(headerElement).innerHTML = text;
        renderDamage(DMGarr, DMGelement);
    }
}

function renderDamage(DMGarr, htmlElement) {
    for (let i = 0; i < DMGarr.length; i++) {
        const element = DMGarr[i];
        document.getElementById(htmlElement).innerHTML += `
        <div class="smaller pokemon-type ${element}">${poketypes[element]}</div>`;
    }
}

function removeStrongWeaknessesandResistances(doubleDMG, quadrupleDMG) {
    offsetWeaknesses(doubleDMG, quadrupleDMG);
}

function neutralizeWeaknessNResistance(doubleDMG, halfDMG) {
    let condition = true;
    offsetWeaknesses(doubleDMG, halfDMG, condition);
}

function offsetWeaknesses(damage1, damage2, condition) {
    for (let i = 0; i < damage1.length; i++) {
        for (let j = 0; j < damage2.length; j++) {
            if (damage1[i] === damage2[j]) {
                damage1.splice(i, 1);
                if (condition) {
                    damage2.splice(j, 1);
                }
                j--;
            }
        }
    }
}

async function loadAbilities(x) {
    for (let k = 0; k < allPokemon[x - 1].abilities.length; k++) {
        let currentAbility = await loadPokemonAbilityAPI(k, x);
        renderAbilityScaffold(currentAbility, k, x);
        renderAbilityInfo(currentAbility, k, x);
    }
}

function renderAbilityScaffold(currentAbility, k, x) {
    if (allPokemon[x - 1].abilities[k].is_hidden == true) {
        document.getElementById('abilityhiddenhead').innerHTML = '<b>Versteckte Fähigkeit:</b>'
        document.getElementById('abilityhidden').innerHTML = currentAbility.names[4].name;
    } else {
        let ability = document.getElementById(`ability${k+1}`);
        document.getElementById(`ability${k+1}head`).innerHTML = `<b>Fähigkeit ${k+1}:</b>`
        ability.innerHTML = currentAbility.names[4].name;
    }
}

function renderAbilityInfo(currentAbility, k, x) {
    for (let i = 0; i < currentAbility.flavor_text_entries.length; i++) {
        const element = currentAbility.flavor_text_entries[i];
        if (element.language.name == 'de') {
            if (allPokemon[x - 1].abilities[k].is_hidden == true) {
                document.getElementById('abilityhiddeninfo').innerHTML = currentAbility.flavor_text_entries[i].flavor_text;
            } else {
                document.getElementById(`ability${k+1}info`).innerHTML = currentAbility.flavor_text_entries[i].flavor_text;
            }
        };
    }
}

function renderBaseStats(x) {
    adjustHtmlElementsForStats(x);
    renderStats('pokeHPid', 1, 255, x, 0);
    renderStats('pokeATTid', 5, 199, x, 1);
    renderStats('pokeDEFid', 5, 230, x, 2);
    renderStats('pokeSPECATTid', 10, 194, x, 3);
    renderStats('pokeSPECDEFid', 20, 250, x, 4);
    renderStats('pokeINITid', 5, 200, x, 5);
}

function adjustHtmlElementsForStats(x) {
    document.getElementById('base-statsID').classList.remove('d-none');
    document.getElementById('pokeStats').innerHTML = `<p class="${adaptTypeCss(x)}" onclick="renderBaseStats(${x})">Basiswerte</p>`;
    document.getElementById('infoID').classList.add('d-none');
    document.getElementById('pokeInfo').innerHTML = `<p onclick="renderInfo(${x})">Info</p>`;
    document.getElementById('evolutionID').classList.add('d-none');
    document.getElementById('pokeEvos').innerHTML = `<p onclick="loadEvolution(${x})">Evolution</p>`;
}

function renderStats(elementId, min, max, x, stat) {
    document.getElementById(elementId).innerHTML = `
    <div class="progress-bar ${adaptTypeCss(x)}" role="progressbar" aria-valuenow="${allPokemon[x - 1].stats[stat].base_stat / max * 100}" aria-valueMin="${min / max}" style="width: ${allPokemon[x-1].stats[stat].base_stat/max * 100}%" aria-valuemax="100"></div>`;
}



async function loadEvolutionChain(x) {
    await loadEvolutionAPI(x);
    allEvolutions.splice(currentEvo.id - 1, 1, currentEvo);
    let evo1 = resetEvoHTML();
    await loadEvoPokemon(currentEvo.chain.species, currentEvo.chain.evolution_details, evo1);
    await loadAnEvolution(currentEvo.chain.evolves_to);
}

function resetEvoHTML() {
    let evo1 = document.getElementById('pokemonEvolution1');
    evo1.innerHTML = '';
    document.getElementById('pokemonEvolution1').innerHTML = '';
    document.getElementById('pokemonEvolution2').innerHTML = '';
    document.getElementById('pokemonEvolution3').innerHTML = '';
    return evo1;
}

async function loadEvoPokemon(firstspecies, evo_details, htmlElement, correctHTML) {
    let info1 = await loadPokemonAPI(firstspecies.name);
    germanName = allPokemonNames[info1.id - 1];
    await loadEvoDetails(evo_details, htmlElement, info1);
    if (htmlElement.id == 'pokemonEvolution2' || htmlElement.id == 'pokemonEvolution3') {
        htmlElement = document.getElementById(correctHTML);
    }
    htmlElement.innerHTML += templateEvolution1Info(info1, germanName);
}


async function loadAnEvolution(currentEvolution) {
    for (let i = 0; i < currentEvolution.length; i++) {
        const element1 = currentEvolution[i].species;
        let evo2 = document.getElementById('pokemonEvolution2');
        let correctHTML2 = `evo${element1.name}`;
        correctHTML2 = `evo${element1.name}`;
        await loadEvoPokemon(element1, currentEvolution[i].evolution_details, evo2, correctHTML2);
        for (let j = 0; j < currentEvolution[i].evolves_to.length; j++) {
            const element2 = currentEvolution[i].evolves_to[j].species;
            let evo3 = document.getElementById('pokemonEvolution3');
            let correctHTML3 = `evo${element2.name}`;
            await loadEvoPokemon(element2, currentEvolution[i].evolves_to[j].evolution_details, evo3, correctHTML3);
        }
    }
}

async function loadEvoDetails(evo_details, htmlElement, info1) {
    let englishName = adaptName(info1);
    if (evo_details.length > 0) {
        for (let j = 0; j < evo_details.length; j++) {
            const newarr = Object.entries(evo_details[j]);
            await renderAndLoadEvoDetails(newarr, htmlElement, englishName);
        }
    }
}

function adaptName(info1) {
    info1 = info1.forms[0].name;
    if (info1 == 'darmanitan-standard') {
        info1 = 'darmanitan';
    }
    return info1;
}

async function renderAndLoadEvoDetails(evoDetailArr, htmlElement, englishName) {
    const locationRequired = evoDetailArr[16][1].name == 'take-damage';
    const criticalHitsRequired = evoDetailArr[16][1].name == 'three-critical-hits';
    const towerOfWatersRequired = evoDetailArr[16][1].name == 'tower-of-waters';
    const towerOfDarknessRequired = evoDetailArr[16][1].name == 'tower-of-darkness';
    const spinRequired = evoDetailArr[16][1].name == 'spin';
    const shedRequired = evoDetailArr[16][1].name == 'shed';
    const tradeRequired = evoDetailArr[16][1].name == 'trade';
    const triggerItemRequired = evoDetailArr[2][1] && evoDetailArr[16][1].name == 'use-item';
    const FriendshipRequired = evoDetailArr[8][1] && evoDetailArr[16][1].name == 'level-up';
    const holdItemRequired = evoDetailArr[16][1].name == 'level-up' && evoDetailArr[1][1] != null;
    const knownMoveRequired = evoDetailArr[16][1].name == 'level-up' && evoDetailArr[3][1] != null;
    const PartyMemberRequired = evoDetailArr[16][1].name == 'level-up' && evoDetailArr[11][1] != null;
    const SimpleLvlUpRequired = evoDetailArr[9][1] && evoDetailArr[16][1].name == 'level-up';

    switch (true) {
        case locationRequired:
            renderLocationEvo(htmlElement, englishName);
            break;
        case criticalHitsRequired:
            renderCriticalHitsEvo(htmlElement, englishName);
            break;
        case towerOfWatersRequired:
            renderTowerofWatersEvo(htmlElement);
            break;
        case towerOfDarknessRequired:
            renderTowerofDarknessEvo(htmlElement);
            break;
        case spinRequired:
            renderSpinEvo(htmlElement);
            break;
        case shedRequired:
            renderShedEvo(htmlElement, englishName);
            break;
        case tradeRequired:
            await renderTradeEvo(evoDetailArr, htmlElement, englishName);
            break;
        case triggerItemRequired:
            await renderTriggerItemEvo(evoDetailArr, htmlElement, englishName);
            break;
        case FriendshipRequired:
            renderFriendshipEvo(evoDetailArr, htmlElement, englishName);
            break;
        case holdItemRequired:
            await renderHoldItemEvo(evoDetailArr, htmlElement, englishName);
            break;
        case knownMoveRequired:
            await renderknownMoveEvo(evoDetailArr, htmlElement, englishName);
            break;
        case PartyMemberRequired:
            await renderPartyMemberEvo(evoDetailArr, htmlElement, englishName);
            break;
        case SimpleLvlUpRequired:
            renderSimpleLvlUpEvo(evoDetailArr, htmlElement, englishName);
            break;
    }
}

function closeDetails() {
    resetPokeType();
    document.getElementById('pokemonDetails').classList.add('d-none');
    document.getElementById('pokedexList').classList.remove('d-none');
}

function resetPokeType() {
    if (document.getElementById('pokemonDetails').classList.value.includes('d-none') == false) {
        document.getElementById('pokemonDetailsDiv').classList.remove(thisPokeType);
        document.getElementById('pokemonSpritesID').classList.remove(thisPokeType);
        thisPokeType = '';
    }
}

async function loadEvolution(x) {
    document.getElementById('base-statsID').classList.add('d-none');
    document.getElementById('infoID').classList.add('d-none');
    document.getElementById('evolutionID').classList.remove('d-none');
    document.getElementById('pokeStats').innerHTML = `<p onclick="renderBaseStats(${x})">Basiswerte</p>`;
    document.getElementById('pokeInfo').innerHTML = `<p onclick="renderInfo(${x})">Info</p>`;
    document.getElementById('pokeEvos').innerHTML = `<p class="${adaptTypeCss(x)}" onclick="loadEvolution(${x})">Evolution</p>`;
    await loadEvolutionChain(x);
}