// types.ts
export interface Poem {
    id: number;
    name: string;
    poem: string;
}

export interface Pivot {
    nextPoemId: number;
    nextLineStart: number;
}

export interface PivotsResponse {
    [lineNumber: string]: Pivot[];
}

export interface ParsedPoemLine {
    line: string;
    index: number;
    hasPivot: boolean;
}