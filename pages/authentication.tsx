import React from 'react'
import s from '@/styles/Authentication.module.scss'
import AuthForm from '@/components/AuthForm';


export default function Authentication() {

  return (
    <div className={s.container}>
      <AuthForm/>
    </div>
  )
}
