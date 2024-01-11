import { useEffect, useState } from "react";
import { StarRating } from "./StarRating";
import { Loader } from "./Loader";
import { useKey } from "../hooks/useKey";

export function MovieDetails({
    selectedId,
    onCloseMovie,
    apiKey,
    onAddWatched,
    watched,
    onSetQuery,
}) {
    const [movie, setMovie] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [userRating, setUserRating] = useState("");
    const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);

    const {
        Title: title,
        Year: year,
        Poster: poster,
        Runtime: runtime,
        imdbRating,
        Plot: plot,
        Released: released,
        Actors: actors,
        Director: director,
        Genre: genre,
    } = movie;

    function handleAdd() {
        const newWatchedMovie = {
            imdbID: selectedId,
            title,
            year,
            poster,
            imdbRating: Number(imdbRating),
            runtime: Number(runtime.split(" ").at(0)),
            userRating,
        };
        onAddWatched(newWatchedMovie);
        onCloseMovie();
        onSetQuery("");
    }

    useKey("escape", onCloseMovie);

    useEffect(
        function () {
            async function getMovieDetails() {
                setIsLoading(true);
                const res = await fetch(
                    `https://www.omdbapi.com/?apikey=${apiKey}&i=${selectedId}`
                );
                const data = await res.json();
                setMovie(data);
                setIsLoading(false);
            }
            getMovieDetails();
        },
        [apiKey, selectedId]
    );

    useEffect(
        function () {
            if (!title) return;
            document.title = title;
            return () => {
                document.title = "usePopcorn";
            };
        },
        [title]
    );

    return (
        <div className="details">
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <header>
                        <button className="btn-back" onClick={onCloseMovie}>
                            &larr;
                        </button>
                        <img src={poster} alt={`Poster of ${title}`} />
                        <div className="details-overview">
                            <h2>{title}</h2>
                            <p>
                                {released} &bull; {runtime}
                            </p>
                            <p>{genre}</p>
                            <p>
                                <span>⭐</span>
                                {imdbRating} IMDb rating
                            </p>
                        </div>
                    </header>
                    <section>
                        <div className="rating">
                            {isWatched ? (
                                <p>This movie is already on your list.</p>
                            ) : (
                                <>
                                    <StarRating
                                        maxRating={10}
                                        size={2.75}
                                        onSetRating={setUserRating}
                                        className="star-rating"
                                    />
                                    <button
                                        className="btn-add"
                                        onClick={handleAdd}
                                        disabled={userRating > 0 ? false : true}
                                    >
                                        + Add to list
                                    </button>
                                </>
                            )}
                        </div>

                        <p>
                            <em>{plot}</em>
                        </p>
                        <p>
                            Starring <b>{actors}</b>
                        </p>
                        <p>
                            Directed by <b>{director}</b>
                        </p>
                    </section>
                </>
            )}
        </div>
    );
}
