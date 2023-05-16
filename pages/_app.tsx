import '@/styles/globals.scss'
import type { AppProps } from 'next/app'
import "@/firebase"
import { useEffect, useState } from 'react'
import { useAuthStore, useDiagram } from '@/store'
import { useRouter } from 'next/router'
import { child, get, getDatabase, ref } from 'firebase/database'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const setDiagramsToStore = useDiagram(state=>state.setDiagrams)
  const user = useAuthStore(state=>state.user)

  useEffect(()=>{    
    if(!user){
      router.push("/registration")
      return
    }

    if (user) {
      get(child(ref(getDatabase()), '/' + user.uid)).then((snapshot) => {
        if (snapshot.exists()) {
            setDiagramsToStore(snapshot.val())
            console.log(snapshot.val())
        } else {
          console.log("No data available");
        }
        }).catch((error) => {
          console.error(error);
      });
    }
  },[user])

  return <Component {...pageProps} />
}
