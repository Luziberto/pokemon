
let music = null
let currentSeason = 0

pokeball.addEventListener('click', () => {
  changeMusic(music, generateDifferentSeason(currentSeason))
})

const changeMusic = (currentMusic, season) => {
  if (currentMusic) currentMusic.pause()
  const newMusic = new Audio(`public/audio/pokemon_op_${season}.mp3`)
  newMusic.play()
  music = newMusic
}

const generateDifferentSeason = (currentSeason) => {
  const newSeason = Math.floor((Math.random() * 5) + 1)
  if (currentSeason === newSeason) generateDifferentSeason(currentSeason)
  else currentSeason = newSeason
  return currentSeason
}

setInterval(() => {
  if (!music || !music.currentTime || music.ended) changeMusic(music, generateDifferentSeason(currentSeason))
}, 1000)