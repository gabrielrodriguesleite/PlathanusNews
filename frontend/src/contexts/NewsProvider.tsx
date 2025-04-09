import axios from "axios";
// TODO: useQuery ao invés de axios
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { NewsContext } from "./NewsContext";
import { useAuth } from "./useAuth";

interface News {
  id: string;
  title: string;
  content: string;
  User: { name: string };
}

export interface NewsContextData {
  news: News[];
  refetch: () => void;
  add: ({ title, content }: { title: string, content: string }) => void;
  del: (id: number) => void;
  update: (id: number, { title, content }: { title: string, content: string }) => void;
  isLoading: boolean;
}

interface NewsProviderProps {
  children: ReactNode
}

export const NewsProvider: React.FC<NewsProviderProps> = ({ children }) => {
  const { token, isAuthenticated } = useAuth()
  const [loading, setIsLoading] = useState(true)
  const [loadedNews, setNews] = useState<News[]>([])

  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/'
  const URL_NEWS = BASE_URL + 'news'

  const refetch = useCallback(() => {
    setIsLoading(true)
    const config = { headers: { "Authorization": `Bearer ${token}` } }
    axios.get(URL_NEWS, config)
      .then(resp => {
        if (resp.status == 200 && !!resp.data) {
          setNews(resp.data)
        }
      })
      .catch(error => {
        alert("Erro ao carregar as notícias")
        console.error(error)
      })
      .finally(() => setIsLoading(false))
  }, [URL_NEWS, token])

  useEffect(() => {
    if (isAuthenticated) {
      refetch()
    }
  }, [isAuthenticated, refetch])

  const add = useCallback(({ title, content }: { title: string; content: string }) => {
    const config = { headers: { "Authorization": `Bearer ${token}` } }
    const data = { title, content }
    axios.post(URL_NEWS, data, config)
      .then(resp => {
        if (resp.status != 201) {
          throw new Error(resp.data.error)
        }
      })
      .catch(error => {
        console.error(error)
        alert("Erro ao adicionar notícia.")
      })
      .finally(() => refetch())
  }, [URL_NEWS, refetch, token])

  const del = useCallback((id: number) => {
    const config = { headers: { "Authorization": `Bearer ${token}` } }
    axios.delete(URL_NEWS + `/${id}`, config)
      .then(resp => {
        if (resp.status != 204) {
          throw new Error(resp.data.error)
        }
      })
      .catch(error => {
        console.error(error)
        alert(`Erro ao remover notícia id: ${id}`)
      })
      .finally(() => refetch())
  }, [URL_NEWS, refetch, token])

  const update = useCallback((id: number, { title, content }: { title: string, content: string }) => {
    const config = { headers: { "Authorization": `Bearer ${token}` } }
    const data = { title, content }
    axios.put(URL_NEWS + `/${id}`, data, config)
      .then(resp => {
        if (resp.status != 200) {
          throw new Error(resp.data.error)
        }
      })
      .catch(error => {
        console.error(error)
        alert(`Erro ao editar a notícia id: ${id}`)
      }
      )
      .finally(() => refetch())
  }, [URL_NEWS, refetch, token])

  const contextValue: NewsContextData = {
    news: loadedNews,
    isLoading: loading,
    refetch,
    add,
    del,
    update,
  }

  return (
    <NewsContext.Provider value={contextValue} >
      {children}
    </NewsContext.Provider>
  )
}
