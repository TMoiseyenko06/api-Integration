const search = document.getElementById("search");
//Getters VVV
async function searchPokemon() {
  const pokemon = document.getElementById("name").value;
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
  const pokemonData = await response.json();
  return pokemonData;
}

async function getType(type) {
  const response = await fetch(`https://pokeapi.co/api/v2/type/${type}/`);
  const data = await response.json();
  const icon = data.sprites["generation-iii"].emerald.name_icon;
  return icon;
}

async function getAbility(ability) {
  const response = await fetch(`https://pokeapi.co/api/v2/ability/${ability}/`);
  const data = await response.json();
  const effect = data.effect_entries[1].effect;
  return effect;
}

async function getMove(move) {
  const response = await fetch(`https://pokeapi.co/api/v2/move/${move}/`);
  const data = await response.json();
  const power = data.power;
  const effect = data.effect_entries[0].effect;
  const name = data.names[7].name;
  const pp = data.pp;
  return [name, power, pp, effect];
}

//Parser VVV
const parseData = (data) => {
  const name = data.name;
  const image = data.sprites.front_default;
  const types = [];
  const abilities = [];
  const moves = [];
  const stats = [];
  data.types.forEach((type) => {
    const name = type.type.name;
    types.push(name);
  });
  data.abilities.forEach((ability) => {
    abilities.push(ability.ability.name);
  });
  data.moves.forEach((move) => {
    moves.push(move.move.name);
  });
  data.stats.forEach((stat) => {
    stats.push(stat.base_stat);
  });
  console.log(stats);
  return [name, image, types, abilities, moves, stats];
};

//Loaders VVV
const loadTypes = (types) => {
  const container = document.getElementById("types");
  types.forEach((type) => {
    getType(type).then(function (icon) {
      container.innerHTML += `<img class="img img-fluid m-1" style="width:25%" src="${icon}">`;
    });
  });
};

const loadAbilities = async (abilities) => {
  const container = document.getElementById("abilities");
  abilities.forEach((ability) => {
    getAbility(ability).then((effect) => {
      container.innerHTML += `<h4>${ability}:</h4>
        <p>${effect}</p>
        `;
    });
  });
};

const loadMoves = async (moves) => {
  const container = document.getElementById("moves");
  moves.forEach((move) => {
    getMove(move).then(([name, power, pp, effect]) => {
      container.innerHTML += `
      <div class="card m-2 p-3">
        <h4>${name}</h4>
        <p>Power: ${power}</p>
        <p>PP: ${pp}</p>
        <p>Effect: ${effect}</p>
      </div>
      `;
    });
  });
};

const loadStats = (stats) => {
  const container = document.getElementById("stats");
  stats.forEach((stat) => {
    container.innerHTML += `
      <div class="progress m-3" role="progressbar">
        <div class="progress-bar" style="width: ${stat/2}%"></div>
      </div>
      `;
  });
};

//Display
const displayData = async () => {
  const resultContainer = document.getElementById("results");
  searchPokemon()
    .then(function (data) {
      const [name, imageUrl, types, abilities, moves, stats] = parseData(data);
      resultContainer.innerHTML = `
            <div class="column col-4">
            <div class="card">
                <h1 class="text-center">${name}</h1>
                <img class="img-fluid"src="${imageUrl}">
                <div id="stats" class="card-body">
                <h2>Base Stats</h2>

                </div>
                <div id='types' class=" card-body justify-content-center">

                </div>
                
                <div id="abilities" class="card-body">
                <h2>Abilities:</h2>
                </div>
                <div id="moves" class="card-body">
                <h2>Moves:</h2>
                </div>
            </div>
            </div>
        `;
      loadTypes(types);
      loadAbilities(abilities);
      loadMoves(moves);
      loadStats(stats);
    })
    .catch(function (error) {
      alert('Pokemon Not Found')
    });
};

search.addEventListener("click", (event) => {
  event.preventDefault();
  displayData();
});
