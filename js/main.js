const API_KEY = '27a4087a-518d-4d20-8d61-99735b7269fc'
const API_URL = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1'
const API_URL_SEARCH = "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";
const API_URL_MOVIE_DETAILS = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/'

const selectors = {
    movies: '[data-js-movies]',
    modal: '[data-js-modal]',
    closeButton: '[data-js-close-button]',
    form: '[data-js-form]',
    input: '[data-js-input]'
}

const moviesElement = document.querySelector(selectors.movies)
const modalElement = document.querySelector(selectors.modal)
const closeButtonElement = document.querySelector(selectors.closeButton)
const formElement = document.querySelector(selectors.form)
const inputElement = document.querySelector(selectors.input)

const initMovie = () => {
    const render = ({posterUrlPreview, nameRu, genres, rating, year, filmId}) => {
        const movieItem = document.createElement('div')

        movieItem.classList.add('movie-item')
        movieItem.setAttribute('data-js-film-id', filmId)
        movieItem.innerHTML = `
        <img src='${posterUrlPreview}' class="movie-item-poster"></img>
        <div class="movie-item__title">${nameRu}</div>
        <div class="movie-item__category">${genres.map(({genre}) => `<span>${genre}</span>`)}</div>
        <div class="movie-item__${getClass(rating)}">${rating}</div>
        <div class="movie-item__year">${year}</div>
        `
        moviesElement.append(movieItem)
    };
    document.addEventListener('click', (event) => {
        const clickedElement = event.target
        if (clickedElement.closest('[data-js-film-id]')) {
            const filmId = clickedElement.closest('[data-js-film-id]').dataset.jsFilmId;
            openModal(filmId);
        }
    })

    const getClass = (vote) => {
        if (vote > 7)  return 'green'
        if (vote > 5)  return 'yellow'
        return 'red';
    }

    fetch(API_URL, {
        headers: {
            'X-API-KEY': API_KEY,
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(data => {
            const movies = data.films;
            movies.forEach(movie => {
                const movieData = {
                    posterUrlPreview: movie.posterUrlPreview,
                    nameRu: movie.nameRu,
                    genres: movie.genres,
                    rating: movie.rating,
                    year: movie.year,
                    filmId: movie.filmId
                };
                render(movieData);
            });
        })
        .catch(err => console.log(err));

    formElement.addEventListener('submit', (event) => {
        event.preventDefault()
        moviesElement.innerHTML = ''
        const apiSearch = `${API_URL_SEARCH}${inputElement.value}`

        fetch(apiSearch, {
            headers: {
                'X-API-KEY': API_KEY,
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                const movies = data.films;
                movies.forEach(movie => {
                    const movieData = {
                        posterUrlPreview: movie.posterUrlPreview,
                        nameRu: movie.nameRu,
                        genres: movie.genres,
                        rating: movie.rating,
                        year: movie.year,
                        filmId: movie.filmId
                    };
                    render(movieData);
                });
            })
            .catch(err => console.log(err));
    })


}
const openModal = (filmId) => {
    const renderModal = ({posterUrl, nameRu, year, genres, filmLength, webUrl, description}) => {
        modalElement.classList.add('modal--show')
        modalElement.innerHTML = `
        <div class="modal-card">
            <img class="modal__movie-backdrop" src="${posterUrl}" alt="">
            <h2 class="modal__movie-descr">
                <span class="modal__movie-title">${nameRu}</span>
                <span class="modal__movie-release-year">(${year})</span>
            </h2>
            <ul class="modal__movie-info">
                <li class="modal__movie-genre">Жанры: ${genres.map(({genre}) => `<span> ${genre}</span>`)}</li>
                <li class="modal__movie-runtime">Время: ${filmLength} минут</li>
                <li>Сайт: <a class="modal__movie-site" href="${webUrl}">${webUrl}</a></li>
                <li class="modal__movie-overview">${description}</li>
            </ul>
            <button type="button" class="modal__button-close" data-js-close-button>Закрыть</button>
        </div>
    `
        document.body.classList.add("stop-scrolling")
        document.addEventListener('click', (event) => {
            if (event.target.matches(selectors.closeButton)) {
                closeModal();
            }
        });
    }

    fetch(API_URL_MOVIE_DETAILS + `${filmId}`, {
        headers: {
            'X-API-KEY': '27a4087a-518d-4d20-8d61-99735b7269fc',
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(movie => {
            const movieDit = {
                posterUrl: movie.posterUrl,
                nameRu: movie.nameRu,
                year: movie.year,
                genres: movie.genres,
                filmLength: movie.filmLength,
                webUrl: movie.webUrl,
                description: movie.description
            };
            renderModal(movieDit)
        })
        .catch(err => console.log(err))
}
    const closeModal = () => {
        modalElement.classList.remove('modal--show')
        document.body.classList.remove("stop-scrolling")
    }

    window.addEventListener('click', (event) => {
        if( event.target === modalElement) {
            closeModal()
            document.body.classList.remove("stop-scrolling")

        }
    })

initMovie()




