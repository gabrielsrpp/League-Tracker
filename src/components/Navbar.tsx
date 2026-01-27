import { Button, Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import servers from "../data/servers";
import { useState, useEffect, useRef } from "react";
import { Routing, ServerOption } from "../interface/Routing";

interface NavbarProps {
    handleSearch: (gameName: string, tagLine: string, routing: Routing) => void;
}

const Navbar = ({ handleSearch }: NavbarProps) => {
    const [selectedServer, setSelectedServer] = useState<ServerOption>(servers[0]);
    const [gameNameInput, setGameNameInput] = useState<string>("");
    const [tagLineInput, setTagLineInput] = useState<string>("");

    // Logica de sugestões
    const [recentSearches, setRecentSearches] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const openSuggestions = () => {
        const saved = JSON.parse(localStorage.getItem("recent_searches") || "[]");
        setRecentSearches(saved);
        setShowSuggestions(true);
    };

    return (
        <div className="p-6 flex justify-center border-b border-gray-800 bg-[#0f1113]">
            <div ref={containerRef} className="relative flex items-center bg-[#1c1c1f] rounded-full px-6 py-2 shadow-2xl border border-gray-700 w-full max-w-3xl transition-all hover:border-gray-600">
                <div className="mr-4 border-r border-gray-700 pr-4">
                    <Listbox value={selectedServer} onChange={setSelectedServer}>
                        <ListboxButton className="bg-transparent py-1 text-white font-black uppercase text-xs tracking-widest cursor-pointer hover:text-blue-400 transition-colors">
                            {selectedServer.label}
                        </ListboxButton>
                        <ListboxOptions anchor="bottom" className="bg-[#1c1c1f] rounded-2xl border border-gray-700 mt-3 p-2 text-white shadow-2xl min-w-[120px] z-50">
                            {servers.map((server) => (
                                <ListboxOption 
                                    key={server.id} 
                                    value={server} 
                                    className="hover:bg-blue-600 rounded-xl py-2 px-4 cursor-pointer text-xs font-bold transition-colors mb-1 last:mb-0"
                                >
                                    {server.label}
                                </ListboxOption>
                            ))}
                        </ListboxOptions>
                    </Listbox>
                </div>
                
                <div className="flex flex-1 items-center">
                    <input 
                        placeholder="Game Name" 
                        className="bg-transparent outline-none text-white w-full px-2 placeholder-gray-600 text-sm font-medium"
                        value={gameNameInput} 
                        onChange={(e) => setGameNameInput(e.target.value)}
                        onFocus={openSuggestions}
                    />
                    <span className="text-gray-700 font-bold mx-2">#</span>
                    <input 
                        placeholder="Tag" 
                        className="bg-transparent outline-none text-white w-20 px-2 placeholder-gray-600 text-sm font-medium border-r border-gray-700 mr-4"
                        value={tagLineInput} 
                        onChange={(e) => setTagLineInput(e.target.value)}
                        onFocus={openSuggestions}
                    />
                </div>

                <Button 
                    disabled={!gameNameInput || !tagLineInput}
                    onClick={() => {
                        handleSearch(gameNameInput, tagLineInput, selectedServer.value);
                        setShowSuggestions(false);
                    }}
                    className={`rounded-full py-2 px-8 font-black text-[10px] uppercase tracking-tighter transition-all shadow-lg ${
                        gameNameInput && tagLineInput 
                        ? "bg-blue-600 hover:bg-blue-500 text-white cursor-pointer active:scale-95" 
                        : "bg-gray-800 text-gray-600 cursor-not-allowed"
                    }`}
                >
                    Search
                </Button>

                {/* DROPDOWN (ESTILO DO SITE) */}
                {showSuggestions && recentSearches.length > 0 && (
                    <div className="absolute top-[110%] left-0 right-0 bg-[#1c1c1f] border border-gray-700 rounded-2xl shadow-2xl z-[100] overflow-hidden">
                        <div className="p-3 border-b border-gray-800">
                            <p className="text-[10px] font-black text-gray-500 uppercase">Pesquisas Recentes</p>
                        </div>
                        {recentSearches.map((player, i) => (
                            <div 
                                key={i}
                                onClick={() => {
                                    setGameNameInput(player.gameName);
                                    setTagLineInput(player.tagLine);
                                    handleSearch(player.gameName, player.tagLine, player.routing);
                                    setShowSuggestions(false);
                                }}
                                className="flex items-center gap-3 p-3 hover:bg-blue-600/10 cursor-pointer transition-colors border-b border-gray-800 last:border-0"
                            >
                                <img src={`https://ddragon.leagueoflegends.com/cdn/14.10.1/img/profileicon/${player.profileIconId}.png`} className="w-8 h-8 rounded-lg" />
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-white">{player.gameName} <span className="text-gray-500">#{player.tagLine}</span></span>
                                    <span className="text-[10px] text-gray-400 uppercase font-black">{player.routing.region}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;