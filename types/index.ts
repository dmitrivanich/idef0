import {User} from "firebase/auth"

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
    level: string,
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

export interface DiagramState { 
    diagrams: Diagram[],
    openBlock: Block | null,
    currentLevel: string,
    clearDiagrams: () => void,
    setDiagrams: (d:Diagram[]) => void,
    saveDiagram: (d:Diagram, user:User) => void,
    removeDiagram: (d:Diagram, user:User) => void,
    setCurrentLevel: (s:string) => void,
    setOpenBlock: (b:Block|null) => void,
}

export interface AuthState {
    user: User|null,
    setUser: (user:User|null) => void
}
