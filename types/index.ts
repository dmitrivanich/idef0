export interface Diagram {
    id: number,
    name: string,
    inputs: string[],
    outputs: string[],
    controllers: string[],
    mechanisms: string[],
}

export interface AppState { 
    currentDiagram: Diagram | null
    diagrams: Diagram[],
    currentLevel: string,
    setCurrent: (d:Diagram) => void
}

