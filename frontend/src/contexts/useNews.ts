import { useContext } from "react";
import { NewsContextData } from "./NewsProvider";
import { NewsContext } from "./NewsContext";

export const useNews = (): NewsContextData => {
  const context = useContext(NewsContext)
  if (!context) {
    throw new Error("useNews deve ser usado dentro de um NewsProvider")
  }
  return context
}
