const CinemaHub = (function () {
  const movies = [
    {
      id: 1,
      title: "The Dark Knight",
      year: 2008,
      rating: 9.0,
      genres: ["Action", "Drama"],
      poster: "./assets/images/dark-knight.JPEG",
      overview: "When the menace known as the Joker wreaks havoc...",
    },
    {
      id: 2,
      title: "Inception",
      year: 2010,
      rating: 8.8,
      genres: ["Action", "Sci-Fi"],
      poster: "./assets/images/inception.JPEG",
      overview: "A thief who steals corporate secrets through use of dream-sharing technology...",
    },
    {
      id: 3,
      title: "The Shawshank Redemption",
      year: 1994,
      rating: 9.3,
      genres: ["Drama"],
      poster: "./assets/images/shawshank.JPEG",
      overview: "Two imprisoned men bond over a number of years...",
    },
    {
      id: 4,
      title: "Parasite",
      year: 2019,
      rating: 8.6,
      genres: ["Drama", "Comedy"],
      poster: "./assets/images/parasite.JPEG",
      overview:
        "Greed and class discrimination threaten the newly formed symbiotic relationship...",
    },
    {
      id: 5,
      title: "Get Out",
      year: 2017,
      rating: 7.7,
      genres: ["Horror", "Drama"],
      poster: "./assets/images/get-out.JPEG",
      overview: "A young African-American visits his white girlfriend's parents for the weekend...",
    },
    {
      id: 6,
      title: "The Conjuring",
      year: 2013,
      rating: 7.5,
      genres: ["Horror"],
      poster: "./assets/images/conjuring.JPEG",
      overview: "Paranormal investigators Ed and Lorraine Warren work to help a family...",
    },
    {
      id: 7,
      title: "Step Brothers",
      year: 2008,
      rating: 6.9,
      genres: ["Comedy"],
      poster: "./assets/images/step-brothers.JPEG",
      overview:
        "Two aimless middle-aged losers still living at home are forced against their will to become roommates...",
    },
    {
      id: 8,
      title: "Interstellar",
      year: 2014,
      rating: 8.6,
      genres: ["Drama", "Sci-Fi"],
      poster: "./assets/images/interstellar.JPEG",
      overview: "A team of explorers travel through a wormhole in space...",
    },
    {
      id: 9,
      title: "Mad Max: Fury Road",
      year: 2015,
      rating: 8.1,
      genres: ["Action"],
      poster: "./assets/images/mad-max.JPEG",
      overview: "In a post-apocalyptic wasteland, Max teams up with Furiosa...",
    },
    {
      id: 10,
      title: "Joker",
      year: 2019,
      rating: 8.4,
      genres: ["Drama"],
      poster: "./assets/images/joker.JPEG",
      overview: "In Gotham City, a struggling comedian embarks on a downward spiral...",
    },
    {
      id: 11,
      title: "The Hangover",
      year: 2009,
      rating: 7.7,
      genres: ["Comedy"],
      poster: "./assets/images/hangover.JPEG",
      overview: "Three buddies wake up from a bachelor party in Las Vegas...",
    },
    {
      id: 12,
      title: "A Quiet Place",
      year: 2018,
      rating: 7.5,
      genres: ["Horror", "Drama"],
      poster: "./assets/images/a-quiet-place.JPEG",
      overview: "In a post-apocalyptic world, a family is forced to live in silence...",
    },
  ];

  const state = { currentPage: "home", query: "", sort: "default" };

  function el(id) {
    return document.getElementById(id);
  }

  function init() {
    bindNav();
    bindControls();
    window.addEventListener("hashchange", route);
    route();
  }

  function bindNav() {
    document.querySelectorAll(".site-nav a[data-route]").forEach((a) => {
      a.addEventListener("click", () => {
        document.querySelectorAll(".site-nav a").forEach((x) => x.classList.remove("active"));
        a.classList.add("active");
      });
    });
  }

  function bindControls() {
    const search = el("searchInput");
    if (search) {
      search.addEventListener("input", (e) => {
        state.query = e.target.value.trim().toLowerCase();
        renderCurrent();
      });
    }

    const sort = el("sortSelect");
    if (sort) {
      sort.addEventListener("change", (e) => {
        state.sort = e.target.value;
        renderCurrent();
      });
    }
  }

  function route() {
    const hash = location.hash.replace("#", "") || "home";
    state.currentPage = hash;
    renderCurrent();
  }

  function renderCurrent() {
    if (state.currentPage.startsWith("category-")) {
      const cat = state.currentPage.split("-")[1];
      renderCategory(decodeURIComponent(cat));
      return;
    }

    renderHome();
  }

  function renderHome() {
    const root = el("app");

    root.innerHTML = `
      <section class="hero container" aria-label="Latest movies" id="hero"></section>
      <section class="container">
        <div class="search-row">
          <input
            id="searchInput"
            placeholder="Search movies by title or overview..."
            aria-label="Search movies"
          />
          <div class="controls">
            <select id="sortSelect">
              <option value="default">Sort</option>
              <option value="rating_desc">Rating ↓</option>
              <option value="rating_asc">Rating ↑</option>
              <option value="year_desc">Year ↓</option>
              <option value="year_asc">Year ↑</option>
            </select>
          </div>
        </div>

        <div class="section-head"><h2>Most Watched</h2></div>
        <div id="mostWatched" class="movies-grid"></div>

        <div class="section-head"><h2>Recently Added</h2></div>
        <div id="recentAdded" class="movies-grid"></div>
      </section>
    `;

    bindControls();

    const heroEl = el("hero");
    const last3 = movies.slice(-3).reverse();

    heroEl.innerHTML = last3
      .map(
        (m) =>
          `<article class="hero-card">
            <img
              src="${m.poster}"
              alt="${m.title}"
              loading="lazy"
              onerror="this.src='./assets/images/fallback.svg'"
            />
            <div class="meta">
              <h3 style="padding:8px;color:#fff">${m.title} <small style="opacity:.8">(${m.year})</small></h3>
            </div>
          </article>`,
      )
      .join("");

    const watched = movies.slice(0).sort((a, b) => b.rating - a.rating);
    const recent = movies.slice(0).sort((a, b) => b.id - a.id);

    renderMoviesGrid(filterAndSort(watched), el("mostWatched"));
    renderMoviesGrid(filterAndSort(recent), el("recentAdded"));
  }

  function renderCategory(cat) {
    const root = el("app");

    root.innerHTML = `
      <section class="container">
        <div class="section-head"><h2>${capitalize(cat)} Movies</h2></div>

        <div class="search-row">
          <input id="searchInput" placeholder="Filter in this category..." />
          <div class="controls">
            <select id="sortSelect">
              <option value="default">Sort</option>
              <option value="rating_desc">Rating ↓</option>
              <option value="rating_asc">Rating ↑</option>
              <option value="year_desc">Year ↓</option>
              <option value="year_asc">Year ↑</option>
            </select>
          </div>
        </div>

        <div id="categoryGrid" class="movies-grid"></div>
      </section>
    `;

    bindControls();

    const catMovies = movies.filter((m) =>
      m.genres.map((g) => g.toLowerCase()).includes(cat.toLowerCase()),
    );

    renderMoviesGrid(filterAndSort(catMovies), el("categoryGrid"));
  }

  function filterAndSort(list) {
    let out = list.slice(0);

    if (state.query) {
      out = out.filter(
        (m) =>
          (m.title || "").toLowerCase().includes(state.query) ||
          (m.overview || "").toLowerCase().includes(state.query),
      );
    }

    switch (state.sort) {
      case "rating_desc":
        out.sort((a, b) => b.rating - a.rating);
        break;
      case "rating_asc":
        out.sort((a, b) => a.rating - b.rating);
        break;
      case "year_desc":
        out.sort((a, b) => b.year - a.year);
        break;
      case "year_asc":
        out.sort((a, b) => a.year - b.year);
        break;
      default:
        break;
    }

    return out;
  }

  function renderMoviesGrid(list, rootEl) {
    if (!rootEl) return;

    if (list.length === 0) {
      rootEl.innerHTML = '<p class="no-results">No movies found.</p>';
      return;
    }

    rootEl.innerHTML = list
      .map(
        (m) => `
      <article class="movie-card" tabindex="0">
        <img
          src="${m.poster}"
          alt="${m.title}"
          loading="lazy"
          onerror="this.src='./assets/images/fallback.svg'"
        />
        <div class="badge">${m.rating}</div>
        <div class="overlay"></div>
        <div class="meta">
          <h3>${m.title}</h3>
          <p>${m.year} • ${m.genres.join(", ")}</p>
        </div>
        <button class="play-btn">Play</button>
      </article>
    `,
      )
      .join("");
  }

  function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  return { init };
})();

document.addEventListener("DOMContentLoaded", () => {
  CinemaHub.init();
});
