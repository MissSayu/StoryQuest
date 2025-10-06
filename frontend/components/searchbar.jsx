import React, {useState} from "react";
import searchIcon from "../assets/search-icon.png";
import "./searchbar.css";

export default function SearchBar({placeholder="Zoeken...", onSearch}){
    const [q,setQ] = useState("");
    function submit(e){
        e.preventDefault();
        if(onSearch) onSearch(q);
    }
    return (
        <form className="searchbar" onSubmit={submit} role="search" aria-label="Zoek stories">
            <img src={searchIcon} alt="Zoek" className="search-icon"/>
            <input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder={placeholder}
                aria-label="Search input"
            />
        </form>

    );
}