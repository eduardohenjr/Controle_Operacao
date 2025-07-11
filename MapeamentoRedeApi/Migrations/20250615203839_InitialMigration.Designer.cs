﻿// <auto-generated />
using MapeamentoRedeApi;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace MapeamentoRedeApi.Migrations
{
    [DbContext(typeof(MapeamentoRedeContext))]
    [Migration("20250615203839_InitialMigration")]
    partial class InitialMigration
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.6")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("MapeamentoRedeApi.Models.Cabo", b =>
                {
                    b.Property<int>("CaboId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("CaboId"));

                    b.Property<int>("CaixaId")
                        .HasColumnType("integer");

                    b.Property<int>("LoteCabo")
                        .HasColumnType("integer");

                    b.Property<string>("PosicaoFuro")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("ProximoLocal")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Sentido")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Tipo")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("CaboId");

                    b.ToTable("Cabos");
                });

            modelBuilder.Entity("MapeamentoRedeApi.Models.Caixa", b =>
                {
                    b.Property<int>("CaixaId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("CaixaId"));

                    b.Property<string>("Coordenadas")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Endereco")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("CaixaId");

                    b.ToTable("Caixas");
                });

            modelBuilder.Entity("MapeamentoRedeApi.Models.Fita", b =>
                {
                    b.Property<int>("FitaId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("FitaId"));

                    b.Property<int>("CaboId")
                        .HasColumnType("integer");

                    b.Property<string>("Cor")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("Numero")
                        .HasColumnType("integer");

                    b.HasKey("FitaId");

                    b.HasIndex("CaboId");

                    b.ToTable("Fitas");
                });

            modelBuilder.Entity("MapeamentoRedeApi.Models.Fita", b =>
                {
                    b.HasOne("MapeamentoRedeApi.Models.Cabo", "Cabo")
                        .WithMany()
                        .HasForeignKey("CaboId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Cabo");
                });
#pragma warning restore 612, 618
        }
    }
}
