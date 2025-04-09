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

  const contextValue: NewsContextData = {
    news: loadedNews,
    isLoading: loading,
    refetch,
  }

  return (
    <NewsContext.Provider value={contextValue} >
      {children}
    </NewsContext.Provider>
  )
}
