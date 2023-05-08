import { AppState, Diagram } from '@/types'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

//Здесь описаны глобальные стейты и методы по взаимодействию с ними,
//которые будут сохраняться в localstorage под ключом "app-storage"

export const useStore = create<AppState>()(
    devtools(//эта обёртка позволяет работать с плагином redux-devtools
        //persist сохраняет глобальные стейты в localstorage
        persist((set, get) => ({
            currentLevel: 0,
            diagrams: [],
            currentDiagram: null,
            setCurrentDiagram: (d:Diagram) => set({currentDiagram: d}),
            setCurrentLevel: (s:number) => set({currentLevel: s})
        }),
        {
            name: "app-storage" // name of the key, state will be saved under items
        })
    )
)