import Xarrow, {useXarrow, Xwrapper} from 'react-xarrows';
import s from "@/styles/Tree.module.scss";
import { Block, Elements, Diagram, Line, Connect } from '@/types';
import { useEffect, useRef, useState } from 'react';
import { useDiagram } from '@/store';




export const Tree = ({diagram, close}:{diagram:Diagram, close:()=>void}) => {
    const blocksRef= useRef(null)
    const level = useDiagram(state=>state.currentLevel)
    const setOpenBlock = useDiagram(state=>state.setOpenBlock)
    const setCurrentLevel = useDiagram(state=>state.setCurrentLevel)
    const [hierarchy, setHierarchy] = useState<Map<string, Block[]>>(new Map())

    useEffect(()=>{
        if(!diagram) return
        
        let newHierarchy:Map<string, Block[]> = new Map()

        diagram.blocks.forEach(block => {

            if(block.level === "0"){
                newHierarchy.set("0", [block])
                return
            }
            
            let blockLevel = block.level.split('.')
            let blocks = newHierarchy.get(String(blockLevel.length))

            if (blocks) {
                newHierarchy.set(String(blockLevel.length), [...blocks, block]
                    .sort((a,b)=>{
                        if (a.level < b.level) {
                        return -1;
                        }
                        if (a.level > b.level) {
                        return 1;
                        }
                        return 0;
                    }
                ))
            } else {
                newHierarchy.set(String(blockLevel.length), [block])
            }

        });

        setHierarchy(newHierarchy)

    },[level, diagram, blocksRef])


    const parentBlockId = (level:string) => {
        console.log(level)

        if(level.length === 0 || level === "0") return false

        if(level.length === 1) {
            return "0"
        }

        let parentLevel = level.split('.').splice(0, level.split('.').length - 1).join('.')
        let parentBlock = diagram.blocks.find((block)=> block.level === parentLevel)

        if (!parentBlock) return false

        return parentLevel
    }

    return (
        <div className={s.tree}>

            {
                //Сортировка массива из Map() по нулевому элементу, который означает уровень
                Array.from(hierarchy).sort((a,b)=> +a[0] - +b[0]).map(([index, blocks])=>{
                    return <div key={`hierarchy-${index}`} className={s.hierarchyLevel}>
                        <div className={s.content}>
                            {
                                blocks?.map(block=>{
                                    return <div key={`container-A${block.level}`}>
                                        <div 
                                            key={`A${block.level}`}
                                            className={s.block}
                                            onClick={()=>{
                                                setOpenBlock(block)
                                                close()
                                            }}
                                            id={`A${block.level}`}>
                                                <h6 className={s.name}>{block.title}</h6>
                                                <p className={s.id}>{`A${block.level}`}</p>
                                        </div>
                                        { 
                                            parentBlockId(block.level) && 
                                                <Xarrow
                                                startAnchor="bottom"
                                                endAnchor="top"
                                                end={`A${block.level}`}
                                                start={`A${parentBlockId(block.level)}`}
                                                color="red"
                                                strokeWidth={3}
                                                gridBreak="30px" 
                                                path="grid"
                                            />
                                        }
                                    </div>
                                })
                            }
                        </div>

                        <div className={s.right} onClick={()=>{
                            setOpenBlock(null)
                            setCurrentLevel(index)
                            close()
                        }}>
                            <div className={s.id}>
                                <p className={s.id}>{index}</p>
                            </div>
                        </div>
                    </div>
                })
            }

        </div>
    );
};

