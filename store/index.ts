import { DiagramBlocks } from '@/components/DiagramBlocks'
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
            saveDiagram: (d:Diagram) => {
                let isSaved = false
                let newDiagrams = get().diagrams.map(el => {
                    if(el.id === d.id){
                        isSaved = true
                        return d
                    }else return el
                })

                if(!isSaved) newDiagrams.push(d)

                set({diagrams: newDiagrams})
            },
            removeDiagram: (d:Diagram) => {
                let newDiagrams = get().diagrams.filter((el)=>el.id !== d.id)
                
                set({diagrams: newDiagrams})
            },
            setCurrentLevel: (s:number) => set({currentLevel: s}),
        }),
        {
            name: "app-storage" // name of the key, state will be saved under items
        })
    )
)