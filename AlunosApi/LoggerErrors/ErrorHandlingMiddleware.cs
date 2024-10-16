using System.Net;
using System.Text.Json;

namespace AlunosApi.LoggerErrors;

public class ErrorHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ErrorHandlingMiddleware> _logger;

    public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private Task HandleExceptionAsync(HttpContext context, Exception ex)
    {
        var response = new
        {
            StatusCode = (int)HttpStatusCode.InternalServerError,
            Message = "An unexpected error occurred."
        };

        if (ex is KeyNotFoundException)
        {
            response = new
            {
                StatusCode = (int)HttpStatusCode.NotFound,
                ex.Message
            };
        }

        _logger.LogError(ex, "An error occurred");

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = response.StatusCode;

        return context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }
}