import Xarrow, {useXarrow, Xwrapper} from 'react-xarrows';
import s from "@/styles/Tree.module.scss";
import { Block, Elements, Diagram, Line, Connect } from '@/types';
import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/store';

export const Tree = ({diagram, close}:{diagram:Diagram, close:()=>void}) => {
    const blocksRef= useRef(null)
    const level = useStore(state=>state.currentLevel)
    const [hierarchy, setHierarchy] = useState<Map<number,Block[]>>(new Map())

    useEffect(()=>{
        if(!diagram) return
        
        let newHierarchy:Map<number,Block[]> = new Map()

        diagram.blocks.forEach(block => {
            let subLevels = newHierarchy.get(block.level)
            if(subLevels){
                newHierarchy.set(block.level, [...subLevels, block])
            }else{
                newHierarchy.set(block.level, [block])
            }
        });

        setHierarchy(newHierarchy)

        console.log(Array.from(newHierarchy))
    },[level, diagram, blocksRef])

    return (
        <div className={s.tree}>

            {
                Array.from(hierarchy).map(([index, blocks])=>{
                    return <div key={`hierarchy-${index}`} className={s.hierarchyLevel}>
                        <div className={s.content}>
                            {
                                blocks.map(block=>{
                                    return <div key={`container-A${block.level}${block.subLevel ? "." + block.subLevel : ""}`} onClick={close}>
                                        <div 
                                            key={`A${block.level}.${block.subLevel}`}
                                            className={s.block}
                                            id={`A${block.level}.${block.subLevel}`}>
                                                <h6 className={s.name}>{block.title}</h6>
                                                <p className={s.id}>{`A${block.level}${block.subLevel ? "." + block.subLevel : ""}`}</p>
                                        </div>
                                    </div>
                                })
                            }
                        </div>

                        <div className={s.right} onClick={close}>
                            <div className={s.id}>
                                <p className={s.id}>{`A${index}`}</p>
                            </div>
                        </div>
                    </div>
                })
            }

        </div>
    );
};

