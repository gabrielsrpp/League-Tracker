import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import PlayerProfile from "../components/PlayerProfile";
import { Routing } from "../interface/Routing";

const Home = () => {
    const [summoner, setSummoner] = useState<any>(null);
    const [ranks, setRanks] = useState<any[]>([]);
    const [matches, setMatches] = useState<any[]>([]);
    const [championMastery, setChampionMastery] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);

    // Efeito para verificar busca pendente no localStorage
    useEffect(() => {
        const checkPendingSearch = () => {
            const pendingSearch = localStorage.getItem('pendingPlayerSearch');
            if (pendingSearch) {
                try {
                    const searchData = JSON.parse(pendingSearch);
                    console.log("🔍 Busca pendente detectada:", searchData);
                    
                    // Remove do localStorage para não executar novamente
                    localStorage.removeItem('pendingPlayerSearch');
                    
                    // Executa a busca
                    handleSearch(
                        searchData.gameName, 
                        searchData.tagLine, 
                        searchData.routing
                    );
                } catch (error) {
                    console.error("❌ Erro ao processar busca pendente:", error);
                }
            }
        };

        checkPendingSearch();
        
        // Verificar se há parâmetros na URL
        const params = new URLSearchParams(window.location.search);
        const gameName = params.get('gameName');
        const tagLine = params.get('tagLine');
        const region = params.get('region') || 'americas';
        const platform = params.get('platform') || 'br1';
        
        if (gameName && tagLine) {
            console.log("🔍 Parâmetros da URL detectados:", gameName, tagLine);
            handleSearch(gameName, tagLine, { region, platform });
        }
    }, []);

    const handleSearch = async (gameName: string, tagLine: string, routing: Routing) => {
        setLoading(true);
        setSearchError(null);
        setSummoner(null);
        setRanks([]);
        setMatches([]);
        setChampionMastery([]);
        
        try {
            console.log("🔍 Buscando:", gameName, tagLine, routing);
            
            // 1. Busca os dados da conta (PUUID)
            const userRes = await axios.get("http://localhost:3000/api/v1/userData", {
                params: { 
                    gamename: gameName, 
                    tagline: tagLine, 
                    region: routing.region 
                }
            });

            console.log("✅ User data:", userRes.data);
            const puuid = userRes.data.puuid;

            if (!puuid) {
                throw new Error("PUUID não encontrado");
            }

            // 2. Busca dados do invocador
            const summonerRes = await axios.get("http://localhost:3000/api/v1/summonerData", { 
                params: { 
                    puuid, 
                    platform: routing.platform 
                } 
            });

            console.log("✅ Summoner data:", summonerRes.data);

            // 3. Busca os dados de RANK usando PUUID diretamente
            const rankRes = await axios.get("http://localhost:3000/api/v1/rankData", {
                params: { 
                    puuid: puuid,
                    platform: routing.platform 
                }
            });

            console.log("✅ Rank data:", rankRes.data);

            // 4. Busca histórico de partidas
            const matchesRes = await axios.get("http://localhost:3000/api/v1/matchHistory", { 
                params: { 
                    puuid, 
                    region: routing.region 
                } 
            });

            console.log("✅ Matches encontradas:", matchesRes.data.length);

            // 5. Busca maestria de campeões
            const masteryRes = await axios.get("http://localhost:3000/api/v1/championMastery", {
                params: {
                    puuid,
                    platform: routing.platform
                }
            });

            console.log("✅ Maestria encontrada:", masteryRes.data.length);

            // Atualiza os estados
            setSummoner({ 
                ...summonerRes.data,
                puuid: puuid,
                name: summonerRes.data.name,
                originalName: gameName,
                originalTag: tagLine,
                originalRegion: routing.region,
                originalPlatform: routing.platform
            });
            setRanks(Array.isArray(rankRes.data) ? rankRes.data : []);
            setMatches(Array.isArray(matchesRes.data) ? matchesRes.data : []);
            setChampionMastery(Array.isArray(masteryRes.data) ? masteryRes.data : []);

            // Salvar busca no localStorage
            const recentPlayer = {
                gameName,
                tagLine,
                routing,
                profileIconId: summonerRes.data.profileIconId,
                regionLabel: routing.region
            };

            const existingHistory = JSON.parse(localStorage.getItem("recent_searches") || "[]");
            
            const updatedHistory = [
                recentPlayer,
                ...existingHistory.filter((p: any) => !(
                    p.gameName.toLowerCase() === gameName.toLowerCase() && 
                    p.tagLine.toLowerCase() === tagLine.toLowerCase()
                ))
            ].slice(0, 5);

            localStorage.setItem("recent_searches", JSON.stringify(updatedHistory));

            // Atualizar URL com parâmetros da busca
            const url = new URL(window.location.href);
            url.searchParams.set('gameName', gameName);
            url.searchParams.set('tagLine', tagLine);
            url.searchParams.set('region', routing.region);
            url.searchParams.set('platform', routing.platform);
            window.history.pushState({}, '', url.toString());

        } catch (error: any) {
            console.error("❌ Erro na busca:", error);
            
            if (error.response?.status === 404) {
                setSearchError("Jogador não encontrado. Verifique o nome, tag e região.");
            } else if (error.response?.status === 403) {
                setSearchError("API Key da Riot expirada ou inválida. Atualize no arquivo .env");
            } else if (error.response?.status === 429) {
                setSearchError("Muitas requisições. Aguarde alguns segundos e tente novamente.");
            } else {
                setSearchError("Erro ao buscar dados. Tente novamente.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Função chamada quando um jogador é clicado no PlayerProfile
    const handlePlayerClick = (gameName: string, tagLine: string, routing?: Routing) => {
        console.log("🔄 Nova busca disparada pelo PlayerProfile:", gameName, tagLine);
        
        // Usa o routing fornecido ou tenta determinar pelo summoner atual
        let searchRouting: Routing;
        
        if (routing) {
            searchRouting = routing;
        } else if (summoner?.originalRegion && summoner?.originalPlatform) {
            // Usa o routing do summoner atual
            searchRouting = {
                region: summoner.originalRegion,
                platform: summoner.originalPlatform
            };
        } else {
            // Usa routing padrão BR
            searchRouting = { 
                region: "americas", 
                platform: "br1" 
            };
        }
        
        // Dispara a busca
        handleSearch(gameName, tagLine, searchRouting);
    };

    return (
        <div className="bg-[#0f1113] min-h-screen font-['Inter']">
            <Navbar handleSearch={handleSearch} />
            
            {loading && (
                <div className="text-center text-white mt-12">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-xl font-bold">Buscando dados...</p>
                    <p className="text-sm text-gray-400 mt-2">Isso pode levar alguns segundos</p>
                </div>
            )}
            
            {searchError && (
                <div className="max-w-3xl mx-auto mt-8 p-6 bg-red-500/10 border border-red-500/30 rounded-2xl">
                    <p className="text-red-400 font-bold text-center">{searchError}</p>
                </div>
            )}
            
            {summoner && !loading && (
                <PlayerProfile 
                    summoner={summoner} 
                    ranks={ranks} 
                    matches={matches}
                    championMastery={championMastery}
                    onPlayerClick={handlePlayerClick}
                />
            )}
            
            {!summoner && !loading && !searchError && (
                <div className="max-w-2xl mx-auto mt-12 text-center text-gray-500">
                    <h2 className="text-xl font-bold mb-4">Tracker.gg</h2>
                    <p className="mb-2">Busque por qualquer jogador de League of Legends</p>
                    <p className="text-sm">Exemplo: <span className="text-blue-400">ID#tag</span> no servidor <span className="text-green-400">BR</span></p>
                    <div className="mt-8">
                        <p className="text-xs text-gray-600 mb-2">Jogadores recentes:</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {JSON.parse(localStorage.getItem("recent_searches") || "[]").map((player: any, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => handleSearch(player.gameName, player.tagLine, player.routing)}
                                    className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-full text-xs text-gray-300 transition-colors"
                                >
                                    {player.gameName}#{player.tagLine}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;