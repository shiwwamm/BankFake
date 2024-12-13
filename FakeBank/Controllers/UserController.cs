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
    public class UserController : ControllerBase
    {
        private readonly FakeBankDbContext _context;

        public UserController(FakeBankDbContext context)
        {
            _context = context;
        }


        [HttpGet]
        //[Authorize]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetUsers()
        {
            var users = await _context.Users.Select(u => new UserDTO
            {
                UserId = u.UserId,
                Username = u.Username,
                Email = u.Email,
                PhoneNumber = u.PhoneNumber
            }).ToListAsync();

            return Ok(users);
        }

        [HttpGet("ids")]
        public async Task<ActionResult<IEnumerable<int>>> GetUserIds()
        {
            var userIds = await _context.Users.Select(u => u.UserId).ToListAsync();
            return Ok(userIds);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDTO>> GetUser(int id)
        {
            var user = await _context.Users.Select(u => new UserDTO
            {
                UserId = u.UserId,
                Username = u.Username,
                Email = u.Email,
                PhoneNumber = u.PhoneNumber
            }).FirstOrDefaultAsync(u => u.UserId == id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpPost]
        public async Task<ActionResult<UserDTO>> PostUser(CreateUserDTO createUserDto)
        {
            var user = new User
            {
                Username = createUserDto.Username,
                Email = createUserDto.Email,
                PhoneNumber = createUserDto.PhoneNumber
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var userDto = new UserDTO
            {
                UserId = user.UserId,
                Username = user.Username,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber
            };

            return CreatedAtAction(nameof(GetUser), new { id = user.UserId }, userDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, UpdateUserDTO updateUserDto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            user.Username = updateUserDto.Username;
            user.Email = updateUserDto.Email;
            user.PhoneNumber = updateUserDto.PhoneNumber;

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
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
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.UserId == id);
        }

    }
}