import React from 'react'
import s from '@/styles/Authorization.module.scss'
import AuthForm from '@/components/AuthForm';


export default function Authorization() {


  return (
    <div className={s.container}>
      <AuthForm/>
    </div>
  )
}
