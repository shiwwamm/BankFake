namespace FakeBank.DTO
{
    public class TransactionDTO
    {
        public int TransactionId { get; set; }
        public decimal Amount { get; set; }
        public int FromAccountId { get; set; }
        public int ToAccountId { get; set; }
    }

    public class CreateTransactionDTO
    {
        public decimal Amount { get; set; }
        public int FromAccountId { get; set; }
        public int ToAccountId { get; set; }
    }
}
