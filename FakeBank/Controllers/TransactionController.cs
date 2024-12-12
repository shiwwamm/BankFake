using DataModel;
using FakeBank.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FakeBank.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
            private readonly FakeBankDbContext _context;

            public TransactionController(FakeBankDbContext context)
            {
                _context = context;
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

            [HttpGet("{id}")]
            public async Task<ActionResult<TransactionDTO>> GetTransaction(int id)
            {
                var transaction = await _context.Transactions.Select(t => new TransactionDTO
                {
                    TransactionId = t.TransactionId,
                    Amount = t.Amount,
                    FromAccountId = t.FromAccountId,
                    ToAccountId = t.ToAccountId
                }).FirstOrDefaultAsync(t => t.TransactionId == id);

                if (transaction == null)
                {
                    return NotFound();
                }

                return Ok(transaction);
            }

            [HttpPost]
            public async Task<ActionResult<TransactionDTO>> PostTransaction(CreateTransactionDTO createTransactionDto)
            {
                var transaction = new Transaction
                {
                    Amount = createTransactionDto.Amount,
                    FromAccountId = createTransactionDto.FromAccountId,
                    ToAccountId = createTransactionDto.ToAccountId
                };

                _context.Transactions.Add(transaction);
                await _context.SaveChangesAsync();

                var transactionDto = new TransactionDTO
                {
                    TransactionId = transaction.TransactionId,
                    Amount = transaction.Amount,
                    FromAccountId = transaction.FromAccountId,
                    ToAccountId = transaction.ToAccountId
                };

                return CreatedAtAction(nameof(GetTransaction), new { id = transaction.TransactionId }, transactionDto);
            }

            [HttpDelete("{id}")]
            public async Task<IActionResult> DeleteTransaction(int id)
            {
                var transaction = await _context.Transactions.FindAsync(id);
                if (transaction == null)
                {
                    return NotFound();
                }

                _context.Transactions.Remove(transaction);
                await _context.SaveChangesAsync();

                return NoContent();
            }

            private bool TransactionExists(int id)
            {
                return _context.Transactions.Any(e => e.TransactionId == id);
            }
    }
}
