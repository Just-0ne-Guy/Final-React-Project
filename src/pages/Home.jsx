import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { searchMovies } from "../lib/omdb";

export default function Home() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const [totalResults, setTotalResults] = useState(0);
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalResults / 10)),
    [totalResults],
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPage = async (q, p) => {
    const clean = q.trim();
    if (!clean) {
      setError("type something to search");
      setMovies([]);
      setTotalResults(0);
      return;
    }

    setLoading(true);
    setError("");
    const { results, totalResults, error } = await searchMovies(clean, p);
    setMovies(results);
    setTotalResults(totalResults);
    if (error) setError(error);

    requestAnimationFrame(() => {
      document.getElementById("movies")?.scrollIntoView({ behavior: "smooth" });
    });

    setLoading(false);
  };

  const onSearch = () => {
    setPage(1);
    fetchPage(query, 1);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") onSearch();
  };

  const goNext = () => {
    if (loading) return;
    if (page >= totalPages) return;

    const nextPage = page + 1;
    setPage(nextPage);
    fetchPage(query, nextPage);
  };

  const goBack = () => {
    if (loading) return;
    if (page <= 1) return;

    const prevPage = page - 1;
    setPage(prevPage);
    fetchPage(query, prevPage);
  };

  useEffect(() => {
    if (error) setError("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <>
      <section id="landing">
        <div className="row nav__row">
          <nav>
            <figure>
              <img
                className="logo__img"
                src="/assets/212569fb-9f1d-4667-95ad-768af8d1abc4.png"
                alt="Flixly logo"
              />
            </figure>

            <div className="links__container">
              <ul className="nav__links">
                <li>
                  <a
                    href="#"
                    className="nav__link link__hover-effect link__hover-effect--red"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#movies"
                    className="nav__link link__hover-effect link__hover-effect--red"
                  >
                    Find your movie
                  </a>
                </li>
                <li>
                  <a href="#" className="nav__link nav__link--primary">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="container">
          <div className="row row__narrow">
            <figure>
              <img
                className="logo__header--img"
                src="/assets/212569fb-9f1d-4667-95ad-768af8d1abc4.png"
                alt="Flixly"
              />
            </figure>

            <div className="search__movie">
              <div
                className={`header__search projector ${isSearchFocused ? "projector--on" : ""}`}
              >
                <span
                  className="projector__plate projector__plate--big"
                  aria-hidden="true"
                />
                <span
                  className="projector__plate projector__plate--small"
                  aria-hidden="true"
                />

                <span
                  className="projector__reel projector__reel--big"
                  aria-hidden="true"
                />
                <span
                  className="projector__reel projector__reel--small"
                  aria-hidden="true"
                />

                <span
                  className="projector__reel projector__reel--big"
                  aria-hidden="true"
                />
                <span
                  className="projector__reel projector__reel--small"
                  aria-hidden="true"
                />
                <span className="projector__beam" aria-hidden="true" />

                <input
                  className="search--input"
                  type="text"
                  placeholder="Search for a movie..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />

                <button
                  className="search--btn"
                  onClick={onSearch}
                  disabled={loading}
                >
                  {loading ? "Searching..." : "Search"}
                </button>
              </div>

              {error && <p style={{ marginTop: 12 }}>{error}</p>}
            </div>
          </div>
        </div>
      </section>

      <section id="movies">
        <div className="searched__movies">
          {movies.map((m, idx) => (
            <MovieCard key={m.imdbID} movie={m} index={idx} />
          ))}

          {!loading && !error && movies.length === 0 && (
            <p style={{ marginTop: 12 }}>
              search something above to see results
            </p>
          )}
        </div>

        {movies.length > 0 && (
          <div className="movie__buttons">
            <button
              className="back__btn"
              onClick={goBack}
              disabled={loading || page <= 1}
            >
              Back
            </button>
            <button
              className="next__btn"
              onClick={goNext}
              disabled={loading || page >= totalPages}
            >
              Next
            </button>
          </div>
        )}

        {totalResults > 0 && (
          <p style={{ textAlign: "center", marginTop: 10 }}>
            page {page} of {totalPages} • {totalResults} results
          </p>
        )}
      </section>

      <footer>
        <div className="row footer__row">
          <a href="#" className="footer__anchor">
            <figure className="footer__logo">
              <img
                src="/assets/212569fb-9f1d-4667-95ad-768af8d1abc4.png"
                className="logo__img"
                alt="Flixly"
              />
            </figure>
            <span className="footer__logo--popper">
              Top <i className="fa-solid fa-arrow-up"></i>
            </span>
          </a>

          <div className="footer__social--list">
            <a
              href="#"
              className="footer__social--link link__hover-effect link__hover-effect--red"
            >
              Home
            </a>
            <a
              href="#movies"
              className="footer__social--link link__hover-effect link__hover-effect--red"
            >
              Movies
            </a>
            <a
              href="#"
              className="footer__social--link link__hover-effect link__hover-effect--red"
            >
              Contact
            </a>
          </div>

          <div className="footer__copyright">Copyright © 2025 Flixly</div>
        </div>
      </footer>
    </>
  );
}

function MovieCard({ movie, index }) {
  const poster =
    movie.Poster && movie.Poster !== "N/A"
      ? movie.Poster
      : "https://via.placeholder.com/300x450?text=No+Poster";

  return (
    <Link
      id={`movie-${index}`}
      to={`/movie/${movie.imdbID}`}
      className="movieCard"
    >
      <div className="movieCard__posterWrap">
        <img className="movieCard__poster" src={poster} alt={movie.Title} />
      </div>

      <div className="movieCard__text">
        <h3 className="movieCard__title">{movie.Title}</h3>
        <p className="movieCard__year">Year: {movie.Year}</p>
        <p className="movieCard__year">{movie.Type}</p>
      </div>
    </Link>
  );
}
