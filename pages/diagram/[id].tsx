import { useEffect, useState } from "react";
import s from "@/styles/Diagram.module.scss";
import { DiagramBlock } from "@/components/DiagramBlock";
import { useStore } from "@/store";
import { Diagram } from "@/types";

//Gesture
import { useSpring, animated } from '@react-spring/web'
import { useDrag, usePinch } from '@use-gesture/react'
import CreateDiagramForm from "@/components/CreateDiagramForm";

export default function Diagram() {
    
    const diagram = useStore(state=>state.currentDiagram)

    const [isRedactoring, setIsRedactoring] = useState(false);
    const [currentLevel, setCurrentLevel] = useState("A1");
    const [currentDiagram,setCurrentDiagram] = useState<Diagram|null>(null)

    useEffect(()=>{
        setCurrentDiagram(diagram)
    },[diagram])

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
                    <button onClick={()=>setIsRedactoring(!isRedactoring)}><p>{isRedactoring ? "Отменить" : "Редактировать"}</p></button>
                </div>

                {isRedactoring && 
                    <div className={s.form}>
                        <CreateDiagramForm params={
                            {
                                "titleLabel": "Редактирование диаграммы",
                                "buttonName": "Сохранить изменения",
                                "currentDiagram": currentDiagram
                            }} closeForm = {() => setIsRedactoring(false)}/>
                    </div>
                }
                <animated.div className={s.zoom_Field} {...bind()} style={{ x, y, touchAction: 'none' }} >
                    <DiagramBlock/> 
                </animated.div>
            </div>
        </div>
    );
};
