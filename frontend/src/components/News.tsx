import { Key, useState } from "react"
import { useAuth } from "../contexts/useAuth"
import { useNews } from "../contexts/useNews"

export default function News() {
  const { isAuthenticated } = useAuth()
  return (
    <article>
      <h2>Notícias</h2>
      {!isAuthenticated && <p>Faça o login para ler as notícias</p>}
      {isAuthenticated && <NewsTable />}
    </article>
  )
}

const clean = { title: "", content: "" }

function NewsTable() {
  const [{ title, content }, setNew] = useState(clean)
  const [selected, setSelection] = useState("")
  const { isAuthenticated } = useAuth()
  const { isLoading, refetch, news, add, del, update } = useNews()

  const nova = () => {
    add({ title, content })
    setNew(clean)
  }
  const remove = () => {
    del(+selected)
    setSelection("")
  }
  const editar = () => {
    update(+selected, { title, content })
    setNew(clean)
  }

  return (
    <>
      <button onClick={() => refetch()} disabled={isLoading}>{isLoading ? "Carregando..." : "Recarregar"}</button>
      {!!news &&
        <div className="news">
          {/* {JSON.stringify(data?.data)} */}
          {news.map((i, k) => (
            <section
              className={`${selected == i.id ? " selected" : ""}`}
              key={k as Key} onClick={() => {
                setNew({ title: i.title, content: i.content })
                setSelection(i.id)
              }}>
              <div><span>Titulo:</span><h3>{i.title} </h3></div>
              <p>{i.content}</p>
              <div><span>Autor:</span><h3>{i.User.name} </h3></div>
            </section>))}
        </div>
      }
      {!!news && news.length == 0 && (
        <div className="news">
          <section style={{ border: "none" }}>
            <h3 style={{ margin: "auto", textAlign: "center" }}>Suas notícias aparecerão aqui. Experimente adicionar uma nova!</h3>
          </section>
        </div>
      )}
      {isAuthenticated && (
        <div className="toolbox">
          <div>
            <h3>título</h3>
            <input type="text" value={title} onChange={(event) => setNew({ content, title: event.target.value })} />
          </div>
          <div className="flex-grow">
            <h3>conteúdo</h3>
            <input type="text" value={content} onChange={(event) => setNew({ title, content: event.target.value })} />
          </div>
          <div className="tools">
            <button onClick={() => nova()} disabled={title == "" || content == ""}>nova</button>
            <button onClick={() => remove()} disabled={selected == ""}>remover</button>
            <button onClick={() => editar()} disabled={selected == "" || title == "" || content == ""}>editar</button>
          </div>
        </div>
      )}
    </>
  )
}
