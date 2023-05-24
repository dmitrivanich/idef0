import s from "@/styles/Diagram.module.scss";

import { useAuthStore, useDiagram } from "@/store";
import { Diagram } from "@/types";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

//Gesture
import { useSpring, animated } from '@react-spring/web'
import { useDrag, usePinch } from '@use-gesture/react'
//Components
import CreateDiagramForm from "@/components/DiagramForm";
import { DiagramBlocks } from "@/components/DiagramBlocks";
import { Tree } from "@/components/Tree";


export default function Diagram() {
    const router = useRouter()

    const diagrams = useDiagram(state=>state.diagrams)
    const removeDiagram = useDiagram(state=>state.removeDiagram)
    const setCurrentLevel = useDiagram(state=>state.setCurrentLevel)
    const setOpenBlock = useDiagram(state=>state.setOpenBlock)
    const user = useAuthStore(state => state.user)
    
    const [isRedactoring, setIsRedactoring] = useState(false);
    const [currentDiagram,setCurrentDiagram] = useState<Diagram|null>(null)

    const [isTree, setIsTree] = useState(true)

    useEffect(()=>{
        if(router.query.id){
            let diagram = diagrams.find(d => d.id === router.query.id)

            if(!diagram) return

            setCurrentDiagram(diagram)
        }
    },[router, diagrams])

    //GESTURE
    const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0}))

    const bind = useDrag(({ down, offset: [ox, oy] }) => api.start({ x: ox, y: oy, immediate: down}), {
        bounds: { left: -1000, right: 1000, top: -1000, bottom: 1000 },
        rubberband: true
    })

    const popup = useCallback(()=>{
        if (confirm("Вы уверены что хотите удалить диаграмму?")) {
            if(!currentDiagram || !user) return
            removeDiagram(currentDiagram, user)
            setCurrentLevel("0")
            setOpenBlock(null)
            router.push("/")
        } else return
    },[currentDiagram])

    return (
        currentDiagram && <div className={s.diagramWrapper}>
            <div className={s.content}>
                {isRedactoring && 
                    <div className={s.form}>
                        <CreateDiagramForm params={
                            {
                                "titleLabel": "Модификация диаграммы",
                                "buttonName": "Сохранить изменения",
                                "currentDiagram": currentDiagram
                            }} close={() => setIsRedactoring(false)}/>
                    </div>
                }

                <animated.div className={s.zoom_Field} {...bind()} style={{ x, y, touchAction: 'none' }} >
                    <div className={s.frame}>
                        <div className={s.tools}>
                            <div className={s.buttons}>
                                <button className={s.removeBtn} onClick={popup}>
                                     <p>Удалить</p>
                                </button>
                                <Link href={"/"}>
                                    <button className={s.backBtn}>
                                        <p>Назад</p>
                                    </button>
                                </Link>
                                <button className={s.openEditFromBtn} onClick={()=>setIsRedactoring(!isRedactoring)}><p>Модифицировать</p></button>
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
