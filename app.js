const searchBtn = document.getElementById('search-btn');
const randomBtn = document.getElementById('random-btn');
const pokemonInput = document.getElementById('pokemon-input');
const resultContainer = document.getElementById('result-container');

// ─── AMBAG NG KA-GRUPO MO (BRANCH: feature-search-history) ───
// Dito magdedeklara ang ka-grupo mo ng global array variable para sa search tracking.

// Pangunahing Fetch Function
async function getPokemonData(targetQuery) {
    // Kung walang ipinasang targetQuery (galing sa argument), kukunin sa input box field.
    const query = targetQuery || pokemonInput.value.trim().toLowerCase();

    if (!query && !targetQuery) {
        renderError('Please enter a Pokémon name or ID first.');
        return;
    }

    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${query}`;

    try {
        renderLoading();

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Pokémon "${query}" not found. Check your spelling and try again!`);
        }

        const data = await response.json();

        // I-render ang kumpleto at pinagandang data display format
        displayPokemon(data);

        // Clear input structure pagkatapos ng matagumpay na search
        pokemonInput.value = '';

        // ─── AMBAG NG KA-GRUPO MO (BRANCH: feature-search-history) ───
        // Dito isisingit ang logic para sa pag-save ng pangalan sa history array list window elements.

    } catch (error) {
        console.error('API Error Exception:', error);
        renderError(error.message);
    }
}

// Function para sa Loading State Screen UI
function renderLoading() {
    resultContainer.innerHTML = `
        <div class="loading-state">
            <div class="spinner"></div>
            <p>Scanning Dex database, please wait...</p>
        </div>
    `;
}

// Function para sa Magandang Error Alerts Card
function renderError(message) {
    resultContainer.innerHTML = `
        <div class="error-card animate-fade">
            <span class="error-icon">❌</span>
            <h3>Data Fetch Error</h3>
            <p>${message}</p>
        </div>
    `;
}

// Function para sa Pagpapakita ng Mas Maraming Detalye ng Pokémon
function displayPokemon(pokemon) {
    // Dynamic Badges Mapping Rendering
    const typesHTML = pokemon.types.map(t => 
        `<span class="type-badge ${t.type.name}">${t.type.name.toUpperCase()}</span>`
    ).join('');

    // Kuhanin ang functional abilities list structure data array at i-join
    const abilities = pokemon.abilities.map(a => a.ability.name.replace('-', ' ')).join(', ');

    // Extract dynamic statistics variables
    const hp = pokemon.stats[0].base_stat;
    const attack = pokemon.stats[1].base_stat;
    const defense = pokemon.stats[2].base_stat;
    const speed = pokemon.stats[5].base_stat;

    resultContainer.innerHTML = `
        <div class="pokemon-card animate-fade">
            <div class="card-header">
                <h2 class="pokemon-name">${pokemon.name.toUpperCase()}</h2>
                <span class="pokemon-id">#${String(pokemon.id).padStart(3, '0')}</span>
            </div>
            
            <div class="image-wrapper-bg">
                <img id="pokemon-img" class="pokemon-img" src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            </div>
            
            <div class="pokemon-info-grid">
                <div class="info-row">
                    <span class="info-label">Type</span>
                    <div class="type-container">${typesHTML}</div>
                </div>
                <div class="info-row">
                    <span class="info-label">Abilities</span>
                    <span class="info-value text-capitalize">${abilities}</span>
                </div>
                <div class="info-row-split">
                    <div>
                        <span class="info-label">Height</span>
                        <span class="info-value">${pokemon.height / 10} m</span>
                    </div>
                    <div>
                        <span class="info-label">Weight</span>
                        <span class="info-value">${pokemon.weight / 10} kg</span>
                    </div>
                </div>
            </div>

            <div class="stats-dashboard">
                <h3>Base Stats</h3>
                
                <div class="stat-bar-group">
                    <div class="stat-label-row"><span>HP</span><strong>${hp}</strong></div>
                    <div class="bar-track"><div class="bar-fill hp-bar" style="width: ${Math.min((hp/255)*100, 100)}%"></div></div>
                </div>

                <div class="stat-bar-group">
                    <div class="stat-label-row"><span>Attack</span><strong>${attack}</strong></div>
                    <div class="bar-track"><div class="bar-fill atk-bar" style="width: ${Math.min((attack/190)*100, 100)}%"></div></div>
                </div>

                <div class="stat-bar-group">
                    <div class="stat-label-row"><span>Defense</span><strong>${defense}</strong></div>
                    <div class="bar-track"><div class="bar-fill def-bar" style="width: ${Math.min((defense/230)*100, 100)}%"></div></div>
                </div>

                <div class="stat-bar-group">
                    <div class="stat-label-row"><span>Speed</span><strong>${speed}</strong></div>
                    <div class="bar-track"><div class="bar-fill spd-bar" style="width: ${Math.min((speed/180)*100, 100)}%"></div></div>
                </div>
            </div>
        </div>
    `;

    // ─── AMBAG NG KA-GRUPO MO (BRANCH: feature-pokemon-cry) ───
    // Dito sa ilalim ilalagay ng ka-grupo mo ang functional trigger callback system for sounds execution
}

// Random Generator Engine Call Listener Logic
randomBtn.addEventListener('click', () => {
    const randomId = Math.floor(Math.random() * 1000) + 1; // Pumipili sa 1-1000 range database pool entries
    getPokemonData(randomId);
});

// Primary Entry Trigger Interfaces
searchBtn.addEventListener('click', () => getPokemonData());
pokemonInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getPokemonData();
    }
});