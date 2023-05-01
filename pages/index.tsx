import { useEffect, useState } from "react";
import s from '@/styles/Home.module.scss'
import Link from 'next/link'
import CreateProjectForm from "@/components/CreateDiagramForm";
import { useStore } from "@/store";

export default function Home() {
    return (
      <div className={s.container}>
          <CreateProjectForm />
      </div>
    );
};
