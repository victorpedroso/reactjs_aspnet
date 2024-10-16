using AlunosApi.Context;
using AlunosApi.Entities;
using AlunosApi.Models;
using Microsoft.EntityFrameworkCore;

namespace AlunosApi.Services.Alunos
{
    public class AlunosService : IAlunoService
    {
        private readonly AppDbContext _context;

        public AlunosService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Aluno>> GetAll()
        {
            return await _context.Alunos.ToListAsync();
        }

        public async Task<Aluno> Get(int id)
        {
            var aluno = await _context.Alunos.FindAsync(id);
            if (aluno == null)
            {
                throw new KeyNotFoundException($"Aluno com ID {id} não encontrado.");
            }
            return aluno;
        }

        public async Task<IEnumerable<Aluno>> GetByNome(string nome)
        {
            if (!string.IsNullOrWhiteSpace(nome))
            {
                return await _context.Alunos.Where(a => a.Nome.Contains(nome)).ToListAsync();
            }

            return await GetAll();
        }

        public async Task Create(Aluno aluno)
        {
            _context.Alunos.Add(aluno);
            await _context.SaveChangesAsync();
        }

        public async Task Update(Aluno aluno)
        {
            _context.Entry(aluno).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task Delete(Aluno aluno)
        {
            _context.Alunos.Remove(aluno);
            await _context.SaveChangesAsync();
        }
    }
}
