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
      <div>
        {token == "" && <p>Faça o login para ler as notícias</p>}
        {token != "" && <NewsTable />}
      </div>
    </article>
  )
}

function NewsTable() {
  const { token } = useGlobalContext()
  const { data, refetch } = useQuery('news',
    () => axios.get(url, { headers: { "Authorization": `Bearer ${token}` } }))

  const [{ title, content }, setNew] = useState(clean)
  const [selected, setSelection] = useState("")

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
      <button onClick={() => refetch()}>Recarregar</button>
      {/* {JSON.stringify(data?.data)} */}
      {data?.data.map((i: { title: string, content: string, id: string }, k: string) => {
        return (
          <div key={k as Key} onClick={() => {
            // setNew({ title: i.title, content: i.content })
            setSelection(i.id)
          }}>
            <span>Title: <h3>{i.title} {selected == i.id ? " selected" : ""}</h3></span>
            <p>{i.content}</p>
          </div>)
      })}

      {token != "" && (
        <>
          <h2>Toolbox</h2>
          <h3>Título</h3>
          <input type="text" onChange={(event) => setNew({ content, title: event.target.value })} />
          <h3>Conteúdo</h3>
          <input type="text" onChange={(event) => setNew({ title, content: event.target.value })} />
          <button onClick={() => nova()} disabled={title == "" || content == ""}>Nova</button>
          <button onClick={() => remove()} disabled={selected == ""}>Remover</button>
          <button onClick={() => editar()} disabled={selected == ""}>Editar</button>
        </>
      )}
    </>
  )
}
