// app.js

// Kuhanin ang mga kailangang HTML elements
const searchBtn = document.getElementById('search-btn');
const pokemonInput = document.getElementById('pokemon-input');
const resultContainer = document.getElementById('result-container');

// Function para kumuha ng data mula sa PokeAPI (GET Request)
async function getPokemonData() {
    const query = pokemonInput.value.trim().toLowerCase();

    // Validasyon kung walang tinype ang user
    if (!query) {
        resultContainer.innerHTML = '<p class="error-text">⚠️ Paki-type muna ang pangalan ng Pokémon.</p>';
        return;
    }

    // Ang URL ng PokeAPI endpoint
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${query}`;

    try {
        // Magpakita ng loading text habang naghihintay ng data
        resultContainer.innerHTML = '<p class="loading-text">Naghahanap...</p>';

        const response = await fetch(apiUrl);

        // Requirement 6: Error Handling kapag hindi nahanap ang Pokémon (Status 404)
        if (!response.ok) {
            throw new Error('Hindi nahanap ang Pokémon. Siguraduhing tama ang spelling!');
        }

        // I-convert ang response sa JSON format
        const data = await response.json();

        // Requirement 5: Data Presentation - Ipakita ang data sa magandang paraan
        displayPokemon(data);

    } catch (error) {
        // I-log ang error sa console para sa developer at magpakita ng error sa user
        console.error('API Error:', error);
        resultContainer.innerHTML = `
            <div class="error-box">
                <p>⚠️ <strong>Error:</strong> ${error.message}</p>
            </div>
        `;
    }
}

// Function para i-render ang data sa screen
function displayPokemon(pokemon) {
    // Kuhanin ang mga types ng pokemon (e.g., grass, poison) at pagsamahin
    const types = pokemon.types.map(t => t.type.name).join(', ');

    // I-inject ang HTML structure kasama ang data ng Pokémon
    resultContainer.innerHTML = `
        <div class="pokemon-card">
            <img class="pokemon-img" src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <h2 class="pokemon-name">${pokemon.name.toUpperCase()}</h2>
            <div class="pokemon-info">
                <p><strong>Type:</strong> ${types}</p>
                <p><strong>Height:</strong> ${pokemon.height / 10} m</p>
                <p><strong>Weight:</strong> ${pokemon.weight / 10} kg</p>
            </div>
        </div>
    `;
}

// Requirement 4: Event Listeners para sa click ng button at pagpindot ng 'Enter'
searchBtn.addEventListener('click', getPokemonData);
pokemonInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getPokemonData();
    }
});