import s from "@/styles/CreateDiagramForm.module.scss"
import uniqid from 'uniqid'
import { useStore } from "@/store"
import { Block, Diagram} from "@/types"
import Link from "next/link"
import { useCallback, useEffect,useState, FormEvent, useMemo } from "react"

interface EditFormParams {
  params?:{
    titleLabel: string,
    buttonName: string,
    currentDiagram: Diagram
  }
  close?: ()=> void
}

export default function CreateDiagramForm({params = undefined, close} : EditFormParams) {
  const saveDiagram = useStore(state => state.saveDiagram)
  const [editedDiagram, setEditedDiagram] = useState<Diagram | null>(params? params.currentDiagram : null)

  //d_ - обозначает "диаграмма"
  //Локальные стейты для инпутов
  const [d_title,setD_Title] = useState(params? params.currentDiagram.name : "")
  const [d_input,setD_Input] = useState<string>(params? params.currentDiagram.blocks[0]?.inputs.join(',') : "")
  const [d_output,setD_Output] = useState<string>(params? params.currentDiagram.blocks[0]?.outputs.join(',') : "")
  const [d_control,setD_Control] = useState<string>(params? params.currentDiagram.blocks[0]?.controls.join(',') : "")
  const [d_mechanism,setD_Mechanism] = useState<string>(params? params.currentDiagram.blocks[0]?.mechanisms.join(',') : "")
  //Все входы, выходы, контроллеры, механимы
  const [d_inputs,setD_Inputs] = useState<string[]>(params? params.currentDiagram.blocks[0]?.inputs : [])
  const [d_outputs,setD_Outputs] = useState<string[]>(params? params.currentDiagram.blocks[0]?.outputs : [])
  const [d_controls,setD_Controls] = useState<string[]>(params? params.currentDiagram.blocks[0]?.controls : [])
  const [d_mechanisms,setD_Mechanisms] = useState<string[]>(params? params.currentDiagram.blocks[0]?.mechanisms : [])

  const [num_level, setNum_Level] = useState<number>(0)//Номер уровеня диаграммы
  const [num_subLevel, setNum_subLevel] = useState<number>(1)//Номер под-уровень диаграммы

  useEffect(()=>{
    params && setEditedDiagram(params.currentDiagram)
  },[])
  useEffect(()=>{
    if(editedDiagram && params) {
      saveDiagram(editedDiagram)
    }
  },[editedDiagram])

  useEffect(()=>{//при смене уровня заполняем поля
    if(!params || !editedDiagram || !editedDiagram.blocks[0]) return

    if(num_level === 0){
      const block = editedDiagram.blocks[0]

      setD_Title(block.title);
      setD_Input(block.inputs.join(',')); setD_Inputs(block.inputs);
      setD_Output(block.outputs.join(',')); setD_Outputs(block.outputs);
      setD_Mechanism(block.mechanisms.join(',')); setD_Mechanisms(block.mechanisms);
      setD_Control(block.controls.join(',')); setD_Controls(block.controls);

      return
    }

    if(num_level > 0){
      const block = editedDiagram.blocks.find(block => block.level === num_level && block.subLevel === num_subLevel)

      if(block) {
        setD_Title(block.title);
        setD_Input(block.inputs.join(',')); setD_Inputs(block.inputs);
        setD_Output(block.outputs.join(',')); setD_Outputs(block.outputs);
        setD_Mechanism(block.mechanisms.join(',')); setD_Mechanisms(block.mechanisms);
        setD_Control(block.controls.join(',')); setD_Controls(block.controls);
      } else {
        setD_Title("");
        setD_Input(""); setD_Inputs([]);
        setD_Output(""); setD_Outputs([]);
        setD_Mechanism(""); setD_Mechanisms([]);
        setD_Control(""); setD_Controls([]);
      }
    }

  },[num_level, num_subLevel, editedDiagram])

  //Добавляет значение стейта в стейт со списком элементов и очищает стейт
  const addElement = useCallback((str:string, elementStateAction:(s:string)=>void,elementsStateAction:(s:string[])=>void)=>{
    let elements = str.split(",")
    let elementWithoutSpaces = elements.map((el)=> el.trim()).filter(el=> el.length > 0)

    if(elementWithoutSpaces.length === 0){
      elementStateAction('')
    }
    elementsStateAction(elementWithoutSpaces)
  },[d_title,d_input,d_output,d_control,d_mechanism, num_level, num_subLevel])

  //список jsx элементов
  const elements = useCallback((elements:string[]) => {
    if(!elements) return
    return elements.map((element,i)=> {
      
      return <div key={i}>
        <p>{element}</p>
      </div>
    })
  }
  ,[d_title,d_input,d_output,d_control,d_mechanism, num_level, num_subLevel])


  //Сохранение изменений
  const saveLevel = useCallback(()=>{
    if(!editedDiagram) return

    if(!d_title || !d_input || !d_output || !d_control || !d_mechanism){
      alert("Не все поля заполнены")
      return
    }

    if(num_level === 0){
      const headLevel = {
        title: d_title,
        level: 0,
        subLevel: 0,
        inputs: d_inputs,
        outputs: d_outputs,
        controls: d_controls,
        mechanisms: d_mechanisms,
      }

      let newBlocks = editedDiagram.blocks

      newBlocks.splice(0, 1, headLevel)

      const newDiagram = {
        id: editedDiagram.id,
        name: editedDiagram.blocks[0].title,
        blocks: newBlocks
      }

      setEditedDiagram(newDiagram)

      return
    }else{
      const newBlock:Block = {
        level: num_level,
        subLevel: num_subLevel,
        title: d_title,
        inputs: d_inputs,
        outputs: d_outputs,
        controls: d_controls,
        mechanisms: d_mechanisms,
      }
  
      //Добавление/перезапись нового блока
      const blocks = editedDiagram.blocks
      let isAdded = false

      const newBlocks = blocks.map((block:Block) => {
        if(block.level === newBlock.level && block.subLevel === newBlock.subLevel){
          isAdded = true
          return newBlock
        } else return block
      }).filter(blocks => blocks.title)


      if(!isAdded) newBlocks.push(newBlock)

      setEditedDiagram({
        ...editedDiagram,
        blocks: newBlocks
      })
    }
   
  },[d_title,d_input,d_output,d_control,d_mechanism,num_level, num_subLevel])

  //создание диаграммы
  const create = useCallback(()=>{
    if(!d_title || !d_input || !d_output || !d_control || !d_mechanism){
      alert("Не все поля заполнены")
      return
    }
    if(!params){
      const id = uniqid()
      
      const A0_Block = {
        title: d_title,
        level: num_level,
        subLevel: 0,
        inputs: d_inputs,
        outputs: d_outputs,
        controls: d_controls,
        mechanisms: d_mechanisms,
      }

      saveDiagram({
        id: id,
        name: d_title,
        blocks:[A0_Block]
      })

      close && close() //закрыть форму
    }
  },[d_title,d_input,d_output,d_control,d_mechanism])

  return (
    <div className={s.container}>
      <div className={s.container_inner}>

        <h2  className={s.title}>{params? params.titleLabel : "Создание диаграммы"}</h2>
        
        {params && 
          <div className={s.level}> 
            <p>Уровень: A{num_level}{num_level > 0 && num_subLevel > 0 && "." + num_subLevel}</p>
            <input min={0} type="number" name="level" value={num_level} onChange={(e:FormEvent<HTMLInputElement>)=>setNum_Level(+e.currentTarget.value)}></input>
            {num_level > 0 && 
              <input min={1} type="number" name="subLevel" value={num_subLevel} onChange={(e:FormEvent<HTMLInputElement>)=>setNum_subLevel(+e.currentTarget.value)}></input>
            }
          </div>
        }

        <div className={s.inputElement}>
          <p>Имя: {d_title}</p>
          <input type="text"
          name="name"
          placeholder="Имя диаграммы..."
          value={d_title} 
          onChange={(e:FormEvent<HTMLInputElement>)=>{
            setD_Title(e.currentTarget.value)
          }}
          ></input>
        </div> 

        <div className={s.inputElement}>
          <div>
            <p>Входы:</p>
            <div className={s.elements}>{elements(d_inputs)}</div>
          </div>
          <input type="text" name="input" value={d_input}
            placeholder="Первый, Второй, Третий..."
            onChange={(e:FormEvent<HTMLInputElement>)=>{
            setD_Input(e.currentTarget.value)
            addElement(e.currentTarget.value, setD_Input,setD_Inputs)
          }
          }></input>
        </div>
        
        <div className={s.inputElement}>
          <div>
            <p>Выходы:</p>
            <div className={s.elements}>{elements(d_outputs)}</div>
          </div>
          <input type="text" name="output" value={d_output}
            placeholder="Первый, Второй, Третий..."
            onChange={(e:FormEvent<HTMLInputElement>)=>{
              setD_Output(e.currentTarget.value)
              addElement(e.currentTarget.value, setD_Output,setD_Outputs)
          }}/>
        </div>
        
        
        <div className={s.inputElement}>
          <div>
            <p>Контроллеры:</p>
            <div className={s.elements}>{elements(d_controls)}</div>
          </div>
          <input type="text" name="controls" value={d_control}
            placeholder="Первый, Второй, Третий..."
            onChange={(e:FormEvent<HTMLInputElement>)=>{
              setD_Control(e.currentTarget.value)
              addElement(e.currentTarget.value, setD_Control, setD_Controls)
          }
          }/>
        </div>

        <div className={s.inputElement}>
          <div>
            <p>Механизмы:</p>
            <div className={s.elements}>{elements(d_mechanisms)}</div>
          </div>
          <input type="text" name="mechanisms" value={d_mechanism}
            placeholder="Первый, Второй, Третий..."
            onChange={(e:FormEvent<HTMLInputElement>)=>{
              setD_Mechanism(e.currentTarget.value)
              addElement(e.currentTarget.value, setD_Mechanism, setD_Mechanisms)
          }
          }/>
        </div>


        <div className={s.buttons}>
          {params && <button className={s.createBtn} onClick={saveLevel}>
              <p>{params.buttonName}</p>
          </button>}
          
          {!params && <button className={s.createBtn} onClick={create}>
              <p>Создать</p>
          </button>}

          {close && <button className={s.closeBtn} onClick={close}>
              <p>Закрыть</p>
          </button>}
        </div>
          
      </div>
    </div>
  )
}