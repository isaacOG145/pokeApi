let pokemons = [];
let types = [];

//Encontrar tipos
const findTypes = async () =>{
    await fetch('http://127.0.0.1:5500/json/types.json',{
        method: 'GET',
        headers:{
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(res => res.json())
    .then(res => {
        types = res;
    }).catch(console.error);
}

//Encontrar pokemons
const findPokemons = async () => {
    await fetch('http://127.0.0.1:5500/json/pokedex.json', {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(res => res.json())
      .then(res => {
          pokemons = res; 
      }).catch(console.log);
}

//metodo alternativo
// const findPokemons = async () => {
//     try {
//         const response = await fetch('http://127.0.0.1:5500/json/pokedex.json', {
//             method: 'GET',
//             headers: {
//                 "Content-Type": "application/json",
//                 "Accept": "application/json"
//             }
//         });
//         if (!response.ok) {
//             throw new Error('Error al cargar los datos');
//         }
//         const data = await response.json();
//         pokemons = data; // Asignar los datos a la variable pokemons
//     } catch (error) {
//         console.error('Hubo un problema con la solicitud:', error);
//     }
// };

const buildGrid = (filteredPokemons) => {

    let grid = document.getElementById('pokemons');
    let content = '';

    filteredPokemons.forEach(poke => {
        const types = poke.type.join(", ");
        content += `
                        <div class="p-3 col">
                            <div class="card p-2 shadow">
                                <img src="${poke.image.sprite}" alt="">
                                <div class="card-body">
                                    <h5 class="card-title">ID ${poke.id}. ${poke.name.english}</h5>
                                    <p class="card-text">
                                        Tipo: ${types}<br>
                                        Especie: ${poke.species}<br>
                                        Altura: ${poke.profile.height}<br>
                                        Peso: ${poke.profile.weight}<br>
                                        <a href="../views/details.html?id=${poke.id}" class="btn btn-outline-warning mt-2">Ver más</a>      
                                    </p>
                                </div>
                            </div>
                        </div>`;

    });

    grid.innerHTML = content;
}

const buildTypeList = () => {

    let typeList = document.getElementById('type-list');
    let content = '';

    types.forEach(type => {
        content += `<li class="list-group-item list-group-item-action" data-type="${type.english}"> <img src="${type.iconURL} " alt="" class="icon"> ${type.spanish}</li>`;
    });

    typeList.innerHTML = content;

    typeList.querySelectorAll('li').forEach(item => {
        item.addEventListener('click', () =>{
            const selectedType = item.getAttribute('data-type');
            filterByType(selectedType); 
        });
    });
}

// Filtrar los Pokémon por tipo
const filterByType = (type) => {
    let filteredPokemons = [];
    if (type === "all") {
        filteredPokemons = [...pokemons]; 
    } else {
        filteredPokemons = pokemons.filter(poke => poke.type.includes(type)); 
    }
    buildGrid(filteredPokemons); 
};

// Filtrar los Pokémon por nombre
const searchByName = (name) => {
    const filteredPokemons = pokemons.filter(poke =>
        poke.name.english.toLowerCase().includes(name.toLowerCase()) 
    );
    buildGrid(filteredPokemons); 
};



(async () => {
    await findPokemons();
    await findTypes();
    buildTypeList();
    buildGrid (pokemons);

    const searchForm = document.querySelector('form');
    const searchInput = document.querySelector('input[type="search"]');

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault(); 
        const searchTerm = searchInput.value.trim(); 
        searchByName(searchTerm); 
    });
})();