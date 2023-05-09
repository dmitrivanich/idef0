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
    id: string,
    name: string,
    blocks: Block[]
}

export interface AppState { 
    diagrams: Diagram[],
    currentLevel: number,
    saveDiagram: (d:Diagram) => void,
    removeDiagram: (d:Diagram) => void,
    setCurrentLevel: (s:number) => void,
}


