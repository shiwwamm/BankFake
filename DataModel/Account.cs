using System;
using System.Collections.Generic;

namespace DataModel;

public partial class Account
{
    public int AccountId { get; set; }

    public int AccountNumber { get; set; }

    public int UserId { get; set; }

    public decimal Balance { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<Transaction> TransactionFromAccounts { get; set; } = new List<Transaction>();

    public virtual ICollection<Transaction> TransactionToAccounts { get; set; } = new List<Transaction>();

    public virtual User User { get; set; } = null!;
}
