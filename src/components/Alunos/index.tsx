import './styles.css';
import { Link, useNavigate } from 'react-router-dom';
import { FiXCircle, FiEdit, FiUserX } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { fetchAlunos, logout, deleteAluno } from '../../services/apiService';
import { Aluno } from '../../api/api';

export default function Alunos() {
  const [searchInput, setSearchInput] = useState('');
  const [filter, setFilter] = useState<Aluno[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getAlunos = async () => {
      try {
        const response = await fetchAlunos();
        setAlunos(response.data);
      }
      catch (error) {
        console.error(error);
      }
    };

    getAlunos();
    
  }, []);

  const email = localStorage.getItem('email');

  const handleLogout = async () => {
    await logout(); 
    navigate('/'); 
  };

  const editAluno = (id:number) => {
    try {
      navigate(`/aluno/novo/${id}`);
    }
    catch (error) {
      alert(error);
    }
  };

  const searchAlunos = (searchValue: string) => {
    setSearchInput(searchValue);
    if (searchValue !== '') {
      const dataFiltered = alunos.filter((item) => {
        return Object.values(item).join('').toLocaleLowerCase().includes(searchInput.toLocaleLowerCase());
      });
      setFilter(dataFiltered);
    }
    else {
      setFilter(alunos);
    }
  };

  const deleteAlunoId = async (id: number) => {
    try {
      if (window.confirm('Deseja deletar o aluno de id = ' + id + '?')) {
        await deleteAluno(id);
        const updatedAlunos = alunos.filter(aluno => aluno.id !== id);
        setAlunos(updatedAlunos);

        if (searchInput.length > 0) {
          const updatedFilter = updatedAlunos.filter(aluno => 
            Object.values(aluno).join('').toLocaleLowerCase().includes(searchInput.toLocaleLowerCase())
          );
          setFilter(updatedFilter);
        }
      }
      else {
        return;
      }
    }
    catch (error) {
      alert(error);
    }
  }

  return (
    <div className='aluno-container'>
        <header>
            <span>Bem vindo, <strong>{email}</strong>!</span>
            <Link className='button' to='/aluno/novo/0'>Novo aluno</Link>
            <button type='button' onClick={handleLogout}>
                <FiXCircle size={35} color='#17202a'/>
            </button>
        </header>
        <form onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder='Filtrar por nome' onChange={(e) => searchAlunos(e.target.value)} />
        </form>
        <h1>Relação de alunos</h1>
        {searchInput.length > 1 ? (
          <>
            {filter.length > 0 ? (
              <ul>
                {filter.map(aluno => (
                  <li key={aluno.id}>
                    <b>Nome:</b> {aluno.nome}
                    <br />
                    <br />
                    <b>Email: </b> {aluno.email}
                    <br />
                    <br />
                    <b>Idade:</b> {aluno.idade}
                    <br />
                    <br />
                    <button type='button' onClick={() => editAluno(Number(aluno.id))}>
                      <FiEdit size='25' color='#17202a'/>
                    </button>
                    <button type='button' onClick={() => deleteAlunoId(Number(aluno.id))}>
                      <FiUserX size='25' color='#17202a'/>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhum aluno encontrado com o critério "{searchInput}".</p>
            )}
          </>
        ) : (
          <ul>
            {alunos.map(aluno => (
              <li key={aluno.id}>
                <b>Nome:</b> {aluno.nome}
                <br />
                <br />
                <b>Email: </b> {aluno.email}
                <br />
                <br />
                <b>Idade:</b> {aluno.idade}
                <br />
                <br />
                <button type='button' onClick={() => editAluno(Number(aluno.id))}>
                  <FiEdit size='25' color='#17202a'/>
                </button>
                <button type='button' onClick={() => deleteAlunoId(Number(aluno.id))}>
                  <FiUserX size='25' color='#17202a'/>
                </button>
              </li>
            ))}
          </ul>
        )}
    </div>
  );
}
