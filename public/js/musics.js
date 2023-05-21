
let music = null
let currentSeason = 0


const changeMusic = (currentMusic, season) => {
  if (currentMusic) currentMusic.pause()
  const newMusic = new Audio(`public/audio/pokemon_op_${season}.mp3`)
  newMusic.play()
  music = newMusic
}

const changeDifferentMusic = () => {
  currentSeason = generateDifferentSeason(currentSeason)
  changeMusic(music, currentSeason)
}

const generateDifferentSeason = (currentSeason) => {
  const newSeason = Math.floor((Math.random() * 5) + 1)
  if (currentSeason === newSeason) return generateDifferentSeason(currentSeason)
  else return newSeason
}

setInterval(() => {
  if (!music || !music.currentTime || music.ended) {
    changeDifferentMusic()
  }
}, 1000)

pokeball.addEventListener('click', changeDifferentMusic)