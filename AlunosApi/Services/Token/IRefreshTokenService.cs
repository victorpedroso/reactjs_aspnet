using AlunosApi.Entities;

namespace AlunosApi.Services.Token;

public interface IRefreshTokenService
{
    Task<string> GenerateRefreshToken(string userId);
    Task<RefreshToken> GetRefreshToken(string token);
    Task<bool> ValidateRefreshToken(string token);
}
