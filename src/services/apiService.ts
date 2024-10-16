import api from '../api/index';
import { getAuthHeader } from '../api/authHeader';
import { Aluno, AlunoModel } from '../api/api';

export const fetchAlunos = async () => {
    const headers = getAuthHeader();
    return await api.api.alunosList( { headers });
};

export const fetchAluno = async (id: number): Promise<Aluno> => {
    const headers = getAuthHeader();
    const response = await api.api.getAluno(id, { headers });
    return response.data; 
};

export const createAluno = async (data: AlunoModel) => {
    const headers = getAuthHeader();
    return await api.api.alunosCreate(data, { headers });
};

export const updateAluno = async (id: number, data: AlunoModel) => {
    const headers = getAuthHeader();
    return await api.api.alunosUpdate(id, data, { headers });
};

export const deleteAluno = async (id: number) => {
    const headers = getAuthHeader();
    return await api.api.alunosDelete(id, { headers });
};

export const logout = async () => {
    localStorage.removeItem('email');
    localStorage.removeItem('authToken');
    localStorage.clear();
};