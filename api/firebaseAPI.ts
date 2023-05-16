// Import the functions you need from the SDKs you need
import { Diagram } from "@/types";
import { User } from "firebase/auth";
import { getDatabase, ref, set, onValue, get, child } from "firebase/database";
import {db} from "@/firebase"

export const writeFirebaseData = async (data: Diagram[], user:User) => {
  const REF = ref(db, '/' + user.uid)
  await set(REF, data)
  console.log('firebase diagrams is setted')
  return true
}
  

  