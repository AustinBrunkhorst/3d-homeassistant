export interface AreaConfiguration {
    area_id: string;
    name: string;
}

export interface Area extends AreaConfiguration {
    entities?: string[];
}