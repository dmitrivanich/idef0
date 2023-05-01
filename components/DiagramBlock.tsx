import Xarrow, {useXarrow, Xwrapper} from 'react-xarrows';
import s from "@/styles/DiagramBlock.module.scss";
import { Diagram } from '@/types';
import { useEffect, useState } from 'react';
import { useStore } from '@/store';

export const DiagramBlock = () => {
    const diagram = useStore(state=>state.currentDiagram)
    const [currentLevel, setCurrentLevel] = useState("A0")
    const [currentDiagram, setCurrentDiagram] = useState<Diagram|null>(null)

    useEffect(()=>{
        setCurrentDiagram(diagram)
    },[diagram])

    return (
        <div className={s.diagram}>

            <div className={s.top}>
                <div className={s.mechanisms}>
                    {currentDiagram?.mechanisms?.map((name,index)=>(
                        <div key={`key-mechanism-${currentDiagram.id}-${index}`} id={`mechanism-${currentDiagram.id}-${index}`}>
                            <p className={s.mechanism}>{name}</p>
                            
                            <Xarrow
                                start={`mechanism-${currentDiagram.id}-${index}`}
                                startAnchor="bottom"
                                endAnchor="top"
                                end={`diagramBlock-${currentDiagram?.id}`}
                                color="#353535"
                                strokeWidth={1}
                                gridBreak="80%"
                                path="grid"
                            />
                        </div>
                    ))}
                </div> 
            </div>

            <div className={s.center}>
                <div className={s.inputs}>
                    {currentDiagram?.inputs?.map((name,index)=>(
                        <div key={`key-input-${currentDiagram.id}-${index}`}>
                            <div className={s.input} id={`input-${currentDiagram.id}-${index}`}>{name}</div>
                            <Xarrow
                                start={`input-${currentDiagram.id}-${index}`}
                                startAnchor="right"
                                endAnchor="left"
                                end={`diagramBlock-${currentDiagram?.id}`}
                                color="#353535"
                                strokeWidth={1}
                                gridBreak="80%"
                                path="grid"
                            />
                        </div>
                    ))}
                </div> 

                <div className={s.block_A0} id={`diagramBlock-${currentDiagram?.id}`}>
                    <h6 className={s.name}>{currentDiagram?.name}</h6>
                    <p className={s.id}>{currentLevel}</p>
                </div>

                <div className={s.outputs}>
                    {currentDiagram?.outputs?.map((name,index)=>(
                        <div key={`key-output-${currentDiagram.id}-${index}`}>
                            <div className={s.input} id={`output-${currentDiagram.id}-${index}`}>{name}</div>
                            <Xarrow
                                start={`diagramBlock-${currentDiagram?.id}`}
                                startAnchor="right"
                                endAnchor="left"
                                end={`output-${currentDiagram.id}-${index}`}
                                color="#353535"
                                strokeWidth={1}
                                gridBreak="20%"
                                path="grid"
                            />
                        </div>
                    ))}
                </div>            
                
            </div>

            <div className={s.bottom}>
                <div className={s.controllers}>
                    {currentDiagram?.controllers?.map((name,index)=>(
                        <div key={`key-controller-${currentDiagram.id}-${index}`} id={`controller-${currentDiagram.id}-${index}`}>
                            <div className={s.controller}>{name}</div>
                            <Xarrow
                                start={`controller-${currentDiagram.id}-${index}`}
                                startAnchor="top"
                                endAnchor="bottom"
                                end={`diagramBlock-${currentDiagram?.id}`}
                                color="#353535"
                                strokeWidth={1}
                                gridBreak="80%"
                                path="grid"
                            />
                        </div>
                    ))}
                </div> 
            </div>           

        </div>
    );
};
