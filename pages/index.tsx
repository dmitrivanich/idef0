import { useEffect, useState } from "react";
import s from '@/styles/Home.module.scss'
import Link from 'next/link'
import CreateProjectForm from "@/components/CreateDiagramForm";
import { useStore } from "@/store";
import { Diagram } from "@/types";

export default function Home() {
    const diagramsFromStore = useStore(state=>state.diagrams)
    const [diagrams, setDiagrams] = useState<Diagram[]>([])
    const [isOpenForm, setIsOpenForm] = useState(false)

    useEffect(()=>{
      setDiagrams(diagramsFromStore)
    },[diagramsFromStore])

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
                </div>     
              </div>
            </div>
          }

          {isOpenForm && <CreateProjectForm close={()=>setIsOpenForm(false)}/>}
      </div>
    );
};
