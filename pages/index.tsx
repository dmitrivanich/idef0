import { useEffect, useState } from "react";
import s from '@/styles/Home.module.scss'
import Link from 'next/link'
import CreateProjectForm from "@/components/DiagramForm";
import { useAuthStore, useDiagram } from "@/store";
import { Diagram } from "@/types";


export default function Home() {
    const diagramsFromStore = useDiagram(state=>state.diagrams)
    const clearDiagrams = useDiagram(state=>state.clearDiagrams)
    const setUser = useAuthStore(state=>state.setUser)
    const [diagrams, setDiagrams] = useState<Diagram[]>([])
    const [isOpenForm, setIsOpenForm] = useState(false)
    const user = useAuthStore(state=>state.user)
    const [isLoading,setIsLoading] = useState(true)
    
    useEffect(()=>{
      if(user) {
        setIsLoading(false)
      }

      if(diagramsFromStore) {
        setDiagrams(diagramsFromStore)
      }
      
      

    },[diagramsFromStore, user])

    if(isLoading) return <></>

    return (
      <div className={s.container}>
          {
            !isOpenForm && <div className={s.inner}>
              <h1>Диаграммы:</h1>

              <div className={s.diagrams}>
                {diagrams ?
                  diagrams.map(({id, name})=> {
                    return <Link href={`diagram/${id}`} key={id} className={s.diagram}>
                      {name}
                    </Link>
                  })
                  : <p>пусто</p>
                }
              </div>

              <div className={s.tools}>
                <div>
                  <button className={s.openFormBtn} onClick={()=>setIsOpenForm(!isOpenForm)}><p>{isOpenForm ? "Закрыть" : "Создать новую"}</p></button>
                  <button className={s.resetAuthBtn} onClick={()=>{
                    setUser(null)
                    clearDiagrams()
                  }}><p>Выход из учётной записи</p></button>
                </div>     
              </div>
            </div>
          }

          {isOpenForm && <CreateProjectForm close={()=>setIsOpenForm(false)}/>}
      </div>
    );
};
