import colors from './colors.js'

const pokemonContainer = document.getElementById('pokemon-container')

const pokeball = document.getElementById('pokeball')

const getPokemon = async (pokemon) => {
    await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
        .then(res => res.text())
        .then(async data => {
            const response = JSON.parse(data)
            const card = cardTemplate.content.cloneNode(true)
            const cardImage = card.querySelector('.card-body-image')
            const defaultColor = 'gray'

            const typeName1 = response.types[0].type.name
            if (response.types.length > 1) {
                const typeName2 = response.types[1].type.name
                card.querySelector('.card').style.background = `linear-gradient(to right, ${colors[typeName1]['circle']} 50%, ${colors[typeName2]['circle']} 50%)`
                cardImage.style.background = `linear-gradient(to right, ${colors[typeName1]['background'] || defaultColor} 50%, ${colors[typeName2]['background'] || defaultColor} 50%)`
            } else {
                card.querySelector('.card').style.backgroundColor = colors[typeName1]['background'] || defaultColor
                cardImage.style.background = colors[typeName1]['types'] || defaultColor
            }
            card.querySelector('.card-description').style.backgroundColor = colors[typeName1]['background']

            Object.values(response.sprites).reverse().forEach(spriteUrl => {
                const img = document.createElement("img")
                img.style.width = '50%'
                img.src = typeof spriteUrl === 'string' ? spriteUrl : ''
                if (spriteUrl) card.querySelector('.card-description-img').appendChild(img)
            })
            response.types.forEach(element => {
                const cardType = cardTypeTemplate.content.cloneNode(true)
                const typeName = element.type.name
                cardType.querySelector('.card-type').innerHTML = typeName.charAt(0).toUpperCase() + typeName.slice(1)
                cardType.querySelector('.card-type').style.backgroundColor = colors[element.type.name]['types'] || 'gray'
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
            card.querySelector('.card-description').prepend(response.flavor_text_entries[0].flavor_text)
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