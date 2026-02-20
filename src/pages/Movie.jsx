import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getMovieById, searchMovies } from "../lib/omdb";

export default function Movie() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [similar, setSimilar] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(false);

  useEffect(() => {
    let active = true;

    const run = async () => {
      setLoading(true);
      setErr("");
      setMovie(null);

      try {
        const m = await getMovieById(id);
        if (!active) return;
        setMovie(m);

        setSimilarLoading(true);

        const firstGenre = (m.Genre || "").split(",")[0]?.trim();
        const seed = firstGenre || (m.Title || "").split(" ")[0] || "movie";

        const { results } = await searchMovies(seed, 1);
        const filtered = (results || [])
          .filter((x) => x.imdbID !== id)
          .filter((x) => x.Type === "movie")
          .slice(0, 5);

        if (active) setSimilar(filtered);
      } catch (e) {
        if (active) setErr("could not load movie details");
      } finally {
        if (active) {
          setLoading(false);
          setSimilarLoading(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    };

    run();
    return () => {
      active = false;
    };
  }, [id]);

  const poster = useMemo(() => {
    if (!movie) return "";
    return movie.Poster && movie.Poster !== "N/A"
      ? movie.Poster
      : "https://via.placeholder.com/400x600?text=No+Poster";
  }, [movie]);

  if (loading) {
    return (
      <div className="moviePage__container">
        <p style={{ padding: 20 }}>loading...</p>
      </div>
    );
  }

  if (err) {
    return (
      <div className="moviePage__container">
        <p style={{ padding: 20 }}>{err}</p>
        <button style={{ marginLeft: 20 }} onClick={() => navigate("/")}>
          go back
        </button>
      </div>
    );
  }

  return (
    <div className="moviePage__container">
      <div className="moviePage__row">
        <div className="moviePage__top">
          <Link to="/" className="moviePage__brand" aria-label="Go to home">
            <img
              className="moviePage__brandLogo"
              src="/assets/212569fb-9f1d-4667-95ad-768af8d1abc4.png"
              alt="Flixly"
            />
          </Link>
        </div>

        <div className="moviePage__top">
          <button className="moviePage__back" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>

      <div className="moviePage__content">
        <div className="moviePage__posterWrap">
          <img className="moviePage__poster" src={poster} alt={movie.Title} />
        </div>

        <div className="moviePage__info">
          <h1 className="moviePage__title">{movie.Title}</h1>

          <div className="moviePage__meta">
            <span>{movie.Year}</span>
            <span>•</span>
            <span>{movie.Rated}</span>
            <span>•</span>
            <span>{movie.Runtime}</span>
          </div>

          <p className="moviePage__plot">{movie.Plot}</p>

          <div className="moviePage__grid">
            <div>
              <div className="moviePage__label">genre</div>
              <div>{movie.Genre}</div>
            </div>
            <div>
              <div className="moviePage__label">director</div>
              <div>{movie.Director}</div>
            </div>
            <div>
              <div className="moviePage__label">cast</div>
              <div>{movie.Actors}</div>
            </div>
            <div>
              <div className="moviePage__label">imdb</div>
              <div>{movie.imdbRating} / 10</div>
            </div>
          </div>
        </div>
      </div>

      <div className="moviePage__similar">
        <h2 className="moviePage__sectionTitle">Similar movies</h2>

        {similarLoading && <p>loading similar...</p>}

        <div className="movieRow">
          {similar.map((m) => (
            <Link
              key={m.imdbID}
              to={`/movie/${m.imdbID}`}
              className="movieRow__card"
            >
              <img
                className="movieRow__img"
                src={
                  m.Poster && m.Poster !== "N/A"
                    ? m.Poster
                    : "https://via.placeholder.com/300x450?text=No+Poster"
                }
                alt={m.Title}
              />
              <div className="movieRow__overlay">
                <div className="movieRow__name">{m.Title}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
