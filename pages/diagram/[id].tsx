import { useEffect, useState } from "react";
import s from "@/styles/Diagram.module.scss";
import { DiagramBlock } from "@/components/DiagramBlock";
import { useStore } from "@/store";
import { Diagram } from "@/types";

//Gesture
import { useSpring, animated } from '@react-spring/web'
import { useDrag, usePinch } from '@use-gesture/react'

export default function Diagram() {
    
    const diagram = useStore(state=>state.currentDiagram)

    const [currentLevel, setCurrentLevel] = useState("A1");
    const [currentDiagram,setCurrentDiagram] = useState<Diagram|null>(null)

    useEffect(()=>{
        setCurrentDiagram(diagram)
    },[diagram])

    console.log(currentDiagram)

    //GESTURE
    const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0}))

    const bind = useDrag(({ down, offset: [ox, oy] }) => api.start({ x: ox, y: oy, immediate: down}), {
        bounds: { left: -1000, right: 1000, top: -1000, bottom: 1000 },
        rubberband: true
    })

    return (
        currentDiagram && <div className={s.diagramWrapper}>
            <div className={s.content}>
                <animated.div className={s.zoom_Field} {...bind()} style={{ x, y, touchAction: 'none' }} >
                    <DiagramBlock/> 
                </animated.div>
            </div>
        </div>
    );
};
