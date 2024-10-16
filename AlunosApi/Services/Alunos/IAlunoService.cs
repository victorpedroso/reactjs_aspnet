using AlunosApi.Entities;
using AlunosApi.Models;

namespace AlunosApi.Services.Alunos;

public interface IAlunoService
{
    Task<IEnumerable<Aluno>> GetAll();
    Task<Aluno> Get(int id);
    Task<IEnumerable<Aluno>> GetByNome(string nome);
    Task Create(Aluno aluno);
    Task Update(Aluno aluno);
    Task Delete(Aluno aluno);
}
