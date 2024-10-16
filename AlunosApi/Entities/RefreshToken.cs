using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace AlunosApi.Entities;

public class RefreshToken
{
    public int Id { get; set; }
    public string? Token { get; set; }
    public DateTime Expiration { get; set; }
    public string UserId { get; set; }

    [ForeignKey("UserId")]
    public virtual IdentityUser User { get; set; }
}
