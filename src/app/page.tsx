"use client"
import { useEffect, useState, useRef, FormEvent } from "react";
import { FiTrash, FiEdit, FiCheck } from "react-icons/fi"
import { api } from "./api";

interface CursoProps {
  id: string;
  description:string;
  grau: string;
  nivel_serie: string;
  modalidade: string;
  ativo: boolean;
}

export default function Home() {

  // Linkar os inputs
  const descriptionRef = useRef<HTMLInputElement | null>(null)
  const grauRef = useRef<HTMLInputElement | null>(null)
  const nivel_serieRef= useRef<HTMLInputElement | null>(null)
  const modalidadeRef=useRef<HTMLInputElement | null>(null)

  // Inicializa lista de Cursos da página como lista vazia
  const [cursos, setCursos] = useState<CursoProps[]>([])

  // Ao renderizar a página, chama a função "readCursos"
  useEffect(() => {
    readCursos();
  }, [])

  // Busca os Cursos no banco de dados via API
  async function readCursos() {
    const response = await api.get("/cursos")
    console.log(response.data)
    setCursos(response.data)
  }

  // Cria uma novo Curso
  async function createCurso(event: FormEvent) {
    event.preventDefault()
    const response = await api.post("/cursos", {
      description: descriptionRef.current?.value,
      grau:grauRef.current?.value,
      nivel_serie:nivel_serieRef.current?.value,
      modalidade:modalidadeRef.current?.value
    }) 

    setCursos(allCursos => [...allCursos, response.data])
  }

  // Deleta um Curso
  async function deleteCurso(id: string){
    try{
      await api.delete("/cursos/" + id)
      const allCursos = cursos.filter((curso) => curso.id !== id)
      setCursos(allCursos)
    }
    catch(err){
      alert(err)
    }
  }

  async function setCursoDone(id:string) {
    try {
      await api.put("/cursos/" + id, {
        status: true,
      })
      const response = await api.get("/cursos")
      setCursos(response.data)
    }
    catch(err){
      alert(err)
    }
  }

  return (
    <div className="w-full min-h-screen bg-slate-500 flex justify-center px-4">
      <main className="my-10 w-full lg:max-w-5xl">
        <section>
          <h1 className="text-4xl text-slate-200 font-medium text-center">Curso</h1>

          <form className="flex flex-col my-6" onSubmit={createCurso}>
          
            <label className="text-slate-200">Description</label>
            <input type="text" className="w-full mb-5 p-2 rounded" ref={descriptionRef}/>

            <label className="text-slate-200">grau</label>
            <input type="text" className="w-full mb-5 p-2 rounded" ref={grauRef} />

            <label className="text-slate-200">nivel_serie</label>
            <input type="text" className="w-full mb-5 p-2 rounded" ref={nivel_serieRef} />

            <label className="text-slate-200">modalidade</label>
            <input type="text" className="w-full mb-5 p-2 rounded" ref={modalidadeRef} />

            <input type="submit" value={"Add Curso"} className="cursor-pointer w-full bg-slate-800 rounded font-medium text-slate-200 p-4" />
          </form>

        </section>
        <section className="mt-5 flex flex-col">

          {cursos.map((curso) => (
            <article className="w-full bg-slate-200 text-slate-800 p-2 mb-4 rounded relative hover:bg-sky-300" key={curso.id}>
              <p>{curso.description}</p>
              <p>{curso.grau}</p>
              <p>{curso.nivel_serie}</p>
              <p>{curso.nivel_serie}</p>


              <button className="flex absolute right-10 -top-2 bg-green-600 w-7 h-7 items-center justify-center text-slate-200" onClick={() => setCursoDone(curso.id)}><FiCheck></FiCheck></button>

              <button className="flex absolute right-0 -top-2 bg-red-600 w-7 h-7 items-center justify-center text-slate-200" onClick={() => deleteCurso(curso.id)}><FiTrash></FiTrash></button>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
