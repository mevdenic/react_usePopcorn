import { useRef } from "react";
import { useKey } from "../../hooks/useKey";

export function Search({ query, onSetQuery }) {
    const inputEl = useRef(null);

    useKey("enter", () => {
        if (document.activeElement === inputEl.current) return;
        inputEl.current.focus();
        onSetQuery("");
    });

    return (
        <input
            className="search"
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => onSetQuery(e.target.value)}
            ref={inputEl}
        />
    );
}
