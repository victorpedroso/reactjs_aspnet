namespace AlunosApi.Services.Account;

public interface IAuthenticateService
{
    Task<bool> Authenticate(string email, string password);
    Task<bool> Register(string email, string password);
    Task Logout();
}
