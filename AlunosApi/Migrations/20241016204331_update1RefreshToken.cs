using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AlunosApi.Migrations
{
    /// <inheritdoc />
    public partial class update1RefreshToken : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Alunos",
                keyColumn: "Id",
                keyValue: 1,
                column: "DataCadastro",
                value: new DateTime(2024, 10, 16, 17, 43, 31, 326, DateTimeKind.Local).AddTicks(5014));

            migrationBuilder.UpdateData(
                table: "Alunos",
                keyColumn: "Id",
                keyValue: 2,
                column: "DataCadastro",
                value: new DateTime(2024, 10, 16, 17, 43, 31, 326, DateTimeKind.Local).AddTicks(5030));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Alunos",
                keyColumn: "Id",
                keyValue: 1,
                column: "DataCadastro",
                value: new DateTime(2024, 10, 16, 17, 42, 38, 784, DateTimeKind.Local).AddTicks(9784));

            migrationBuilder.UpdateData(
                table: "Alunos",
                keyColumn: "Id",
                keyValue: 2,
                column: "DataCadastro",
                value: new DateTime(2024, 10, 16, 17, 42, 38, 784, DateTimeKind.Local).AddTicks(9799));
        }
    }
}
