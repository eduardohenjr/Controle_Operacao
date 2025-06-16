namespace MapeamentoRedeApi.Models
{
    public class Cabo
    {
        public int CaboId { get; set; }
        public int LoteCabo { get; set; }
        public string Tipo { get; set; }
        public int CaixaId { get; set; } // Caixa de origem
        public string PosicaoFuro { get; set; }
        public string Sentido { get; set; } // Ex: "Saída", "Entrada", etc.
        public string ProximoLocal { get; set; } // Endereço da próxima caixa
    }
}