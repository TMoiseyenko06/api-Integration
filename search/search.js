const search = document.getElementById('search');

async function searchPokemon() {
    const pokemon = document.getElementById('name').value;
    const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemon}`
    )
    const pokemonData = await response.json();
    return pokemonData
};

async function getType(type) {
    const response = await fetch(
        `https://pokeapi.co/api/v2/type/${type}/`
    )
    const data = await response.json();
    const icon = data.sprites["generation-iii"].emerald.name_icon;
    return icon
}

const parseData = (data) => {
    const name = data.name;
    const image = data.sprites.front_default;
    const types = []
    data.types.forEach(type => {
        const name = type.type.name;
        types.push(name)
    });
    return [name,image,types];
}

const loadTypes = types => {
    const container = document.getElementById("types");
    types.forEach(type => {
        getType(type)
        .then(function (icon) {
            container.innerHTML+= `<img class="img img-fluid m-1" style="width:25%" src="${icon}">`
        })
        
    })
}

const displayData = async () => {
    const resultContainer = document.getElementById("results");
    searchPokemon()
    .then(function (data){
        const [name,imageUrl,types] = parseData(data)
        resultContainer.innerHTML = `
            <div class="column col-4">
            <div class="card">
                <h1 class="text-center">${name}</h1>
                <img class="img-fluid"src="${imageUrl}">
                <div id='types' class=" card-body justify-content-center">

                </div>
                <p class="mx-4">View more information on the details page!</p>
            </div>
            </div>
        `
        loadTypes(types)

    })
    .catch(function (error) {
        alert("Pokemon Not found!")
    });
}

search.addEventListener("click",(event) => {
    event.preventDefault();
    displayData();
});