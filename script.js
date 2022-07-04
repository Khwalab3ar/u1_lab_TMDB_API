const API_KEY = '6de691e19a3002842be2bdcc276a3578'
const DOMAIN = 'https://api.themoviedb.org/3'
const IMAGE_BASE_PATH = 'https://image.tmdb.org/t/p/original'

const button = document.querySelector('button')
const input = document.querySelector('#search-input')
const insertMovie = document.querySelector('.movie-list')
const popUpDiv = document.querySelector('#detail-box')
const blackBG = document.querySelector('#background-black')
let newList = {}
let movieAdded = (newList.movie = [])
let imageAdded = (newList.image = [])
let idAdded = (newList.id = [])
let displayDetail = {}
let detailKeys = (displayDetail.keys = [])
let detailValues = (displayDetail.values = [])

button.addEventListener('click', async () => {
  clear()
  let movie = input.value
  const result = await axios.get(
    `https://api.themoviedb.org/3/search/movie?query=${movie}&api_key=${API_KEY}`
  )
  let movieList = renderList(result)
})

const renderList = (result) => {
  let list = result.data.results
  list.forEach((m) => {
    movieAdded.push(m.title)
    imageAdded.push(m.poster_path)
    idAdded.push(m.id)
  })
  // insert <div> into movie-list section
  for (let i = 0; i < movieAdded.length; i++) {
    const createDiv = document.createElement('div')
    createDiv.setAttribute('class', 'movies')
    createDiv.innerHTML = `<img src=\'${IMAGE_BASE_PATH}${imageAdded[i]}\'> <p class=\'title\'>${movieAdded[i]}</p><button class=\'moreDetails\' id=\'${i}\'>More Details</button>`
    insertMovie.appendChild(createDiv)
  }
  moreMovieDetails()
}
const moreMovieDetails = () => {
  const moreDetails = document.querySelectorAll('.moreDetails')
  moreDetails.forEach((b) => {
    b.addEventListener('click', async () => {
      idLocation = b.getAttribute('id')
      const movieDetailList = await axios.get(
        `${DOMAIN}/movie/${idAdded[idLocation]}?api_key=${API_KEY}&language=en-US`
      )
      createDetailDiv(movieDetailList.data, idLocation)
      popUpDiv.setAttribute('class', 'box-toggle')
      blackBG.setAttribute('class', 'bg-toggle')
      exitDetail()
    })
  })
}

const createDetailDiv = (movieData, idLocation) => {
  console.log(movieData)
  displayDetail.keys = Object.keys(movieData)
  displayDetail.values = Object.values(movieData)
  let wantedData = [0, 3, 10, 11, 17, 19]
  const createH1 = document.createElement('h1')
  createH1.innerHTML = displayDetail.values[21]
  createH1.style.textAlign = 'center'
  popUpDiv.appendChild(createH1)
  for (let i = 0; i < wantedData.length; i++) {
    let n = wantedData[i]
    const createP = document.createElement('p')
    createP.innerHTML = `${displayDetail.keys[n]} : ${displayDetail.values[n]}`
    popUpDiv.appendChild(createP)
  }
}

const exitDetail = () => {
  popUpDiv.addEventListener('click', function () {
    popUpDiv.innerHTML = ''
    popUpDiv.setAttribute('class', '.nothing')
    blackBG.setAttribute('class', '.nothing')
  })
}

const clear = () => {
  newList = {}
  movieAdded = newList.movie = []
  imageAdded = newList.image = []
  idAdded = newList.id = []
  displayDetail = {}
  detailKeys = displayDetail.keys = []
  detailValues = displayDetail.values = []
  insertMovie.innerHTML = ''
}
