using AlunosApi.Models;
using AlunosApi.Services.Account;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AlunosApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AccountController : ControllerBase
{
    private readonly IConfiguration _config;
    private readonly IAuthenticateService _authenticateService;

    public AccountController(IConfiguration config, IAuthenticateService authenticateService)
    {
        _config = config;
        _authenticateService = authenticateService;
    }

    [HttpPost("Register")]
    public async Task<ActionResult<UserToken>> CreateUser([FromBody] RegisterModel user)
    {
        if (user.Password != user.ConfirmPassword)
        {
            ModelState.AddModelError("ConfirmPassword", "As senhas não conferem");

            return BadRequest(ModelState);
        }

        var result = await _authenticateService.Register(user.Email, user.Password);

        if (result) return Ok();
        else
        {
            ModelState.AddModelError("CreateUser", "Registro invalido");
            return BadRequest(ModelState);
        }
    }

    [HttpPost("Login")]
    public async Task<ActionResult<UserToken>> Login([FromBody] LoginModel login)
    {
        var result = await _authenticateService.Authenticate(login.Email, login.Password);

        if (result) return GenerateToken(login);
        else
        {
            ModelState.AddModelError("LoginUser", "Login invalido");
            return BadRequest(ModelState);
        }
    }

    private ActionResult<UserToken> GenerateToken(LoginModel login)
    {
        var claims = new[]
        {
            new Claim("email", login.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var expiration = DateTime.Now.AddDays(30);

        JwtSecurityToken token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: expiration,
            signingCredentials: creds);

        return new UserToken()
        {
            Token = new JwtSecurityTokenHandler().WriteToken(token),
            Expiration = expiration
        };
    }
}
