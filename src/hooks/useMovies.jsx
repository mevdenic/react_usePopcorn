import { useEffect, useState } from "react";

const apiKey = "9947a1af";

export function useMovies(query) {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(
        function () {
            // callback?.();

            const controller = new AbortController();

            async function fetchMovies() {
                try {
                    setError("");
                    setIsLoading(true);
                    const res = await fetch(
                        `https://www.omdbapi.com/?apikey=${apiKey}&s=${query}`,
                        {
                            signal: controller.signal,
                        }
                    );
                    if (!res.ok) throw new Error("Somemthing went wrong with fetching movies.");
                    const data = await res.json();
                    if (data.Response === "False") {
                        setMovies([]);
                        throw new Error("Movie not found.");
                    }
                    setMovies(data.Search);
                    setIsLoading(false);
                    setError("");
                } catch (err) {
                    if (err.name !== "AbortError") {
                        setError(err.message);
                        console.error(err.message);
                    }
                } finally {
                    setIsLoading(false);
                }
            }
            if (!query.length) {
                setMovies([]);
                setError("");
                return;
            }
            // handleCloseMovie();
            fetchMovies();

            return function () {
                controller.abort();
            };
        },
        [query]
    );
    return { movies, isLoading, error, apiKey };
}
