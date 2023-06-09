import Xarrow, {useXarrow, Xwrapper} from 'react-xarrows';
import s from "@/styles/DiagramBlocks.module.scss";
import { Block, Elements, Diagram, Line, Connect } from '@/types';
import { useEffect, useRef, useState } from 'react';
import { useDiagram } from '@/store';

export const DiagramBlocks = ({diagram}:{diagram:Diagram}) => {
    const blocksRef= useRef(null)
    const level = useDiagram(state=>state.currentLevel)
    const openBlock = useDiagram(state=>state.openBlock)

    const [currentBocks, setCurrentBlocks] = useState<Block[]>([])
    const [connects, setConnects] = useState<{elements: Elements, lines: Line[]} | null>(null)

    useEffect(()=>{
        if(!diagram) return

        const getBlocks = () =>{
            if(openBlock){
                //Блок, который выбран в дереве блоков
                return [openBlock]
            } else {
                //Отcортированные блоки выбранного уровня
                return diagram.blocks
                    .filter((block:Block)=> {
                        if(level === "0"){
                           if(block.level === level) return true
                        } else {
                            if(block.level !== "0"){
                                return block.level.split('.').length === +level
                            }
                        }
                    })
                    // .sort((a:Block,b:Block)=> +a.level.split('.').join('') - +b.level.split('.').join(''))
            }
        }
        
        let blocks = getBlocks()
        setCurrentBlocks(blocks)  

        let connects = processBlocks(blocks)
        setConnects(connects)//Устанавливаем связи елемент-блок, блок-блок

        if(blocksRef.current){
            //Изменяем размем div для блоков, в зависимости от кол-ва блоков
            //@ts-ignore
            blocksRef.current.style.width = (blocks.length * (330)) + "px"
            //@ts-ignore
            blocksRef.current.style.height = (blocks.length * (240)) + "px"
        }
    },[diagram,level,openBlock, blocksRef])

    return (
        <div className={s.diagram}>

            <div className={s.top}>
                {
                    connects?.elements.mechanisms.map((element, index)=>{
                        
                        if(element.targets){
                            return <div key={`A${element.target.level}-key-mechanisms-${index}`}  id={`mechanisms-${element.name}`}>
                                <p className={s.mechanism}>{element.name}</p>
                                {element.targets.map((target:Block, ind:number) => 
                                    <div key={`A${target.level}-key-mechanisms-${index}-${ind}`}>
                                        <Xarrow
                                            startAnchor="bottom"
                                            endAnchor="top"
                                            start={`mechanisms-${element.name}`}
                                            end={`A${target.level}`}
                                            color="black"
                                            strokeWidth={2}
                                            gridBreak="30%" 
                                            path="grid"
                                        />
                                    </div>)
                                }
                            </div>
                        } else return <div key={`A${element.target.level}-key-mechanisms-${index}`} id={`mechanisms-${element.name}`}>
                            <p className={s.mechanism}>{element.name}</p>
                            <Xarrow
                                startAnchor="bottom"
                                endAnchor="top"
                                start={`mechanisms-${element.name}`}
                                end={`A${element.target.level}`}
                                color="black"
                                strokeWidth={2}
                                gridBreak="30%" 
                                path="grid"
                            />
                        </div>
                    })
                }
            </div>

            <div className={s.center}>
                <div className={s.inputs}>
                    {
                        connects?.elements.inputs.map((element, index)=>(
                            <div key={`A${element.target.level}-key-input-${index}`}>
                                <p className={s.input} id={`A${element.target.level}-input-${index}`}>{element.name}</p>
                                <Xarrow
                                    start={`A${element.target.level}-input-${index}`}
                                    startAnchor="right"
                                    endAnchor="left"
                                    end={`A${element.target.level}`}
                                    color="black"
                                    strokeWidth={2}
                                    gridBreak="20%" 
                                    path="grid"
                                />
                            </div>
                        ))
                    }
                </div> 

                


                {/* Блоки */}
                <div className={s.blocks} ref={blocksRef}>
                    {   //Используем матрицу для размещения блоков по диагонали
                        Array(currentBocks.length).fill(0).map((_, i) => Array(currentBocks.length).fill(0).map((_, j) => i == j ? 1 : 0)).map((row, rowNumber)=>(
                            row.map((cell, cellNumber)=>(
                                cell === 1 ? 
                                <div 
                                    key={`A${currentBocks[rowNumber].level}`}
                                    className={s.block} style={{margin:"200"}} 
                                    id={`A${currentBocks[rowNumber].level}`}>
                                        <h6 className={s.name}>{currentBocks[rowNumber].title}</h6>
                                        <p className={s.id}>{`A${currentBocks[rowNumber].level}`}</p>
                                </div>
                                : <div key={`empty-${rowNumber}-${cellNumber}`} className={s.emptyBlock}/>
                            ))
                        ))
                    }
                </div>

                <div className={s.outputs}>
                    {
                        connects?.elements.outputs.map((element, index)=>(
                            <div key={`A${element.target.level}-key-output-${index}`}>
                                <p className={s.output} id={`A${element.target.level}-output-${index}`}>{element.name}</p>
                                <Xarrow
                                    startAnchor="right"
                                    endAnchor="left"
                                    start={`A${element.target.level}`}
                                    end={`A${element.target.level}-output-${index}`}
                                    color="black"
                                    strokeWidth={2}
                                    gridBreak="70%"
                                    path="grid"
                                    />
                            </div>
                        ))
                        
                    }
                </div>            
                
            </div>

            <div className={s.bottom}>
                {
                    connects?.elements.controls.map((element, index)=>{
                        
                        if(element.targets){
                            return <div key={`A${element.target.level}-key-controls-${index}`}  id={`controls-${element.name}`}>
                                <p className={s.control}>{element.name}</p>
                                {element.targets.map((target:Block, ind:number) => 
                                    <div key={`A${target.level}-key-controls-${index}-${ind}`}>
                                        <Xarrow
                                            startAnchor="top"
                                            endAnchor="bottom"
                                            start={`controls-${element.name}`}
                                            end={`A${target.level}`}
                                            color="black"
                                            strokeWidth={2}
                                            gridBreak="10%" 
                                            path="grid"
                                        />
                                    </div>)
                                }
                            </div>
                        } else return <div key={`A${element.target.level}-key-controls-${index}`} id={`A${element.target.level}-controls-${element.name}`}>
                            <p className={s.control}>{element.name}</p>
                            <Xarrow
                                startAnchor="top"
                                endAnchor="bottom"
                                start={`A${element.target.level}-controls-${element.name}`}
                                end={`A${element.target.level}`}
                                color="black"
                                strokeWidth={2}
                                gridBreak="10%" 
                                path="grid"
                            />
                        </div>
                    })
                }
            </div>           

            <div>
                {
                    connects?.lines.map((line,index) => (
                        <div key={`key-line-${index}`}>
                            <Xarrow
                                startAnchor="right"
                                endAnchor="left"
                                start={`A${line.a.level}`}
                                end={`A${line.b.level}`}
                                color="black"
                                strokeWidth={2}
                                gridBreak="20px" 
                                path="grid"
                                labels={{ start: <div className={s.lineLabel}><p>{line.name}</p></div>}}
                            />
                        </div>)
                    )
                }
            </div>
        </div>
    );
};

