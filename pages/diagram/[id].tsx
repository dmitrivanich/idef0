import s from "@/styles/Diagram.module.scss";

import { useStore } from "@/store";
import { Diagram } from "@/types";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

//Gesture
import { useSpring, animated } from '@react-spring/web'
import { useDrag, usePinch } from '@use-gesture/react'
//Components
import CreateDiagramForm from "@/components/CreateDiagramForm";
import { DiagramBlocks } from "@/components/DiagramBlocks";
import { Tree } from "@/components/Tree";


export default function Diagram() {
    const router = useRouter()

    const diagrams = useStore(state=>state.diagrams)
    const removeDiagram = useStore(state=>state.removeDiagram)
    const setCurrentLevel = useStore(state=>state.setCurrentLevel)
    
    const [isRedactoring, setIsRedactoring] = useState(false);
    const [currentDiagram,setCurrentDiagram] = useState<Diagram|null>(null)
    const [topLevels, setTopLevels] = useState<number[]>([])

    const [isTree, setIsTree] = useState(false)

    useEffect(()=>{
        if(router.query.id){
            console.log(diagrams)
            let diagram = diagrams.find(d => d.id === router.query.id)

            if(!diagram) return

            setCurrentDiagram(diagram)

            const uniqLevels: Set<number> = new Set()
            diagram?.blocks.forEach(block=> uniqLevels.add(block.level))

            setTopLevels(Array.from(uniqLevels))
        }
    },[router, diagrams])

    //GESTURE
    const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0}))

    const bind = useDrag(({ down, offset: [ox, oy] }) => api.start({ x: ox, y: oy, immediate: down}), {
        bounds: { left: -1000, right: 1000, top: -1000, bottom: 1000 },
        rubberband: true
    })

    return (
        currentDiagram && <div className={s.diagramWrapper}>
            <div className={s.content}>
                {isRedactoring && 
                    <div className={s.form}>
                        <CreateDiagramForm params={
                            {
                                "titleLabel": "Редактирование диаграммы",
                                "buttonName": "Сохранить изменения",
                                "currentDiagram": currentDiagram
                            }} close={() => setIsRedactoring(false)}/>
                    </div>
                }

                <animated.div className={s.zoom_Field} {...bind()} style={{ x, y, touchAction: 'none' }} >
                    <div className={s.frame}>
                        <div className={s.tools}>
                            <div className={s.level}>
                                <label>Уровень:</label>
                                <select name="level" onChange={(e)=> setCurrentLevel(+e.target.value)}>
                                    {
                                        topLevels.map((level,index)=>{
                                        return <option key={`key-${level}-${index}`}>{level}</option>
                                        })
                                    }
                                </select>
                            </div>
                            <div className={s.buttons}>
                                <button className={s.removeBtn}>
                                    <Link href={"/"} onClick={()=>{
                                        removeDiagram(currentDiagram)
                                        setCurrentLevel(0)
                                    }}>
                                        <p>Удалить</p>
                                    </Link>
                                </button>
                                <button className={s.openEditFromBtn} onClick={()=>setIsRedactoring(!isRedactoring)}><p>{isRedactoring ? "Закрыть" : "Редактировать"}</p></button>
                                <button className={s.openCreateFromBtn} onClick={()=>setIsRedactoring(!isRedactoring)}><p>{isRedactoring ? "Закрыть" : "Создать новый уровень"}</p></button>
                                <button className={s.treeBtn} onClick={()=>setIsTree(!isTree)}><p>{isTree ? "Закрыть дерево" : "Открыть дерево"}</p></button>
                            </div>
                        </div>
                        {!isTree && <DiagramBlocks diagram={currentDiagram}/>}
                        {isTree && <Tree diagram={currentDiagram} close={()=>setIsTree(false)}/>}
                    </div>
                </animated.div>

            </div>
        </div>
    );
};
