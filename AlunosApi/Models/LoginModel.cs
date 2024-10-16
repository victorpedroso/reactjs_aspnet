using System.ComponentModel.DataAnnotations;

namespace AlunosApi.Models;

public class LoginModel
{
    [Required(ErrorMessage = "E-mail obrigatório")]
    [EmailAddress(ErrorMessage = "Formado de e-mail invalido")]
    public string? Email { get; set; }
    [Required(ErrorMessage = "Senha obrigatória")]
    [StringLength(20, ErrorMessage = "A senha deve ter no minimo 5 caracteres", MinimumLength = 5)]
    [DataType(DataType.Password)]
    public string? Password { get; set; }

}
