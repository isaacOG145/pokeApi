const urlParams = new URLSearchParams(window.location.search);
const pokemonId = urlParams.get('id');

let PokemonDetails = [];

//encontrar details 
const findDetails = async () => {
    await fetch ('http://127.0.0.1:5500/json/pokedex.json', {
        method: 'GET',
        headers:{
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(res => res.json())
    .then(res => {
        PokemonDetails = JSON.parse(JSON.stringify(res));
    }).catch(console.log);
}

const buildgrid = () => {

    let grid = document.getElementById('details');
    let content = '';

    const pokemon = PokemonDetails.find(poke => poke.id === parseInt(pokemonId));

    if(pokemon){
        const types = pokemon.type.join(", ");

        content = `<div class="col p-4" >
                    <div class="card">
                        <div class="card-body">
                            <img src="${pokemon.image.sprite}" alt="" class="card-img-top">
                            <h5 class="card-title">ID ${pokemon.id}. ${pokemon.name.english}</h5>
                            <p class="card-text">
                            Tipo:<br> 
                            <span class="badge bg-secondary">${types}</span><br>
                            Especie: ${pokemon.species}<br>
                            Altura: ${pokemon.profile.height}<br>
                            Peso: ${pokemon.profile.weight}<br>
                            Huevo: ${pokemon.profile.egg}<br>
                            Descripción: ${pokemon.description}
                            </p>
                        </div>
                    </div>
                </div>`;
    } else{
        content = `<p>Pokémon no encontrado.</p>`;
    }


    grid.innerHTML = content;
} 

(async () => {
    await findDetails();
    buildgrid();
})();