let season = Math.floor((Math.random() * 5) + 1)
let music = new Audio(`../../public/audio/pokemon_op_${season}.mp3`)

pokeball.addEventListener('click', () => {
  if (music.played) changeMusic()
  music.play()
})

const changeMusic = () => {
  music.pause()
  season = Math.floor((Math.random() * 5) + 1)
  music = new Audio(`../../public/audio/pokemon_op_${season}.mp3`)
}

pokeball.click()