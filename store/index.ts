import { AppState, Diagram } from '@/types'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

//Здесь описаны глобальные стейты и методы по взаимодействию с ними,
//которые будут сохраняться в localstorage под ключом "app-storage"

export const useStore = create<AppState>()(
    devtools(//эта обёртка позволяет работать с плагином redux-devtools
        //persist сохраняет глобальные стейты в localstorage
        persist((set, get) => ({
            currentLevel: 'A0',
            diagrams: [],
            currentDiagram: null,
            setCurrent: (d:Diagram) => set({currentDiagram: d})
        }),
        {
            name: "app-storage" // name of the key, state will be saved under items
        })
    )
)