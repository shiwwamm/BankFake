using DataModel;
using FakeBank.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FakeBank.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController(FakeBankDbContext context) : ControllerBase
    {
        private readonly FakeBankDbContext _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AccountDTO>>> GetAccounts()
        {
            var accounts = await _context.Accounts.Select(a => new AccountDTO
            {
                AccountId = a.AccountId,
                AccountNumber = a.AccountNumber,
                Balance = a.Balance,
                UserId = a.UserId
            }).ToListAsync();

            return Ok(accounts);
        }

        [HttpGet("useraccounts/{id}")]
        public async Task<ActionResult<IEnumerable<AccountDTO>>> GetUserAccounts(int id)
        {
            var accounts = await _context.Accounts
                .Where(a => a.UserId == id)
                .Select(a => new AccountDTO
                {
                    AccountId = a.AccountId,
                    AccountNumber = a.AccountNumber,
                    Balance = a.Balance,
                    UserId = a.UserId
                }).ToListAsync();

            return Ok(accounts);
          }

        [HttpGet("{id}")]
        public async Task<ActionResult<AccountDTO>> GetAccount(int id)
        {
            var account = await _context.Accounts.Select(a => new AccountDTO
            {
                AccountId = a.AccountId,
                AccountNumber = a.AccountNumber,
                Balance = a.Balance,
                UserId = a.UserId
            }).FirstOrDefaultAsync(a => a.AccountId == id);

            if (account == null)
            {
                return NotFound();
            }

            return Ok(account);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<AccountDTO>> PostAccount(CreateAccountDTO createAccountDto)
        {
            var account = new Account
            {
                AccountNumber = createAccountDto.AccountNumber,
                Balance = createAccountDto.Balance,
                UserId = createAccountDto.UserId
            };

            _context.Accounts.Add(account);
            await _context.SaveChangesAsync();

            var accountDto = new AccountDTO
            {
                AccountId = account.AccountId,
                AccountNumber = account.AccountNumber,
                Balance = account.Balance,
                UserId = account.UserId
            };

            return CreatedAtAction(nameof(GetAccount), new { id = account.AccountId }, accountDto);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutAccount(int id, UpdateAccountDTO updateAccountDto)
        {
            var account = await _context.Accounts.FindAsync(id);
            if (account == null)
            {
                return NotFound();
            }

            account.Balance = updateAccountDto.Balance;

            _context.Entry(account).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AccountExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteAccount(int id)
        {
            var account = await _context.Accounts.FindAsync(id);
            if (account == null)
            {
                return NotFound();
            }

            _context.Accounts.Remove(account);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AccountExists(int id)
        {
            return _context.Accounts.Any(e => e.AccountId == id);
        }





    }
}
