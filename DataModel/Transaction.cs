using System;
using System.Collections.Generic;

namespace DataModel;

public partial class Transaction
{
    public int TransactionId { get; set; }

    public int FromAccountId { get; set; }

    public int ToAccountId { get; set; }

    public decimal Amount { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Account FromAccount { get; set; } = null!;

    public virtual Account ToAccount { get; set; } = null!;
}
