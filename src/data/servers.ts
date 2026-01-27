import { ServerOption } from "../interface/Routing";

const servers: ServerOption[] = [
    {
        id: 1,
        label: "NA",
        value: {
            region: "americas",
            platform: "na1",
        },
    },
    {
        id: 2,
        label: "EUW",
        value: {
            region: "europe",
            platform: "euw1",
        },
    },
    {
        id: 3,
        label: "KR ( off )",
        value: {
            region: "asia",
            platform: "kr1",
        },
    },
    {
        id: 4,
        label: "BR",
        value: {
            region: "americas",
            platform: "br1",
        },
    },
];

export default servers;
