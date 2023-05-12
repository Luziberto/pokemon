const pokemonContainer = document.getElementById('pokemon-container')

const getPokemon = async (pokemon) => {
    await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
        .then(res => res.text())
        .then(async data => {
            const response = JSON.parse(data)
            const card = cardTemplate.content.cloneNode(true)
            const cardImage = card.querySelector('.card-body-image')


            const typeName1 = response.types[0].type.name
            if (response.types.length > 1) {
                const typeName2 = response.types[1].type.name
                card.querySelector('.card').style.background = `linear-gradient(to right, ${badgeColors[typeName1]['background']} 50%, ${badgeColors[typeName2]['background']} 50%)`
                cardImage.style.background = `linear-gradient(to right, ${badgeColors[typeName1]['types']} 50%, ${badgeColors[typeName2]['types']} 50%)`
            } else {
                card.querySelector('.card').style.backgroundColor = badgeColors[typeName1]['background'] || 'gray'
                cardImage.style.background = badgeColors[typeName1]['types'] || 'gray'
            }

            response.types.forEach(element => {
                const cardType = cardTypeTemplate.content.cloneNode(true)
                cardType.querySelector('.card-type').innerHTML = element.type.name
                cardType.querySelector('.card-type').style.backgroundColor = badgeColors[element.type.name]['types'] || 'gray'
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
            card.querySelector('.card-body-image img').src = `https://play.pokemonshowdown.com/sprites/xyani/${response.name.replace('-', '')}.gif`

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
    grass: {
        types: 'green',
        background: '#e0fde0',
        circle: '#f2fdf3'
    },
    poison: {
        types: 'blueviolet',
        background: '',
        circle: ''
    },
    normal: {
        types: 'darkgray',
        background: '#ceceb4',
        circle: '##fcfbfd'
    },
    flying: {
        types: 'lightblue',
        background: '#ceceb4',
        circle: '#fcfbfd'
    },
    electric: {
        types: 'darkgoldenrod',
        background: '#f2fdf3',
        circle: '#d3d1cb'
    },
    ground: {
        types: 'brown',
        background: '#c0b6ad',
        circle: '#d7d1cd'
    },
    fairy: {
        types: 'pink',
        background: '#d7d1cd',
        circle: '#d7d1cd'
    },
    fire: {
        types: 'red',
        background: '#fef2f3',
        circle: '#fedfe0'
    },
    fighting: {
        types: 'darkred',
        background: '#d7d0c6',
        circle: '#f6f3f0'
    },
    water: {
        types: 'blue',
        background: '#def2fc',
        circle: '#f2f9ff'
    },
    rock: {
        types: 'lightgrey',
        background: '#f2f9ff',
        circle: '#d3d2d1'
    },
    bug: {
        types: 'darkgreen',
        background: '#f2fdf3',
        circle: '#fdeedc'
    },
    psychic: {
        types: 'magenta',
        background: '#d3d1cb',
        circle: '#ceceb4'
    },
    ice: {
        types: 'aqua',
        background: '',
        circle: ''
    },
    dark: {
        types: 'brown',
        background: '',
        circle: ''
    },
    ghost: {
        types: 'purple',
        background: '',
        circle: ''
    },
    steel: {
        types: 'lightgray',
        background: '',
        circle: ''
    },
    dragon: {
        types: 'orange',
        background: '#7488b0',
        circle: '#fef2f3'
    },
}

const cardTemplate = document.getElementById('card-template');
const cardTypeTemplate = document.getElementById('card-type-template');

const pagination = {
    page: 1,
    page_size: 40,
    total: 40
}

const observer = new IntersectionObserver(([entry]) => {
    if (entry && entry.isIntersecting) {
        pagination.page = pagination.page + 1
        pagination.total = pagination.total + pagination.page_size

        getAllPokemons(pagination)
    }
})

observer.observe(document.getElementById('observer'))


Window.onload = getAllPokemons(pagination)

