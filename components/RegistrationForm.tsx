import s from '@/styles/Authentication.module.scss'
import { getAuth, createUserWithEmailAndPassword, User } from "firebase/auth";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";
import { useAuthStore } from '@/store';
import { useRouter } from 'next/router';

type Inputs = {
  email: string,
  password: string,
  cpassword: string,
  mode: "onTouched"
};

export default function RegistrationForm() {
  const auth = getAuth();
  const router = useRouter();

  const setUser = useAuthStore(state=>state.setUser)
  const { register, handleSubmit, getValues, formState: { errors } } = useForm<Inputs>();

  //show password
  const [toggle1, setToggle1] = useState(false);
  const [toggle2, setToggle2] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string|null>(null)

  const onSubmit: SubmitHandler<Inputs> = ({email,password}) => {
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user:User = userCredential.user;
      setUser(user) //Сохранение пользователя в стор
      setErrorMessage(null)

      router.push('/')
    })
    .catch((error) => {
      if(error.code === "auth/email-already-in-use") {
        setErrorMessage("Пользователь с таким email уже зарегистрирован")
      }
      console.log(error)
    });
  };

  return (
    <div className={s.container}>
      <h1>Регистрация: </h1>
      <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
        <label>Email</label>
        <input 
          placeholder='email@gmail.com' 
          type="email" {...register("email", 
            { 
              required: true, 
              validate: () => {
                setErrorMessage(null) //очистить сообщение об ощибке входа, при изменении password
                return true
              },
              pattern: {value:  /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/i, 
              message: "Введите email, например, «email@gmail.com»"} 
            }
          )} 
        />
        {errors.email && <span className={s.alert}>Введите email. Для примера: «email@gmail.com»</span>}

        
        <div className={s.passwords}>
            <div className='Label1'>
                <label>
                  Пароль
                </label>
            </div>

            <div className={s.password1}>
              <i id="passlock" className="fa fa-lock icon"></i>
              <i id="showpass" className="fa fa-eye icon" onClick={() => { setToggle1(!toggle1) }}></i>
              <input 
                type={toggle1 ? "text" : "password"} 
                placeholder='Password' {...register("password", 
                  { 
                    validate: () => {
                      setErrorMessage(null) //очистить сообщение об ощибке входа, при изменении password
                      return true
                    },
                    required: "*Это поле обазательно для заполнения", 
                    minLength: { value: 6, message: "*Пароль должен быть не менее 6 символов." }, 
                    maxLength: { value: 26, message: "*Пароль не может превышать 26 символов." }
                  }
                )}></input>
              <p className={s.alert}>{errors.password?.message}</p> 
            </div>

            <div className='Label2'>
                <label >
                    Подтвердить пароль
                </label>
            </div>

            <div className={s.password1} >
                <i id="passlock" className="fa fa-lock icon"></i>
                <i id="showpass" className="fa fa-eye icon" onClick={() => { setToggle2(!toggle2) }}></i>
                <input 
                  type={toggle2 ? "text" : "password"} 
                  placeholder='Password' {...register("cpassword", 
                    { 
                      required: "*Это поле обазательно для заполнения", 
                      validate: (value) => {
                        setErrorMessage(null) //очистить сообщение об ощибке входа, при изменении password
                        if(value !== getValues("password")){
                          return "Пароли не совпадают"
                        } 

                        return value === getValues("password")
                      },
                      minLength: { value: 6, message: "*Пароль должен быть не менее 6 символов." }, 
                      maxLength: { value: 26, message: "*Пароль не может превышать 26 символов." },
                    }
                    )}></input>
                    <p className={s.alert}>{errors.cpassword?.message}</p>
            </div>
        </div>
        
        <input type="submit" value={"Зарегистрироваться"} className={s.submit}/>
      </form>

      {errorMessage && <div className={s.firebaseError}>
        <span className={s.error}>
          {errorMessage}
        </span>
      </div>}

      <div>
      <p>Уже есть аккаунт? <Link className={s.enter} href="/authentication">Войти</Link></p>
      </div>
    </div>
  )
}

