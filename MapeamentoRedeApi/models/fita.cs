namespace MapeamentoRedeApi.Models
{
    public class Fita
    {
        public int FitaId { get; set; }
        public int Numero { get; set; } // 1 a 4
        public string Cor { get; set; }
        public int CaboId { get; set; }
        public Cabo Cabo { get; set; }
    }
}
