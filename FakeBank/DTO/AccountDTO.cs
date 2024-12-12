namespace FakeBank.DTO
{
    public class AccountDTO
    {
        public int AccountId { get; set; }
        public int AccountNumber { get; set; }
        public decimal Balance { get; set; }
        public int UserId { get; set; }
    }

    public class CreateAccountDTO
    {
        public int AccountNumber { get; set; } 
        public decimal Balance { get; set; }
        public int UserId { get; set; }
    }

    public class UpdateAccountDTO
    {
        public decimal Balance { get; set; }
    }
}
