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

    const [diagramVariant, setDiagramVariant] = useState('idef0')

    useEffect(()=>{
        if(router.query.id){
            console.log(diagrams)
            let diagram = diagrams.find(d => d.id === router.query.id)

            if(!diagram) return

            setCurrentDiagram(diagram)

            const uniqLevels: Set<number> = new Set()
            diagram?.blocks.forEach(block=> uniqLevels.add(block.level))

            setTopLevels(Array.from(uniqLevels))
        } else return

        
    },[diagrams])

    //GESTURE
    const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0}))

    const bind = useDrag(({ down, offset: [ox, oy] }) => api.start({ x: ox, y: oy, immediate: down}), {
        bounds: { left: -1000, right: 1000, top: -1000, bottom: 1000 },
        rubberband: true
    })

    return (
        currentDiagram && <div className={s.diagramWrapper}>
            <div className={s.content}>
                
                <div className={s.tools}>
                    <Link href={"/"} className={s.remove} onClick={()=>{

                        removeDiagram(currentDiagram)
                        setCurrentLevel(0)
                    }}>
                        <p>Удалить</p>
                    </Link>
                    <button className={s.edit} onClick={()=>setIsRedactoring(!isRedactoring)}><p>{isRedactoring ? "Закрыть" : "Редактировать"}</p></button>
                    <div>
                        <label>Уровень:</label>
                        <select name="level" onChange={(e)=> setCurrentLevel(+e.target.value)}>
                            {
                                topLevels.map((level,index)=>{
                                return <option key={`key-${level}-${index}`}>{level}</option>
                                })
                            }
                        </select>
                    </div>
                    <div>
                        <label>Вариант диаграммы:</label>
                        <select value={diagramVariant} name="diagramVariant" onChange={(e)=> setDiagramVariant(e.target.value)}>
                            <option>idef0</option>
                            <option>tree</option>
                        </select>
                    </div>
                </div>

                {isRedactoring && 
                    <div className={s.form}>
                        <CreateDiagramForm params={
                            {
                                "titleLabel": "Редактирование диаграммы",
                                "buttonName": "Сохранить изменения",
                                "currentDiagram": currentDiagram
                            }}/>
                    </div>
                }

                <animated.div className={s.zoom_Field} {...bind()} style={{ x, y, touchAction: 'none' }} >
                    {diagramVariant === "idef0" && <DiagramBlocks diagram={currentDiagram}/>}
                    {diagramVariant === "tree" && <Tree diagram={currentDiagram}/>}
                </animated.div>

            </div>
        </div>
    );
};
