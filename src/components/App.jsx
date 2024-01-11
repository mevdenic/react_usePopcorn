import { useState } from "react";
import "../App.css";
import { Logo } from "./NavBar Components/Logo";
import { Search } from "./NavBar Components/Search";
import { NumResults } from "./NavBar Components/NumResults";
import { Box } from "./Box";
import { MovieList } from "./MovieList";
import { WatchedList } from "./WatchedList";
import { WatchedSummary } from "./WatchedSummary";
import { Loader } from "./Loader";
import { ErrorMessage } from "./ErrorMessage";
import { MovieDetails } from "./MovieDetails";
import { useMovies } from "../hooks/useMovies";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function App() {
    const [query, setQuery] = useState("");
    const [selectedId, setSelectedId] = useState(null);
    const { movies, isLoading, error, apiKey } = useMovies(query); //fali handleCloseMovie
    const [watched, setWatched] = useLocalStorage([], "watched");

    function handleSelectMovie(id) {
        setSelectedId((selectedId) => (selectedId === id ? null : id));
    }
    function handleCloseMovie() {
        setSelectedId(null);
    }
    function handleAddWatched(movie) {
        setWatched((watched) => [...watched, movie]);
        // localStorage.setItem("watched", JSON.stringify([...watched, movie]));
    }
    function handleDeleteWatched(id) {
        setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
    }

    return (
        <>
            <nav className="nav-bar">
                <Logo />
                <div className="nav-wrapper">
                    <Search query={query} onSetQuery={setQuery} />
                    <NumResults movies={movies} />
                </div>
            </nav>
            <main className="main">
                <Box>
                    {isLoading && <Loader />}
                    {error && <ErrorMessage error={error} />}
                    {!isLoading && !error && (
                        <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
                    )}
                </Box>
                <Box>
                    {selectedId ? (
                        <MovieDetails
                            selectedId={selectedId}
                            onCloseMovie={handleCloseMovie}
                            apiKey={apiKey}
                            onAddWatched={handleAddWatched}
                            watched={watched}
                            onSetQuery={setQuery}
                        />
                    ) : (
                        <>
                            <WatchedSummary watched={watched} />
                            <WatchedList watched={watched} onDeleteWatched={handleDeleteWatched} />
                        </>
                    )}
                </Box>
            </main>
        </>
    );
}
