export interface Elements {
    inputs: Connect[],
    outputs: Connect[],
    controls: Connect[],
    mechanisms: Connect[],
}
  
export  interface Connect {
    name: string,
    target: Block,
    targets?: Block[],
}

export  interface Line  {
    a: Block,
    b: Block, 
    name: string
}

export interface Block{
    title: string,
    level: number,
    subLevel: number,
    inputs: string[],
    outputs: string[],
    controls: string[],
    mechanisms: string[],
}

export interface Diagram {
    id: number,
    name: string,
    blocks: Block[]
}

export interface AppState { 
    currentDiagram: Diagram | null
    diagrams: Diagram[],
    currentLevel: number,
    setCurrentDiagram: (d:Diagram) => void,
    setCurrentLevel: (s:number) => void
}

