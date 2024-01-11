import { useState, useEffect } from "react";

export function useLocalStorage(initialState, key) {
    const [watched, setWatched] = useState(handleStoredMovies);

    function handleStoredMovies() {
        const storedValue = localStorage.getItem(key);
        return JSON.parse(storedValue) || initialState;
    }
    useEffect(
        function () {
            localStorage.setItem(key, JSON.stringify(watched));
        },
        [watched, key]
    );
    return [watched, setWatched];
}
