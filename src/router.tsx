import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Alunos from "./components/Alunos";
import NovoAluno from "./components/NovoAluno";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route path="/alunos" element={<Alunos />} />
        <Route path="/aluno/novo/:alunoId" element={<NovoAluno />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router;
