import { createContext } from "react";
import { NewsContextData } from "./NewsProvider";

export const NewsContext = createContext<NewsContextData | undefined>(undefined)