function processBlocks(blocks: Block[]): {elements: Elements, lines: Line[]} {
    const elements: Elements = { inputs: [], outputs: [], controls: [], mechanisms: [] };
    const lines: Line[] = [];
  
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
  
      // add inputs
      for (const input of block.inputs) {
        let found = false;
        for (let j = 0; j < i; j++) {
          const prevBlock = blocks[j];
          if (prevBlock.outputs.includes(input)) {
            const line = { a: prevBlock, b: block, name: input };
            if (lines.findIndex((l) => l.a === line.a && l.b === line.b && l.name === line.name) === -1) {
              lines.push(line);
            }
            found = true;
            break;
          }
        }
        if (!found) {
          elements.inputs.push({ name: input, target: block });
        }
      }
  
      // add outputs
      for (const output of block.outputs) {
        let found = false;
        for (let j = i + 1; j < blocks.length; j++) {
          const nextBlock = blocks[j];
          if (nextBlock.inputs.includes(output)) {
            const line = { a: block, b: nextBlock, name: output };
            if (lines.findIndex((l) => l.a === line.a && l.b === line.b && l.name === line.name) === -1) {
              lines.push(line);
            }
            found = true;
            break;
          }
        }
        if (!found) {
          elements.outputs.push({ name: output, target: block });
        }
      }
  
      // add controls
      for (const control of block.controls) {
        const existingIndex = elements.controls.findIndex((c) => c.name === control);
        if (existingIndex !== -1) {
          elements.controls[existingIndex]?.targets?.push(block);
        } else {
          elements.controls.push({ name: control, target: block, targets: [block] });
        }
      }
  
      // add mechanisms
      for (const mechanism of block.mechanisms) {
        const existingIndex = elements.mechanisms.findIndex((c) => c.name === mechanism);
        if (existingIndex !== -1) {
          elements.mechanisms[existingIndex]?.targets?.push(block);
        } else {
          elements.mechanisms.push({ name: mechanism, target: block, targets: [block] });
        }
      }
    }
  
    return {elements:elements,lines:lines};
}

