import { useStore } from "@/store"
import s from "@/styles/CreateDiagramForm.module.scss"
import { Diagram } from "@/types"
import Link from "next/link"
import { useCallback, useEffect,useState, FormEvent, useMemo } from "react"

interface EditFormParams {
  params?:{
    titleLabel: string,
    buttonName: string,
    currentDiagram: Diagram
  } | undefined, 
  closeForm?: () => void | undefined
}

export default function CreateDiagramForm({params = undefined, closeForm = ()=>{}} : EditFormParams) {
  //d_ - сокращение от "диаграма"
  //Локальные стейты инпутов формы
  const [d_name,setD_Name] = useState(params? params.currentDiagram.name : "")
  const [d_input,setD_Input] = useState<string>(params? params.currentDiagram.inputs.join(',') : "")
  const [d_output,setD_Output] = useState<string>(params? params.currentDiagram.outputs.join(',') : "")
  const [d_controller,setD_Controller] = useState<string>(params? params.currentDiagram.controllers.join(',') : "")
  const [d_mechanism,setD_Mechanism] = useState<string>(params? params.currentDiagram.mechanisms.join(',') : "")
  //Локальные стейты списков элементов диаграммы
  const [d_inputs,setD_Inputs] = useState<string[]>(params? params.currentDiagram.inputs : [])
  const [d_outputs,setD_Outputs] = useState<string[]>(params? params.currentDiagram.outputs : [])
  const [d_controllers,setD_Controllers] = useState<string[]>(params? params.currentDiagram.controllers : [])
  const [d_mechanisms,setD_Mechanisms] = useState<string[]>(params? params.currentDiagram.mechanisms : [])

  const  setCurrent = useStore(state => state.setCurrent)


  //Добавляет значение стейта в стейт со списком элементов и очищает стейт
  const addElement = useCallback((str:string, elementStateAction:(s:string)=>void,elementsStateAction:(s:string[])=>void)=>{
    let elements = str.split(",")
    let elementWithoutSpaces = elements.map((el)=> el.trim()).filter(el=> el.length > 0)

    if(elementWithoutSpaces.length === 0){
      elementStateAction('')
    }
    elementsStateAction(elementWithoutSpaces)
  },[d_name,d_input,d_output,d_controller,d_mechanism])

  const elements = useCallback((elements:string[]) => elements.map((e,i)=> <div key={i}><p>{e}</p></div>),[d_name,d_input,d_output,d_controller,d_mechanism])

  const create = useCallback(()=>{
    
    let project:Diagram = {
      id: 0,
      name: d_name,
      inputs: d_inputs,
      outputs: d_outputs,
      controllers: d_controllers,
      mechanisms: d_mechanisms,
    }
    
    setCurrent(project)

    if(closeForm) closeForm()
  },[d_name,d_input,d_output,d_controller,d_mechanism])

  return (
    <div className={s.container}>
      <div className={s.container_inner}>

        <h2  className={s.title}>{params? params.titleLabel : "Создание диаграммы"}</h2>

        <div className={s.inputElement}>
          <p>Имя: {d_name}</p>
          <input type="text" name="name" placeholder="Имя диаграммы..." value={d_name} onChange={(e:FormEvent<HTMLInputElement>)=>setD_Name(e.currentTarget.value)}></input>
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
          }
          }></input>
        </div>
        
        
        <div className={s.inputElement}>
          <div>
            <p>Контроллеры:</p>
            <div className={s.elements}>{elements(d_controllers)}</div>
          </div>
          <input type="text" name="controllers" value={d_controller}
            placeholder="Первый, Второй, Третий..."
            onChange={(e:FormEvent<HTMLInputElement>)=>{
            setD_Controller(e.currentTarget.value)
            addElement(e.currentTarget.value, setD_Controller, setD_Controllers)
          }
          }></input>
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
          }></input>
        </div>

        
        <Link href={`/diagram/${0}`}>
          <div className={s.createBtn} onClick={create}>
            <p>{params?.buttonName ? params?.buttonName : "Создать"}</p>
          </div>
        </Link>
      </div>
    </div>
  )
}