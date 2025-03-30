import { useQuery } from "react-query"
import { useGlobalContext } from "../Context"
import axios from "axios"
import { Key, useState } from "react"


const url = "http://localhost:3000/news"

const clean = { title: "", content: "" }

export default function News() {
  const { token } = useGlobalContext()

  return (
    <article>
      <h2>Notícias</h2>
      {token == "" && <p>Faça o login para ler as notícias</p>}
      {token != "" && <NewsTable />}
    </article>
  )
}

function NewsTable() {
  const { token } = useGlobalContext()
  const { data, refetch, isLoading } = useQuery('news',
    () => axios.get(url, { headers: { "Authorization": `Bearer ${token}` } }))

  const [{ title, content }, setNew] = useState(clean)
  const [selected, setSelection] = useState("")

  console.log(data?.data);
  const nova = () => {
    axios
      .post(url, { title, content }, { headers: { "Authorization": `Bearer ${token}` } })
      .then(() => {
        setNew(clean)
        setSelection("")
        refetch()
      })
  }

  const remove = () => {
    axios
      .delete(url + `/${selected}`, { headers: { "Authorization": `Bearer ${token}` } })
      .then(() => {
        setNew(clean)
        setSelection("")
        refetch()
      })
  }

  const editar = () => {
    axios.put(url + `/${selected}`, { title, content }, { headers: { "Authorization": `Bearer ${token}` } })
      .then(() => {
        setNew(clean)
        setSelection("")
        refetch()
      })
  }
  return (
    <>
      <button onClick={() => refetch()} disabled={isLoading}>{isLoading ? "Carregando..." : "Recarregar"}</button>
      <div className="news">
        {/* {JSON.stringify(data?.data)} */}
        {data?.data.map((i: { title: string, content: string, id: string, User: { name: string } }, k: string) => (
          <section
            className={`${selected == i.id ? " selected" : ""}`}
            key={k as Key} onClick={() => {
              // setNew({ title: i.title, content: i.content })
              setSelection(i.id)
            }}>
            <div><span>Titulo:</span><h3>{i.title} </h3></div>
            <p>{i.content}</p>
            <div><span>Autor:</span><h3>{i.User.name} </h3></div>
          </section>))}
      </div>

      {token != "" && (
        <div className="toolbox">
          <div>
            <h3>Título</h3>
            <input type="text" onChange={(event) => setNew({ content, title: event.target.value })} />
          </div>
          <div className="flex-grow">
            <h3>Conteúdo</h3>
            <input type="text" onChange={(event) => setNew({ title, content: event.target.value })} />
          </div>
          <div className="tools">
            <button onClick={() => nova()} disabled={title == "" || content == ""}>Nova</button>
            <button onClick={() => remove()} disabled={selected == ""}>Remover</button>
            <button onClick={() => editar()} disabled={selected == "" || title == "" || content == ""}>Editar</button>
          </div>
        </div>
      )}
    </>
  )
}
