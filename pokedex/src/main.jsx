import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import "./index.css";
import App from "./App.jsx";

import Home from "./components/subpages/Home.jsx";
import Login from "./components/subpages/Login.jsx";
import Register from "./components/subpages/Register.jsx";
import Favourites from "./components/subpages/Favourites.jsx";
import Arena from "./components/subpages/Arena.jsx";
import Ranking from "./components/subpages/Ranking.jsx";
import Edition from "./components/subpages/Edition.jsx";
import NotFound from "./components/subpages/NotFound.jsx";

import { ThemeProvider } from "./context/ThemeContext.jsx";
import { LoginProvider } from "./context/LoginContext.jsx";
import { GlobalProvider } from "./context/GlobalContext.jsx";
import PokemonDetailsSite from "./components/subpages/PokemonDetailsSite.jsx";
import CreateNewPokemon from "./components/subpages/CreateNewPokemon.jsx";
import EditForm from "./components/subpages/EditForm.jsx";

const router = createBrowserRouter([
  {
    element: <App />,
    path: "/",
    children: [
      { element: <Home />, path: "/" },
      { element: <Login />, path: "/login" },
      { element: <Register />, path: "/register" },
      { element: <Favourites />, path: "/favourites" },
      { element: <Arena />, path: "/arena" },
      { element: <Ranking />, path: "/ranking" },
      { element: <Edition />, path: "/edition" },
      { element: <NotFound />, path: "*" },
      { element: <PokemonDetailsSite />, path: "/pokemon/:id" },
      { element: <CreateNewPokemon />, path: "/create" },
      { element: <EditForm />, path: "/editForm/:id" },
      { element: <NotFound />, path: "*" },
    ],
  },
]);

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <ThemeProvider>
      <LoginProvider>
        <GlobalProvider>
          <SnackbarProvider>
            <RouterProvider router={router} />
          </SnackbarProvider>
        </GlobalProvider>
      </LoginProvider>
    </ThemeProvider>
  </StrictMode>
);
