import './styles.css';
import { FiUserPlus, FiCornerDownLeft } from 'react-icons/fi';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchAluno, createAluno, updateAluno } from '../../services/apiService';
import { AlunoModel } from '../../api/api';

export default function NovoAluno() {
    const navigate = useNavigate();
    const { alunoId } = useParams();
    const [id, setId] = useState('');
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [idade, setIdade] = useState('');

    const alunoIdNumber = Number(alunoId);

    const loadAluno = async () => {
        try {
            const response = await fetchAluno(alunoIdNumber);
            setId(String(response.id));
            setNome(response.nome ?? '');
            setEmail(response.email ?? '');
            setIdade(response.idade !== undefined ? String(response.idade) : '');
        }
        catch (error) {
            alert(error);
            navigate('/alunos');
        }
    };

    const createOrUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const alunoData: AlunoModel = {
            id: alunoIdNumber === 0 ? undefined : alunoIdNumber,
            nome,
            email,
            idade: idade !== '' ? Number(idade) : undefined,
        };

        try {
            if (alunoIdNumber === 0) {
                await createAluno(alunoData);
            }
            else {
                await updateAluno(alunoIdNumber, alunoData);
            }
            navigate('/alunos');
        }
        catch (error) {
            alert('Erro ao salvar aluno: ' + error);
        }
    };

    useEffect(() => {
        if (alunoIdNumber === 0)
            return;
        else {
            loadAluno();
        }
    }, [alunoIdNumber]);

    return (
        <div className='novo-aluno-container'>
            <div className='content'>
                <h1></h1>
                <section className='form'>
                    <FiUserPlus size='105' color='#17202a' />
                    <h1>{alunoIdNumber === 0 ? 'Incluir novo aluno' : 'Atualizar aluno'}</h1>
                    <Link className='back-link' to='/alunos'>
                        <FiCornerDownLeft size='25' color='#17202a' />
                        Retornar
                    </Link>
                </section>
                <form onSubmit={createOrUpdate}>
                    <input type="text" placeholder='Nome' value={nome} onChange={(e) => setNome(e.target.value)} />
                    <input type="text" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="text" placeholder='Idade' value={idade} onChange={(e) => setIdade(e.target.value)} />
                    <button className='button' type='submit'>{alunoIdNumber === 0 ? 'Incluir' : 'Editar'}</button>
                </form>

            </div>

        </div>
    )
}
