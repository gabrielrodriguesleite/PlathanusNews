import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "react-query";
import { App } from "./App";
import './index.css'

const root = document.getElementById("root");
const queryClient = new QueryClient()

ReactDOM.createRoot(root!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient} >
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode >
);
