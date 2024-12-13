using DataModel;
using FakeBank.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Transactions;
using Transaction = DataModel.Transaction;

namespace FakeBank.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private readonly FakeBankDbContext _context;
        private readonly ILogger<TransactionController> _logger;

        public TransactionController(FakeBankDbContext context, ILogger<TransactionController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TransactionDTO>>> GetTransactions()
        {
            var transactions = await _context.Transactions.Select(t => new TransactionDTO
            {
                TransactionId = t.TransactionId,
                Amount = t.Amount,
                FromAccountId = t.FromAccountId,
                ToAccountId = t.ToAccountId
            }).ToListAsync();

            return Ok(transactions);
        }

        [HttpPost]
        public async Task<ActionResult<TransactionDTO>> PostTransaction(CreateTransactionDTO createTransactionDto)
        {
            using var transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled);

            try
            {
                var senderAccount = await _context.Accounts.FirstOrDefaultAsync(a => a.AccountId == createTransactionDto.FromAccountId);
                var receiverAccount = await _context.Accounts.FirstOrDefaultAsync(a => a.AccountId == createTransactionDto.ToAccountId);

                if (senderAccount == null || receiverAccount == null)
                {
                    _logger.LogWarning("Invalid account details provided.");
                    return BadRequest("Sender or Receiver account does not exist.");
                }

                if (senderAccount.Balance < createTransactionDto.Amount)
                {
                    _logger.LogWarning("Insufficient balance for transaction.");
                    return BadRequest("Insufficient balance in the sender's account.");
                }

                // Deduct from sender
                senderAccount.Balance -= createTransactionDto.Amount;

                // Add to receiver
                receiverAccount.Balance += createTransactionDto.Amount;

                var transaction = new Transaction
                {
                    Amount = createTransactionDto.Amount,
                    FromAccountId = createTransactionDto.FromAccountId,
                    ToAccountId = createTransactionDto.ToAccountId
                };

                _context.Transactions.Add(transaction);
                await _context.SaveChangesAsync();

                transactionScope.Complete();

                var transactionDto = new TransactionDTO
                {
                    TransactionId = transaction.TransactionId,
                    Amount = transaction.Amount,
                    FromAccountId = transaction.FromAccountId,
                    ToAccountId = transaction.ToAccountId
                };

                return CreatedAtAction(nameof(GetTransactions), new { id = transaction.TransactionId }, transactionDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while processing the transaction.");
                return StatusCode(500, "An error occurred while processing the transaction.");
            }
        }
    }
}
