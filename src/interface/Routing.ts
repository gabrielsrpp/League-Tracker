export interface Routing {
    region: string;
    platform: string;
}

export interface ServerOption {
    id: number;
    label: string;
    value: Routing;
}