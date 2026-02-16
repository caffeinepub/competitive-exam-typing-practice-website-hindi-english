import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Session {
    result: {
        timeTaken: bigint;
        accuracy: number;
    };
    passage: Passage;
}
export interface Passage {
    text: string;
    language: Language;
}
export enum Language {
    hindi = "hindi",
    english = "english"
}
export interface backendInterface {
    getPassagesByLanguage(language: Language): Promise<Array<Passage>>;
    recordSession(session: Session): Promise<bigint>;
}
