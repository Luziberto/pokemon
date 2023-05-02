const pokemonContainer = document.getElementById('pokemon-container')

const getPokemon = async (pokemon) => {
    await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
        .then(res => res.text())
        .then(async data => {
            const response = JSON.parse(data)
            const card = cardTemplate.content.cloneNode(true)

            response.types.forEach(element => {
                const cardType = cardTypeTemplate.content.cloneNode(true)
                cardType.querySelector('.card-type').innerHTML = element.type.name
                cardType.querySelector('.card-type').style.backgroundColor = badgeColors[element.type.name] || 'gray'
                card.querySelector('.card-body-type').appendChild(cardType)
            })
            
            await getPokemonInfo(response.id, card)
        });
    
}

const getPokemonInfo = async (pokemonId, card) => {

    await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`)
        .then(res => res.text())
        .then(data => {
            const response = JSON.parse(data)
            

            card.querySelector('.card-title').innerHTML = response.name.charAt(0).toUpperCase() + response.name.slice(1)
            card.querySelector('.card-footer-description').innerHTML = response.flavor_text_entries[0].flavor_text
            card.querySelector('.card-body-image>img').src = `https://play.pokemonshowdown.com/sprites/xyani/${response.name.replace('-', '')}.gif`
            
           pokemonContainer.appendChild(card)
           
        });
}

const getAllPokemons = async (pagination) => {
    let params = new URLSearchParams()
    params.append('offset', (pagination.page - 1) * pagination.page_size)
    params.append('limit', pagination.page_size)

    await fetch(`https://pokeapi.co/api/v2/pokemon?${params}`)
        .then(res => res.text())
        .then(data => {
            const response = JSON.parse(data)
            response.results.forEach(pokemon => {
                getPokemon(pokemon.name)
            });
        })
}

const badgeColors = {
    grass: 'green',
    poison: 'blueviolet',
    normal: 'darkgray',
    flying: 'lightblue',
    electric: 'darkgoldenrod',
    ground: 'brown',
    fairy: 'pink',
    fire: 'red',
    fighting: 'darkred',
    water: 'blue',
    rock: 'lightgrey',
    bug: 'darkgreen',
    psychic: 'magenta',
    ice: 'aqua',
    dark: 'brown',
    ghost: 'purple'
}

const cardTemplate = document.getElementById('card-template');
const cardTypeTemplate = document.getElementById('card-type-template');

const pagination = {
    page: 1,
    page_size: 20,
    total: 0
}

const observer = new IntersectionObserver(([entry]) => {
    if (entry && entry.isIntersecting) {
        pagination.page = pagination.page + 1,
        pagination.page_size = pagination.page_size,
        pagination.total = pagination.total + pagination.page_size

        getAllPokemons(pagination)
    }
})

observer.observe(document.getElementById('observer'))
        

Window.onload = getAllPokemons(pagination)

