using AlunosApi.Models;
using AlunosApi.Services.Account;
using AlunosApi.Services.Token;
using Microsoft.AspNetCore.Identity;
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
    private readonly IRefreshTokenService _refreshTokenService;
    private readonly UserManager<IdentityUser> _userManager;

    public AccountController(IConfiguration config, IAuthenticateService authenticateService, IRefreshTokenService refreshTokenService, UserManager<IdentityUser> userManager)
    {
        _config = config;
        _authenticateService = authenticateService;
        _refreshTokenService = refreshTokenService;
        _userManager = userManager;
    }

    [HttpPost("Register")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
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
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserToken>> Login([FromBody] LoginModel login)
    {
        var result = await _authenticateService.Authenticate(login.Email, login.Password);

        if (!result)
        {
            ModelState.AddModelError("LoginUser", "Login invalido");
            return BadRequest(ModelState);
        }

        var user = await _userManager.FindByEmailAsync(login.Email);
        if (user == null)
        {
            return NotFound("Usuário não encontrado.");
        }

        var token = GenerateToken(new LoginModel { Email = user.Email });

        var refreshToken = await _refreshTokenService.GenerateRefreshToken(user.Id);

        return new UserToken
        {
            Token = token.Value.Token,
            Expiration = token.Value.Expiration,
            RefreshToken = refreshToken
        };
    }

    [HttpPost("RefreshToken")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserToken>> RefreshToken([FromBody] RefreshTokenModel model)
    {
        if (string.IsNullOrEmpty(model.RefreshToken))
        {
            return BadRequest("Refresh token não pode ser nulo ou vazio.");
        }

        var valid = await _refreshTokenService.ValidateRefreshToken(model.RefreshToken);

        if (!valid)
        {
            return BadRequest("Refresh token expirado.");
        }

        var tokenDetails = await _refreshTokenService.GetRefreshToken(model.RefreshToken);

        if (tokenDetails == null)
        {
            return BadRequest("Refresh token inválido.");
        }

        var userId = tokenDetails.UserId;

        var user = await _userManager.FindByIdAsync(userId);

        if (user == null) 
        {
            return NotFound("Usuário não encontrado.");
        }

        var newToken = GenerateToken(new LoginModel { Email = user.Email });
        var newRefreshToken = await _refreshTokenService.GenerateRefreshToken(userId);


        return new UserToken
        {
            Token = newToken.Value.Token,
            Expiration = newToken.Value.Expiration,
            RefreshToken = newRefreshToken
        };
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

        var expiration = DateTime.Now.AddMinutes(2);

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
