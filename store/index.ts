import { writeFirebaseData } from '@/api/firebaseAPI'
import { DiagramState, Diagram, Block, AuthState} from '@/types'
import { User } from 'firebase/auth'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

//Здесь описаны глобальные стейты и методы по взаимодействию с ними,
//которые будут сохраняться в localstorage под ключом "app-storage"

export const useDiagram = create<DiagramState>()(
    devtools(//эта обёртка позволяет работать с плагином redux-devtools
        //persist сохраняет глобальные стейты в localstorage
        persist((set, get) => ({
            currentLevel: 0,
            openBlock: null,
            diagrams: [],

            clearDiagrams: () => {
                set({
                    currentLevel: 0,
                    openBlock: null,
                    diagrams: [],  
                })  
            },

            setDiagrams: (d:Diagram[]) => {
                set({diagrams:d})
            },

            saveDiagram: (d:Diagram, user:User) => {
                let isSaved = false
                let newDiagrams = get().diagrams.map(el => {
                    if(el.id === d.id){
                        isSaved = true
                        return d
                    }else return el
                })

                if(!isSaved) newDiagrams.push(d)

                writeFirebaseData(newDiagrams,user)
                set({diagrams: newDiagrams})
            },
            
            removeDiagram: (d:Diagram, user:User) => {
                let newDiagrams = get().diagrams.filter((el)=>el.id !== d.id)
                writeFirebaseData(newDiagrams, user)
                set({diagrams: newDiagrams})
            },

            setCurrentLevel: (s:number) => set({currentLevel: s}),
            setOpenBlock:(b:Block|null) => set({openBlock: b})
        }),
        {
            name: "app-storage" // name of the key, state will be saved under items
        })
    )
)



export const useAuthStore = create<AuthState>()(
    devtools(//эта обёртка позволяет работать с плагином redux-devtools
        //persist сохраняет глобальные стейты в localstorage
        persist((set, get) => ({
            user: null,

            setUser: (user: User | null) => {
                set({user: user})
            }
        }),
        {
            name: "auth-storage" // name of the key, state will be saved under items
        })
    )
)