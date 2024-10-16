using AlunosApi.Entities;
using AlunosApi.Models;
using AlunosApi.Services.Alunos;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AlunosApi.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class AlunosController : ControllerBase
{
    private readonly IAlunoService _alunoService;

    public AlunosController(IAlunoService alunoService)
    {
        _alunoService = alunoService;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IAsyncEnumerable<Aluno>>> GetAlunos()
    {
        var alunos = await _alunoService.GetAll();
        return Ok(alunos);
    }

    [HttpGet("{id:int}", Name = "GetAluno")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<Aluno>> GetAluno(int id)
    {
        var aluno = await _alunoService.Get(id);

        return Ok(aluno);
    }

    [HttpGet("GetByNome")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IAsyncEnumerable<Aluno>>> GetByNome([FromQuery] string nome)
    {
        var alunos = await _alunoService.GetByNome(nome);

        if (alunos.Count() > 0) return Ok(alunos);
        else return NotFound("Nenhum aluno encontrado");
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<ActionResult> Create(AlunoModel aluno)
    {
        Aluno newAluno = new Aluno()
        {
            Nome = aluno.Nome,
            Email = aluno.Email,
            Idade = aluno.Idade,
            DataCadastro = DateTime.Now
        };

        await _alunoService.Create(newAluno);

        return CreatedAtRoute(nameof(GetAluno), new { id = newAluno.Id }, newAluno);
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> Edit(int id, [FromBody] AlunoModel aluno)
    {
        if (aluno.Id == id)
        {
            Aluno updateAluno = new Aluno()
            {
                Id = aluno.Id,
                Nome = aluno.Nome,
                Email = aluno.Email,
                Idade = aluno.Idade,
                DataCadastro = DateTime.Now
            };

            await _alunoService.Update(updateAluno);

            return Ok("Aluno atualizado com sucesso");
        }
        else
        {
            return BadRequest("Dados inconsistentes");
        }
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> Delete(int id)
    {
        var aluno = await _alunoService.Get(id);

        if (aluno != null)
        {
            await _alunoService.Delete(aluno);

            return Ok("Aluno excluído com sucesso");
        }
        else
        {
            return NotFound("Aluno não encontrado");
        }
    }
}
