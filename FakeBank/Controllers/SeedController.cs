using CsvHelper;
using CsvHelper.Configuration;
using DataModel;
using FakeBank.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Formats.Asn1;
using System.Globalization;

namespace FakeBank.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeedController (FakeBankDbContext db, IHostEnvironment environment) : ControllerBase
    {

        private readonly string _pathName = Path.Combine(environment.ContentRootPath, "./Data/FakeData.csv");

        [HttpPost("Users")]
        public async Task<IActionResult> ImportUsersAsync()
        {
            Dictionary<string, User> usersByEmail = db.Users.AsNoTracking().ToDictionary( e => e.Email, StringComparer.OrdinalIgnoreCase);

            CsvConfiguration config = new(CultureInfo.InvariantCulture)
            {
                HasHeaderRecord = true,
                HeaderValidated = null
            };

            using StreamReader reader = new(_pathName);
            using CsvReader csv = new(reader, config);

            List<AllFakeData> records = csv.GetRecords<AllFakeData>().ToList();

            foreach (AllFakeData record in records)
            {

                if (usersByEmail.ContainsKey(record.Email))
                {
                    continue;
                }

                User user = new()
                {
                    Username = record.Username,
                    Email = record.Email,
                    PhoneNumber = record.Phone_number,
                };

                await db.Users.AddAsync(user);
                usersByEmail.Add(record.Email, user);
            }

            await db.SaveChangesAsync();

            return new JsonResult("Users Added");
        }


        [HttpPost("Accounts")]
        public async Task<IActionResult> ImportAccountsAsync()
        {
            Dictionary<string, User> accountUsers = await db.Users.ToDictionaryAsync(e => e.Email);

            CsvConfiguration config = new(CultureInfo.InvariantCulture)
            {
                HasHeaderRecord = true,
                HeaderValidated = null
            };

            using (StreamReader reader = new(_pathName))
            using (CsvReader csv = new(reader, config))
            {

                IEnumerable<AllFakeData>? records = csv.GetRecords<AllFakeData>();

                foreach (AllFakeData record in records)
                {
                    if (!accountUsers.TryGetValue(record.Email, out User? user))
                    {
                        Console.WriteLine($"Not found user for {record.Account_number}");
                        return NotFound(record);
                    }

                    Account account = new()
                    {
                        AccountNumber = record.Account_number,
                        UserId = record.User_id,
                        Balance = record.Balance,
                    };

                    db.Accounts.Add(account);
                }
                await db.SaveChangesAsync();
            }

            return new JsonResult("Accounts Added");
        }
    }

}

