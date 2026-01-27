import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;
const RIOT_API_KEY = process.env.RIOT_API_KEY;

if (!RIOT_API_KEY) {
    console.error("❌ RIOT_API_KEY não carregada");
    process.exit(1);
}

app.use(cors({ origin: "http://localhost:5173" }));

const riotRequest = (url: string) =>
    axios.get(url, {
        headers: {
            "X-Riot-Token": RIOT_API_KEY,
        },
    });

/**
 * ACCOUNT (PUUID)
 */
app.get("/api/v1/userData", async (req, res) => {
    const { gamename, tagline, region } = req.query;

    try {
        const response = await riotRequest(
            `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gamename}/${tagline}`
        );
        console.log("✅ Account Data:", response.data);
        res.json(response.data);
    } catch (error: any) {
        console.error("❌ UserData error:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json({ error: "User not found" });
    }
});

/**
 * SUMMONER
 */
app.get("/api/v1/summonerData", async (req, res) => {
    const { puuid, platform } = req.query;

    try {
        const response = await riotRequest(
            `https://${platform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`
        );
        console.log("✅ Summoner Data:", response.data);
        res.json(response.data);
    } catch (error: any) {
        console.error("❌ SummonerData error:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json({ error: "Summoner not found" });
    }
});

/**
 * RANK - USANDO ENDPOINT QUE ACEITA PUUID DIRETAMENTE
 */
app.get("/api/v1/rankData", async (req, res) => {
    const { puuid, platform } = req.query;

    if (!puuid || !platform) {
        console.error("❌ Missing puuid or platform");
        return res.status(400).json({ error: "Missing parameters" });
    }

    try {
        console.log(`🔍 Buscando rank para PUUID: ${puuid} na platform: ${platform}`);
        
        const response = await riotRequest(
            `https://${platform}.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}`
        );
        
        console.log("✅ Rank Data encontrado:", response.data);
        res.json(response.data);
    } catch (error: any) {
        console.error("❌ RankData error:", {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message,
            url: error.config?.url
        });
        
        res.json([]);
    }
});

/**
 * MATCH HISTORY
 */
app.get("/api/v1/matchHistory", async (req, res) => {
    const { puuid, region } = req.query;

    try {
        const ids = await riotRequest(
            `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20`
        );

        console.log(`✅ Match IDs encontrados: ${ids.data.length}`);

        const matches = await Promise.all(
            ids.data.map((id: string) =>
                riotRequest(
                    `https://${region}.api.riotgames.com/lol/match/v5/matches/${id}`
                ).then(r => r.data).catch((err) => {
                    console.error(`❌ Erro ao buscar match ${id}:`, err.message);
                    return null;
                })
            )
        );

        const validMatches = matches.filter(Boolean);
        console.log(`✅ Matches válidas: ${validMatches.length}`);
        res.json(validMatches);
    } catch (error: any) {
        console.error("❌ MatchHistory error:", error.response?.data || error.message);
        res.json([]);
    }
});

/**
 * CHAMPION MASTERY (NOVO)
 */
app.get("/api/v1/championMastery", async (req, res) => {
    const { puuid, platform } = req.query;

    if (!puuid || !platform) {
        console.error("❌ Missing puuid or platform");
        return res.status(400).json({ error: "Missing parameters" });
    }

    try {
        console.log(`🔍 Buscando maestria para PUUID: ${puuid} na platform: ${platform}`);
        
        const response = await riotRequest(
            `https://${platform}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=10`
        );
        
        console.log("✅ Maestria encontrada:", response.data.length);
        res.json(response.data);
    } catch (error: any) {
        console.error("❌ ChampionMastery error:", error.response?.data || error.message);
        res.json([]);
    }
});

app.listen(PORT, () => {
    console.log(`✅ Riot API server rodando na porta ${PORT}`);
    console.log(`🔑 API Key carregada: ${RIOT_API_KEY?.substring(0, 10)}...`);
});