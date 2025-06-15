namespace MapeamentoRedeApi.Models
{
    public class Cabo
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public int QuantidadeFibras { get; set; }
        public int CaixaId { get; set; } // Caixa de origem
        public string Sentido { get; set; } // Ex: "Saída", "Entrada", etc.
        public string ProximaCaixaEndereco { get; set; } // Endereço da próxima caixa
    }
}