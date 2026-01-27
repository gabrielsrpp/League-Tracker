import React, { useState, useMemo, useEffect } from "react";
import iron from "../assets/ranks/iron.png";
import bronze from "../assets/ranks/bronze.png";
import silver from "../assets/ranks/silver.png";
import gold from "../assets/ranks/gold.png";
import platinum from "../assets/ranks/platinum.png";
import emerald from "../assets/ranks/emerald.png";
import diamond from "../assets/ranks/diamond.png";
import master from "../assets/ranks/master.png";
import grandmaster from "../assets/ranks/grandmaster.png";
import challenger from "../assets/ranks/challenger.png";
import unranked from "../assets/ranks/unranked.png";
import { useNavigate } from "react-router-dom";
import { Routing } from "../interface/Routing";

// Definindo tipos
interface Props {
    summoner: any;
    ranks: any[];
    matches: any[];
    championMastery: any[];
    onPlayerClick?: (gameName: string, tagLine: string, routing?: Routing) => void;
}

interface ChampionIdMap {
    [key: number]: string;
}

interface ChampionStats {
    championName: string;
    wins: number;
    losses: number;
    games: number;
    kills: number;
    deaths: number;
    assists: number;
    lastPlayed: number;
}

const PlayerProfile = ({ summoner, ranks, matches, championMastery, onPlayerClick }: Props) => {
    const [activeTab, setActiveTab] = useState<"matches" | "champions" | "mastery">("matches");
    const [queueFilter, setQueueFilter] = useState<"all" | 420 | 440 | 450>("all");
    const [expandedMatch, setExpandedMatch] = useState<string | null>(null);
    const [patchVersion, setPatchVersion] = useState<string>("16.2.1");
    const [gameData, setGameData] = useState<{
        champions: ChampionIdMap;
        summonerSpells: { [key: number]: string };
        items: { [key: number]: string };
    }>({
        champions: {},
        summonerSpells: {},
        items: {}
    });
    
    const navigate = useNavigate();
    
    const soloQ = ranks.find((r: any) => r.queueType === "RANKED_SOLO_5x5");
    
    const rankImages: { [key: string]: string } = {
        IRON: iron,
        BRONZE: bronze,
        SILVER: silver,
        GOLD: gold,
        PLATINUM: platinum,
        EMERALD: emerald,
        DIAMOND: diamond,
        MASTER: master,
        GRANDMASTER: grandmaster,
        CHALLENGER: challenger,
        UNRANKED: unranked
    };

    // Carregar dados da versão mais recente
    useEffect(() => {
        const fetchGameData = async () => {
            try {
                // Buscar versão mais recente
                const versionsRes = await fetch("https://ddragon.leagueoflegends.com/api/versions.json");
                const versions = await versionsRes.json();
                const latestVersion = versions[0];
                setPatchVersion(latestVersion);
                
                // Buscar dados de campeões
                const championsRes = await fetch(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`);
                const championsData = await championsRes.json();
                
                // Criar mapeamento de ID para nome
                const championMap: ChampionIdMap = {};
                Object.values(championsData.data).forEach((champ: any) => {
                    championMap[parseInt(champ.key)] = champ.id;
                });
                
                // Buscar feitiços de invocador
                const spellsRes = await fetch(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/summoner.json`);
                const spellsData = await spellsRes.json();
                
                const spellsMap: { [key: number]: string } = {};
                Object.values(spellsData.data).forEach((spell: any) => {
                    spellsMap[parseInt(spell.key)] = spell.id;
                });
                
                // Buscar itens
                const itemsRes = await fetch(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/item.json`);
                const itemsData = await itemsRes.json();
                
                const itemsMap: { [key: number]: string } = {};
                Object.entries(itemsData.data).forEach(([key, item]: [string, any]) => {
                    itemsMap[parseInt(key)] = item.image.full;
                });
                
                setGameData({
                    champions: championMap,
                    summonerSpells: spellsMap,
                    items: itemsMap
                });
                
            } catch (error) {
                console.error("Erro ao carregar dados do jogo:", error);
                // Fallback para dados estáticos se a API falhar
                const staticChampionIdToName: ChampionIdMap = {
                    1: "Annie", 2: "Olaf", 3: "Galio", 4: "TwistedFate", 5: "XinZhao",
                    6: "Urgot", 7: "LeBlanc", 8: "Vladimir", 9: "Fiddlesticks", 10: "Kayle",
                    11: "MasterYi", 12: "Alistar", 13: "Ryze", 14: "Sion", 15: "Sivir",
                    16: "Soraka", 17: "Teemo", 18: "Tristana", 19: "Warwick", 20: "Nunu",
                    21: "MissFortune", 22: "Ashe", 23: "Tryndamere", 24: "Jax", 25: "Morgana",
                    26: "Zilean", 27: "Singed", 28: "Evelynn", 29: "Twitch", 30: "Karthus",
                    31: "Chogath", 32: "Amumu", 33: "Rammus", 34: "Anivia", 35: "Shaco",
                    36: "DrMundo", 37: "Sona", 38: "Kassadin", 39: "Irelia", 40: "Janna",
                    41: "Gangplank", 42: "Corki", 43: "Karma", 44: "Taric", 45: "Veigar",
                    48: "Trundle", 50: "Swain", 51: "Caitlyn", 53: "Blitzcrank", 54: "Malphite",
                    55: "Katarina", 56: "Nocturne", 57: "Maokai", 58: "Renekton", 59: "JarvanIV",
                    60: "Elise", 61: "Orianna", 62: "Wukong", 63: "Brand", 64: "LeeSin",
                    67: "Vayne", 68: "Rumble", 69: "Cassiopeia", 72: "Skarner", 74: "Heimerdinger",
                    75: "Nasus", 76: "Nidalee", 77: "Udyr", 78: "Poppy", 79: "Gragas",
                    80: "Pantheon", 81: "Ezreal", 82: "Mordekaiser", 83: "Yorick", 84: "Akali",
                    85: "Kennen", 86: "Garen", 89: "Leona", 90: "Malzahar", 91: "Talon",
                    92: "Riven", 96: "KogMaw", 98: "Shen", 99: "Lux", 101: "Xerath",
                    102: "Shyvana", 103: "Ahri", 104: "Graves", 105: "Fizz", 106: "Volibear",
                    107: "Rengar", 110: "Varus", 111: "Nautilus", 112: "Viktor", 113: "Sejuani",
                    114: "Fiora", 115: "Ziggs", 117: "Lulu", 119: "Draven", 120: "Hecarim",
                    121: "Khazix", 122: "Darius", 126: "Jayce", 127: "Lissandra", 131: "Diana",
                    133: "Quinn", 134: "Syndra", 136: "AurelionSol", 141: "Kayn", 142: "Zoe",
                    143: "Zyra", 145: "Kaisa", 147: "Seraphine", 150: "Gnar", 154: "Zac",
                    157: "Yasuo", 161: "Velkoz", 163: "Taliyah", 164: "Camille", 166: "Akshan",
                    200: "Belveth", 201: "Braum", 202: "Jhin", 203: "Kindred", 221: "Zeri",
                    222: "Jinx", 223: "TahmKench", 233: "Briar", 234: "Viego", 235: "Senna",
                    236: "Lucian", 238: "Zed", 240: "Kled", 245: "Ekko", 246: "Qiyana",
                    254: "Vi", 266: "Aatrox", 267: "Nami", 268: "Azir", 350: "Yuumi",
                    360: "Samira", 412: "Thresh", 420: "Illaoi", 421: "RekSai", 427: "Ivern",
                    429: "Kalista", 432: "Bard", 497: "Rakan", 498: "Xayah", 516: "Ornn",
                    517: "Sylas", 518: "Neeko", 523: "Aphelios", 526: "Rell", 555: "Pyke",
                    711: "Vex", 777: "Yone", 875: "Sett", 876: "Lillia", 887: "Gwen",
                    888: "Renata", 895: "Nilah", 897: "KSante", 901: "Smolder", 902: "Milio",
                    910: "Hwei", 950: "Naafiri", 1025: "Milio", 1026: "Smolder", 1027: "Hwei"
                };
                
                setGameData({
                    champions: staticChampionIdToName,
                    summonerSpells: {
                        21: "SummonerBarrier",
                        1: "SummonerBoost",
                        14: "SummonerDot",
                        3: "SummonerExhaust",
                        4: "SummonerFlash",
                        6: "SummonerHaste",
                        7: "SummonerHeal",
                        11: "SummonerSmite",
                        12: "SummonerTeleport",
                        32: "SummonerSnowball"
                    },
                    items: {}
                });
            }
        };
        
        fetchGameData();
    }, []);


    const handlePlayerClick = (playerName: string, playerTag?: string) => {

        const cleanName = playerName.trim();
        let name = cleanName;
        let tag = playerTag || "BR1";
        

        if (cleanName.includes('#')) {
            const parts = cleanName.split('#');
            name = parts[0];
            tag = parts[1] || "BR1";
        }
        
        console.log("🔍 Jogador clicado no PlayerProfile:", name, "#", tag);
        

        if (onPlayerClick) {
            onPlayerClick(name, tag);
        } else {

            const nextSearch = {
                gameName: name,
                tagLine: tag,
                routing: { region: "americas", platform: "br1" },
                timestamp: Date.now()
            };
            
            localStorage.setItem('pendingPlayerSearch', JSON.stringify(nextSearch));
            window.location.reload();
        }
    };


    const handleChampionIconClick = (playerName: string, playerTag?: string) => {
        handlePlayerClick(playerName, playerTag);
    };

    const filteredMatches = useMemo(() => {
        if (queueFilter === "all") return matches;
        return matches.filter((match: any) => match.info.queueId === queueFilter);
    }, [matches, queueFilter]);

    const recentChampionStats = useMemo(() => {
        const stats: { [key: string]: ChampionStats } = {};
        
        filteredMatches.forEach((match: any) => {
            const participant = match.info.participants.find((p: any) => p.puuid === summoner.puuid);
            if (!participant) return;
            
            const champName = participant.championName;
            
            if (!stats[champName]) {
                stats[champName] = { 
                    championName: champName,
                    wins: 0, 
                    losses: 0, 
                    games: 0, 
                    kills: 0, 
                    deaths: 0, 
                    assists: 0, 
                    lastPlayed: match.info.gameCreation 
                };
            }
            
            stats[champName].games++;
            stats[champName].kills += participant.kills;
            stats[champName].deaths += participant.deaths;
            stats[champName].assists += participant.assists;
            stats[champName].lastPlayed = Math.max(stats[champName].lastPlayed, match.info.gameCreation);
            
            if (participant.win) {
                stats[champName].wins++;
            } else {
                stats[champName].losses++;
            }
        });
        
        return Object.values(stats)
            .sort((a, b) => b.lastPlayed - a.lastPlayed);
    }, [filteredMatches, summoner.puuid]);

    const masteryChampionData = useMemo(() => {
        const stats: { [key: string]: { wins: number; losses: number; games: number; kills: number; deaths: number; assists: number } } = {};
        
        filteredMatches.forEach((match: any) => {
            const participant = match.info.participants.find((p: any) => p.puuid === summoner.puuid);
            if (!participant) return;
            
            const champName = participant.championName;
            
            if (!stats[champName]) {
                stats[champName] = { wins: 0, losses: 0, games: 0, kills: 0, deaths: 0, assists: 0 };
            }
            
            stats[champName].games++;
            stats[champName].kills += participant.kills;
            stats[champName].deaths += participant.deaths;
            stats[champName].assists += participant.assists;
            
            if (participant.win) {
                stats[champName].wins++;
            } else {
                stats[champName].losses++;
            }
        });

        return championMastery.map((mastery: any) => {
            const champName = gameData.champions[mastery.championId] || `Champion${mastery.championId}`;
            const champStats = stats[champName] || { wins: 0, losses: 0, games: 0, kills: 0, deaths: 0, assists: 0 };
            
            return {
                championId: mastery.championId,
                championName: champName,
                championLevel: mastery.championLevel,
                championPoints: mastery.championPoints,
                ...champStats
            };
        });
    }, [championMastery, filteredMatches, summoner.puuid, gameData.champions]);

    const getSummonerSpell = (spellId: number) => {
        return gameData.summonerSpells[spellId] || "SummonerFlash";
    };

    const getChampionImageUrl = (championName: string) => {

        const normalizedName = championName
            .replace(/\s+/g, '')
            .replace("'", "") 
            .replace(".", ""); 
        
        return `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/${normalizedName}.png`;
    };

    const getItemImageUrl = (itemId: number) => {
        if (itemId === 0 || !itemId) return null;
        
        if (gameData.items[itemId]) {
            return `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/item/${itemId}.png`;
        }
        

        return `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/item/${itemId}.png`;
    };

    const calculateWinRate = (wins: number, losses: number) => {
        const total = wins + losses;
        return total > 0 ? ((wins / total) * 100).toFixed(1) : "0.0";
    };

    const translateGameMode = (gameMode: string, queueId?: number) => {
        if (queueId === 420) return "Solo/Duo";
        if (queueId === 440) return "Flexível";
        if (queueId === 430 || queueId === 400) return "Normal";
        if (queueId === 450) return "ARAM";
        if (queueId === 1700) return "Arena";
        
        const modes: { [key: string]: string } = {
            "CLASSIC": "Ranqueada",
            "ARAM": "ARAM",
            "URF": "URF",
            "ULTBOOK": "Ultimate Spellbook",
            "CHERRY": "Arena",
            "TUTORIAL": "Tutorial",
            "PRACTICETOOL": "Modo de Prática"
        };
        return modes[gameMode] || gameMode;
    };

    const formatNumber = (num: number) => {
        return num.toLocaleString('pt-BR');
    };

    const getMVP = (participants: any[]) => {
        
        const scores = participants.map(p => {
            const kda = p.deaths > 0 ? (p.kills + p.assists) / p.deaths : p.kills + p.assists;
            
            
            const kdaScore = kda * 20;
            const damageScore = p.totalDamageDealtToChampions / 500;
            const farmScore = (p.totalMinionsKilled + p.neutralMinionsKilled) / 15;
            const visionScore = p.visionScore / 8;
            const objectiveScore = (p.objectivesStolen * 80) + (p.objectivesStolenAssists * 40);
            const participationScore = p.kills + p.assists;
            const winBonus = p.win ? 30 : 0; 
            
            const deathPenalty = p.deaths * 5;
            
            const score = kdaScore + damageScore + farmScore + visionScore + 
                         objectiveScore + participationScore + winBonus - deathPenalty;
            
            return { ...p, score };
        });
        
        return scores.reduce((prev, current) => (prev.score > current.score) ? prev : current);
    };

    const getPosition = (participant: any, participants: any[]) => {
        const teamParticipants = participants.filter((p: any) => p.teamId === participant.teamId);
        const sorted = teamParticipants.sort((a: any, b: any) => {
            const kdaA = a.deaths > 0 ? (a.kills + a.assists) / a.deaths : a.kills + a.assists;
            const kdaB = b.deaths > 0 ? (b.kills + b.assists) / b.deaths : b.kills + b.assists;
            return kdaB - kdaA;
        });
        return sorted.findIndex((p: any) => p.puuid === participant.puuid) + 1;
    };

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 flex flex-col md:flex-row gap-8">
            
            <div className="w-full md:w-[320px] space-y-4">
                
                <div className="bg-gradient-to-br from-[#1c1c1f] to-gray-900 p-8 rounded-3xl border border-gray-800 text-center shadow-2xl">
                    <div className="relative inline-block">
                        <div className="p-1.5 rounded-3xl border-2 border-blue-500 shadow-[0_0_25px_rgba(59,130,246,0.4)]">
                            <img 
                                src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/profileicon/${summoner.profileIconId}.png`} 
                                className="w-28 h-28 rounded-2xl"
                                alt="Icon"
                                onError={(e) => {
                                    e.currentTarget.src = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${summoner.profileIconId}.jpg`;
                                }}
                            />
                        </div>
                        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-1 rounded-full text-xs font-black text-white border border-blue-500 shadow-lg">
                            Nível {summoner.summonerLevel}
                        </span>
                    </div>
                    
                    <h1 className="text-2xl font-black mt-8 mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent tracking-tight">
                        {summoner.name}
                    </h1>
                    
                    <div className="inline-flex items-center gap-2 bg-gray-900/50 px-4 py-2 rounded-full border border-gray-700">
                        <span className="text-xs text-gray-400 font-medium">
                            {summoner.originalName || summoner.name}
                        </span>
                        <span className="text-blue-400 font-bold">#</span>
                        <span className="text-xs text-gray-300 font-bold">
                            {summoner.originalTag || "BR1"}
                        </span>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-[#1c1c1f] to-gray-900 p-6 rounded-3xl border border-gray-800 shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-[12px] font-black text-gray-300 uppercase tracking-widest">
                            Ranked Solo/Duo
                        </h3>
                        <span className="text-[10px] text-gray-500 font-bold">
                            Temporada {new Date().getFullYear()}
                        </span>
                    </div>
                    
                    <div className="flex flex-col items-center">
                        <div className="w-60 h-30 flex items-center justify-center mb-4 transition-transform hover:scale-105 duration-300">
                            {soloQ ? (
                                <img 
                                    src={rankImages[soloQ.tier?.toUpperCase()] || unranked}
                                    className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(59,130,246,0.4)]" 
                                    alt={`${soloQ.tier} ${soloQ.rank}`}
                                    onError={(e) => {
                                        e.currentTarget.src = `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-emblem/emblem-${soloQ.tier?.toLowerCase() || 'unranked'}.png`;
                                    }}
                                />
                            ) : (
                                <img 
                                    src={unranked}
                                    className="w-40 h-40 object-contain opacity-60" 
                                    alt="Unranked"
                                />
                            )}
                        </div>
                        
                        {soloQ ? (
                            <div className="text-center w-full">
                                <div className="mb-4">
                                    <p className="text-xl font-black uppercase tracking-tighter bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                                        {soloQ.tier} {soloQ.rank}
                                    </p>
                                    <p className="text-blue-400 font-bold text-lg mt-1">{soloQ.leaguePoints} LP</p>
                                </div>
                                <div className="flex justify-center gap-4 mb-4">
                                    <div className="text-center">
                                        <p className="text-green-500 font-bold text-lg">{soloQ.wins}</p>
                                        <p className="text-[10px] text-gray-500 uppercase">Vitórias</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-red-500 font-bold text-lg">{soloQ.losses}</p>
                                        <p className="text-[10px] text-gray-500 uppercase">Derrotas</p>
                                    </div>
                                </div>
                                <div className="w-full">
                                    <p className="text-[11px] text-gray-400 mb-2 font-medium">
                                        Win Rate: <span className="text-white font-bold">{calculateWinRate(soloQ.wins, soloQ.losses)}%</span>
                                    </p>
                                    <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-green-500 to-green-400"
                                            style={{ width: `${calculateWinRate(soloQ.wins, soloQ.losses)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center">
                                <p className="text-gray-300 font-black text-lg uppercase mb-2">Unranked</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1">
                <div className="flex gap-2 mb-6 bg-[#1c1c1f] p-1 rounded-2xl border border-gray-800">
                    <button 
                        onClick={() => setActiveTab("matches")}
                        className={`flex-1 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                            activeTab === "matches" 
                            ? "bg-blue-600 text-white shadow-lg" 
                            : "text-gray-500 hover:text-gray-300"
                        }`}
                    >
                        Partidas
                    </button>
                    <button 
                        onClick={() => setActiveTab("champions")}
                        className={`flex-1 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                            activeTab === "champions" 
                            ? "bg-blue-600 text-white shadow-lg" 
                            : "text-gray-500 hover:text-gray-300"
                        }`}
                    >
                        Campeões
                    </button>
                    <button 
                        onClick={() => setActiveTab("mastery")}
                        className={`flex-1 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                            activeTab === "mastery" 
                            ? "bg-blue-600 text-white shadow-lg" 
                            : "text-gray-500 hover:text-gray-300"
                        }`}
                    >
                        Maestria
                    </button>
                </div>

                {activeTab === "matches" ? (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-gray-300 font-black text-[12px] uppercase tracking-widest mb-1">
                                    Histórico Recente
                                </h3>
                                <p className="text-[11px] text-gray-500">
                                    {queueFilter === "all" ? `Últimas ${Math.min(matches.length, 20)} partidas` : `${filteredMatches.length} partidas filtradas`}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setQueueFilter("all")}
                                    className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-full transition-all ${
                                        queueFilter === "all"
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-900 text-gray-500 hover:text-gray-300"
                                    }`}
                                >
                                    Todas
                                </button>
                                <button
                                    onClick={() => setQueueFilter(420)}
                                    className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-full transition-all ${
                                        queueFilter === 420
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-900 text-gray-500 hover:text-gray-300"
                                    }`}
                                >
                                    Solo/Duo
                                </button>
                                <button
                                    onClick={() => setQueueFilter(440)}
                                    className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-full transition-all ${
                                        queueFilter === 440
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-900 text-gray-500 hover:text-gray-300"
                                    }`}
                                >
                                    Flex
                                </button>
                                <button
                                    onClick={() => setQueueFilter(450)}
                                    className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-full transition-all ${
                                        queueFilter === 450
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-900 text-gray-500 hover:text-gray-300"
                                    }`}
                                >
                                    ARAM
                                </button>
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            {filteredMatches.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 font-bold">Nenhuma partida encontrada para este modo</p>
                                </div>
                            ) : (
                                filteredMatches.slice(0, 20).map((match: any, index: number) => {
                                    const participant = match.info.participants.find((p: any) => p.puuid === summoner.puuid);
                                    if (!participant) return null;

                                    const win = participant.win;
                                    const kda = participant.deaths > 0 
                                        ? ((participant.kills + participant.assists) / participant.deaths).toFixed(2) 
                                        : (participant.kills + participant.assists).toFixed(1);

                                    const gameDuration = Math.floor(match.info.gameDuration / 60);
                                    const gameSeconds = match.info.gameDuration % 60;
                                    const formattedDate = new Date(match.info.gameCreation).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
                                    
                                    const mvp = getMVP(match.info.participants);
                                    const isMVP = mvp.puuid === summoner.puuid;
                                    const matchId = match.metadata.matchId || index.toString();
                                    const isExpanded = expandedMatch === matchId;

                                    const blueTeam = match.info.participants.filter((p: any) => p.teamId === 100);
                                    const redTeam = match.info.participants.filter((p: any) => p.teamId === 200);

                                    return (
                                        <div key={matchId} className="relative">
                                            <div 
                                                onClick={() => setExpandedMatch(isExpanded ? null : matchId)}
                                                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                                                    isExpanded ? 'rounded-b-none' : 'hover:scale-[1.005]'
                                                } ${win ? 'bg-gradient-to-r from-green-500/5 to-emerald-500/5 border-green-500/20' : 'bg-gradient-to-r from-red-500/5 to-pink-500/5 border-red-500/20'}`}
                                            >
                                                {isMVP && (
                                                    <div className="mvp-container">
                                                        <div className="mvp-badge">
                                                            MVP
                                                            <div className="mvp-reflection"></div>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className={`w-1 h-12 rounded-full ${win ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <img 
                                                            src={getChampionImageUrl(participant.championName)} 
                                                            className="w-14 h-14 rounded-2xl shadow-lg border-2 border-black/20" 
                                                            alt={participant.championName}
                                                            onError={(e) => {
                                                                // Fallback para campeões mais recentes
                                                                e.currentTarget.src = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${participant.championId}.png`;
                                                            }}
                                                        />
                                                        <div className="absolute -bottom-1 -right-1 bg-gray-900 rounded-full p-1 border border-gray-700">
                                                            <span className="text-[10px] font-bold text-white">{participant.champLevel}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <img 
                                                            src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/spell/${getSummonerSpell(participant.summoner1Id)}.png`} 
                                                            className="w-6 h-6 rounded border border-black/40" 
                                                            alt="S1" 
                                                        />
                                                        <img 
                                                            src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/spell/${getSummonerSpell(participant.summoner2Id)}.png`} 
                                                            className="w-6 h-6 rounded border border-black/40" 
                                                            alt="S2" 
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-black text-white truncate">{participant.championName}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${win ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'}`}>
                                                            {win ? 'VITÓRIA' : 'DERROTA'}
                                                        </span>
                                                    </div>
                                                    <p className="text-[10px] text-gray-500 mt-1">
                                                        {translateGameMode(match.info.gameMode, match.info.queueId)} • {gameDuration}:{gameSeconds.toString().padStart(2, '0')} • {formattedDate}
                                                    </p>
                                                </div>
                                                <div className="text-center px-4 sm:px-6 border-x border-gray-800/30">
                                                    <p className="text-sm font-black tabular-nums">
                                                        <span className="text-white">{participant.kills}</span>
                                                        <span className="text-white mx-1.5">/</span>
                                                        <span className="text-red-500">{participant.deaths}</span>
                                                        <span className="text-white mx-1.5">/</span>
                                                        <span className="text-white">{participant.assists}</span>
                                                    </p>
                                                    <p className={`text-[10px] font-bold mt-1 ${Number(kda) >= 3 ? 'text-green-500' : 'text-gray-300'}`}>{kda} KDA</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="hidden sm:grid grid-cols-3 gap-1">
                                                        {[participant.item0, participant.item1, participant.item2, participant.item3, participant.item4, participant.item5].map((itemId, i) => (
                                                            <div key={i} className="w-7 h-7 rounded-md bg-gray-900 border border-white/5">
                                                                {itemId !== 0 && (
                                                                    <img 
                                                                        src={getItemImageUrl(itemId) || ""}
                                                                        className="w-full h-full object-cover rounded" 
                                                                        alt="item"
                                                                        onError={(e) => e.currentTarget.style.display = 'none'} 
                                                                    />
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="w-7 h-7 rounded-md bg-gray-900 border border-white/5 self-start">
                                                        {participant.item6 !== 0 && (
                                                            <img 
                                                                src={getItemImageUrl(participant.item6) || ""}
                                                                className="w-full h-full object-cover rounded" 
                                                                alt="ward"
                                                                onError={(e) => e.currentTarget.style.display = 'none'}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* DETALHES EXPANDIDOS DA PARTIDA */}
                                            {isExpanded && (
                                                <div className="bg-[#1c1c1f] border border-gray-800 border-t-0 rounded-b-2xl p-6 space-y-4 expanded-match-details">
                                                    {/* TIME AZUL */}
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                                                            <h4 className="text-xs font-black text-blue-400 uppercase">Time Azul {match.info.teams[0]?.win ? '(Vitória)' : '(Derrota)'}</h4>
                                                        </div>
                                                        <div className="space-y-2">
                                                            {blueTeam.map((p: any, i: number) => {
                                                                const pKda = p.deaths > 0 ? ((p.kills + p.assists) / p.deaths).toFixed(2) : (p.kills + p.assists).toFixed(1);
                                                                const position = getPosition(p, blueTeam);
                                                                const isCurrentPlayer = p.puuid === summoner.puuid;
                                                                const playerDisplayName = p.riotIdGameName || p.summonerName || "Jogador";
                                                                const playerTag = p.riotIdTagline || "BR1";
                                                                
                                                                return (
                                                                    <div key={i} className={`flex items-center gap-3 p-2 rounded-xl relative ${isCurrentPlayer ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-gray-900/30'}`}>
                                                                        {/* MVP Badge - Adicionado aqui */}
                                                                        {p.puuid === mvp.puuid && (
                                                                            <div className="mvp-container expanded-match">
                                                                                <div className="mvp-badge">
                                                                                    MVP
                                                                                    <div className="mvp-reflection"></div>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        <span className="text-[10px] font-black text-gray-500 w-4">#{position}</span>
                                                                        <img 
                                                                            src={getChampionImageUrl(p.championName)} 
                                                                            className="w-8 h-8 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                                                            alt={p.championName}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleChampionIconClick(playerDisplayName, playerTag);
                                                                            }}
                                                                            onError={(e) => {
                                                                                e.currentTarget.src = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${p.championId}.png`;
                                                                            }}
                                                                        />
                                                                        <div className="flex-1 min-w-0">
                                                                            <p 
                                                                                className={`text-xs font-bold truncate cursor-pointer hover:underline transition-all ${isCurrentPlayer ? 'text-blue-400' : 'text-white hover:text-blue-300'}`}
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    handlePlayerClick(playerDisplayName, playerTag);
                                                                                }}
                                                                            >
                                                                                {playerDisplayName}
                                                                                {playerTag && playerTag !== "BR1" && (
                                                                                    <span className="text-gray-400 text-[10px] ml-1">#{playerTag}</span>
                                                                                )}
                                                                            </p>
                                                                        </div>
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="text-center">
                                                                                <p className="text-[10px] text-gray-500">KDA</p>
                                                                                <p className="text-xs font-bold text-white">{p.kills}/{p.deaths}/{p.assists}</p>
                                                                                <p className={`text-[9px] ${Number(pKda) >= 3 ? 'text-green-400' : 'text-gray-400'}`}>{pKda}</p>
                                                                            </div>
                                                                            <div className="text-center">
                                                                                <p className="text-[10px] text-gray-500">Dano</p>
                                                                                <p className="text-xs font-bold text-orange-400">{(p.totalDamageDealtToChampions / 1000).toFixed(1)}k</p>
                                                                            </div>
                                                                            <div className="text-center">
                                                                                <p className="text-[10px] text-gray-500">Farm</p>
                                                                                <p className="text-xs font-bold text-yellow-400">{p.totalMinionsKilled + p.neutralMinionsKilled}</p>
                                                                            </div>
                                                                            <div className="flex gap-1">
                                                                                {[p.item0, p.item1, p.item2, p.item3, p.item4, p.item5, p.item6].map((itemId, idx) => (
                                                                                    <div key={idx} className="w-6 h-6 rounded bg-gray-900">
                                                                                        {itemId !== 0 && (
                                                                                            <img 
                                                                                                src={getItemImageUrl(itemId) || ""}
                                                                                                className="w-full h-full rounded"
                                                                                                alt="item"
                                                                                                onError={(e) => e.currentTarget.style.display = 'none'}
                                                                                            />
                                                                                        )}
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>

                                                    {/* TIME VERMELHO */}
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <div className="w-1 h-4 bg-red-500 rounded-full"></div>
                                                            <h4 className="text-xs font-black text-red-400 uppercase">Time Vermelho {match.info.teams[1]?.win ? '(Vitória)' : '(Derrota)'}</h4>
                                                        </div>
                                                        <div className="space-y-2">
                                                            {redTeam.map((p: any, i: number) => {
                                                                const pKda = p.deaths > 0 ? ((p.kills + p.assists) / p.deaths).toFixed(2) : (p.kills + p.assists).toFixed(1);
                                                                const position = getPosition(p, redTeam);
                                                                const isCurrentPlayer = p.puuid === summoner.puuid;
                                                                const playerDisplayName = p.riotIdGameName || p.summonerName || "Jogador";
                                                                const playerTag = p.riotIdTagline || "BR1";
                                                                
                                                                return (
                                                                    <div key={i} className={`flex items-center gap-3 p-2 rounded-xl relative ${isCurrentPlayer ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-gray-900/30'}`}>
                                                                        {/* MVP Badge - Adicionado aqui */}
                                                                        {p.puuid === mvp.puuid && (
                                                                            <div className="mvp-container expanded-match">
                                                                                <div className="mvp-badge">
                                                                                    MVP
                                                                                    <div className="mvp-reflection"></div>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        <span className="text-[10px] font-black text-gray-500 w-4">#{position}</span>
                                                                        <img 
                                                                            src={getChampionImageUrl(p.championName)} 
                                                                            className="w-8 h-8 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                                                            alt={p.championName}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleChampionIconClick(playerDisplayName, playerTag);
                                                                            }}
                                                                            onError={(e) => {
                                                                                e.currentTarget.src = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${p.championId}.png`;
                                                                            }}
                                                                        />
                                                                        <div className="flex-1 min-w-0">
                                                                            <p 
                                                                                className={`text-xs font-bold truncate cursor-pointer hover:underline transition-all ${isCurrentPlayer ? 'text-blue-400' : 'text-white hover:text-blue-300'}`}
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    handlePlayerClick(playerDisplayName, playerTag);
                                                                                }}
                                                                            >
                                                                                {playerDisplayName}
                                                                                {playerTag && playerTag !== "BR1" && (
                                                                                    <span className="text-gray-400 text-[10px] ml-1">#{playerTag}</span>
                                                                                )}
                                                                            </p>
                                                                        </div>
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="text-center">
                                                                                <p className="text-[10px] text-gray-500">KDA</p>
                                                                                <p className="text-xs font-bold text-white">{p.kills}/{p.deaths}/{p.assists}</p>
                                                                                <p className={`text-[9px] ${Number(pKda) >= 3 ? 'text-green-400' : 'text-gray-400'}`}>{pKda}</p>
                                                                            </div>
                                                                            <div className="text-center">
                                                                                <p className="text-[10px] text-gray-500">Dano</p>
                                                                                <p className="text-xs font-bold text-orange-400">{(p.totalDamageDealtToChampions / 1000).toFixed(1)}k</p>
                                                                            </div>
                                                                            <div className="text-center">
                                                                                <p className="text-[10px] text-gray-500">Farm</p>
                                                                                <p className="text-xs font-bold text-yellow-400">{p.totalMinionsKilled + p.neutralMinionsKilled}</p>
                                                                            </div>
                                                                            <div className="flex gap-1">
                                                                                {[p.item0, p.item1, p.item2, p.item3, p.item4, p.item5, p.item6].map((itemId, idx) => (
                                                                                    <div key={idx} className="w-6 h-6 rounded bg-gray-900">
                                                                                        {itemId !== 0 && (
                                                                                            <img 
                                                                                                src={getItemImageUrl(itemId) || ""}
                                                                                                className="w-full h-full rounded"
                                                                                                alt="item"
                                                                                                onError={(e) => e.currentTarget.style.display = 'none'}
                                                                                            />
                                                                                        )}
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </>
                ) : activeTab === "champions" ? (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-gray-300 font-black text-[12px] uppercase tracking-widest mb-1">
                                    Campeões Jogados Recentemente
                                </h3>
                                <p className="text-[11px] text-gray-500">
                                    {queueFilter === "all" 
                                        ? `Baseado nas últimas ${matches.length} partidas` 
                                        : `Filtrado por ${queueFilter === 420 ? 'Solo/Duo' : queueFilter === 440 ? 'Flex' : 'ARAM'}`
                                    }
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setQueueFilter("all")}
                                    className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-full transition-all ${
                                        queueFilter === "all"
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-900 text-gray-500 hover:text-gray-300"
                                    }`}
                                >
                                    Todas
                                </button>
                                <button
                                    onClick={() => setQueueFilter(420)}
                                    className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-full transition-all ${
                                        queueFilter === 420
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-900 text-gray-500 hover:text-gray-300"
                                    }`}
                                >
                                    Solo/Duo
                                </button>
                                <button
                                    onClick={() => setQueueFilter(440)}
                                    className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-full transition-all ${
                                        queueFilter === 440
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-900 text-gray-500 hover:text-gray-300"
                                    }`}
                                >
                                    Flex
                                </button>
                                <button
                                    onClick={() => setQueueFilter(450)}
                                    className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-full transition-all ${
                                        queueFilter === 450
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-900 text-gray-500 hover:text-gray-300"
                                    }`}
                                >
                                    ARAM
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {recentChampionStats.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 font-bold">Nenhum campeão encontrado</p>
                                </div>
                            ) : (
                                recentChampionStats.map((champ: ChampionStats) => {
                                    const avgKDA = champ.games > 0 
                                        ? (champ.deaths > 0 
                                            ? ((champ.kills + champ.assists) / champ.deaths / champ.games).toFixed(2)
                                            : ((champ.kills + champ.assists) / champ.games).toFixed(1))
                                        : "0.0";
                                    
                                    const winRate = calculateWinRate(champ.wins, champ.losses);

                                    return (
                                        <div key={champ.championName} className="bg-gradient-to-r from-[#1c1c1f] to-gray-900 p-4 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <img 
                                                        src={getChampionImageUrl(champ.championName)} 
                                                        className="w-16 h-16 rounded-2xl shadow-lg border-2 border-blue-500/20"
                                                        alt={champ.championName}
                                                        onError={(e) => {
                                                            e.currentTarget.src = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${Object.keys(gameData.champions).find(key => gameData.champions[parseInt(key)] === champ.championName)}.png`;
                                                        }}
                                                    />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <p className="text-base font-black text-white mb-1">{champ.championName}</p>
                                                    <p className="text-[10px] text-gray-500">
                                                        Jogado recentemente
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-6">
                                                    <div className="text-center">
                                                        <p className="text-xs text-gray-500 uppercase mb-1">Partidas</p>
                                                        <p className="text-lg font-black text-white">{champ.games}</p>
                                                    </div>

                                                    <div className="text-center min-w-[80px]">
                                                        <p className="text-xs text-gray-500 uppercase mb-1">W/L</p>
                                                        <div className="flex items-center justify-center gap-2">
                                                            <span className="text-sm font-bold text-green-500">{champ.wins}V</span>
                                                            <span className="text-gray-600">/</span>
                                                            <span className="text-sm font-bold text-red-500">{champ.losses}D</span>
                                                        </div>
                                                    </div>

                                                    <div className="text-center min-w-[60px]">
                                                        <p className="text-xs text-gray-500 uppercase mb-1">WR</p>
                                                        <div className="flex flex-col items-center">
                                                            <p className={`text-sm font-black ${Number(winRate) >= 50 ? 'text-green-400' : 'text-red-400'}`}>
                                                                {winRate}%
                                                            </p>
                                                            <div className="w-12 bg-gray-800 h-1 rounded-full overflow-hidden mt-1">
                                                                <div 
                                                                    className={`h-full ${Number(winRate) >= 50 ? 'bg-green-500' : 'bg-red-500'}`}
                                                                    style={{ width: `${winRate}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="text-center">
                                                        <p className="text-xs text-gray-500 uppercase mb-1">KDA</p>
                                                        <p className={`text-sm font-black ${Number(avgKDA) >= 3 ? 'text-green-400' : 'text-gray-300'}`}>
                                                            {avgKDA}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-gray-300 font-black text-[12px] uppercase tracking-widest mb-1">
                                    Maestria de Campeões
                                </h3>
                                <p className="text-[11px] text-gray-500">
                                    Top {championMastery.length} campeões por pontos de maestria
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {masteryChampionData.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 font-bold">Nenhum campeão com maestria encontrado</p>
                                </div>
                            ) : (
                                masteryChampionData.map((champ: any) => {
                                    const avgKDA = champ.games > 0 
                                        ? (champ.deaths > 0 
                                            ? ((champ.kills + champ.assists) / champ.deaths / champ.games).toFixed(2)
                                            : ((champ.kills + champ.assists) / champ.games).toFixed(1))
                                        : "0.0";
                                    
                                    const winRate = calculateWinRate(champ.wins, champ.losses);

                                    return (
                                        <div key={champ.championId} className="bg-gradient-to-r from-[#1c1c1f] to-gray-900 p-4 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <img 
                                                        src={getChampionImageUrl(champ.championName)} 
                                                        className="w-16 h-16 rounded-2xl shadow-lg border-2 border-blue-500/20"
                                                        alt={champ.championName}
                                                        onError={(e) => {
                                                            e.currentTarget.src = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${champ.championId}.png`;
                                                        }}
                                                    />
                                                    <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full px-2 py-0.5 border border-gray-900">
                                                        <span className="text-[10px] font-black text-white">{champ.championLevel}</span>
                                                    </div>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <p className="text-base font-black text-white mb-1">{champ.championName}</p>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-[10px] text-gray-500 uppercase">Maestria:</span>
                                                            <span className="text-xs font-bold text-blue-400">{formatNumber(champ.championPoints)}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-6">
                                                    <div className="text-center">
                                                        <p className="text-xs text-gray-500 uppercase mb-1">Partidas</p>
                                                        <p className="text-lg font-black text-white">{champ.games}</p>
                                                    </div>

                                                    <div className="text-center min-w-[80px]">
                                                        <p className="text-xs text-gray-500 uppercase mb-1">W/L</p>
                                                        <div className="flex items-center justify-center gap-2">
                                                            <span className="text-sm font-bold text-green-500">{champ.wins}V</span>
                                                            <span className="text-gray-600">/</span>
                                                            <span className="text-sm font-bold text-red-500">{champ.losses}D</span>
                                                        </div>
                                                    </div>

                                                    <div className="text-center min-w-[60px]">
                                                        <p className="text-xs text-gray-500 uppercase mb-1">WR</p>
                                                        <div className="flex flex-col items-center">
                                                            <p className={`text-sm font-black ${Number(winRate) >= 50 ? 'text-green-400' : 'text-red-400'}`}>
                                                                {winRate}%
                                                            </p>
                                                            <div className="w-12 bg-gray-800 h-1 rounded-full overflow-hidden mt-1">
                                                                <div 
                                                                    className={`h-full ${Number(winRate) >= 50 ? 'bg-green-500' : 'bg-red-500'}`}
                                                                    style={{ width: `${winRate}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="text-center">
                                                        <p className="text-xs text-gray-500 uppercase mb-1">KDA</p>
                                                        <p className={`text-sm font-black ${Number(avgKDA) >= 3 ? 'text-green-400' : 'text-gray-300'}`}>
                                                            {avgKDA}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PlayerProfile;