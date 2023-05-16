// Import the functions you need from the SDKs you need
import { Diagram } from "@/types";
import { initializeApp } from "firebase/app";
import { User } from "firebase/auth";
import { getDatabase, ref, set, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_REALTIME_DATABASE_URL
};

export const app = initializeApp(firebaseConfig)
export const db = getDatabase(app);
