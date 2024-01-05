using AngularAuthAPI.Context;
using AngularAuthAPI.Helpers;
using AngularAuthAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Text.RegularExpressions;

namespace AngularAuthAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _authContext;

        public UserController(AppDbContext context)
        {
            _authContext = context;
        }

        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] User userObj)
        {
            if (userObj == null)
            {
                return BadRequest();
            }

            var user = await _authContext.Users.FirstOrDefaultAsync(x => x.Username == userObj.Username );
            if (user == null)
            {
                return NotFound(new { Message = "User Not Found!" });
            }

            if(!PasswordHasher.VerifyPassword(userObj.Password, user.Password))
            {
                return BadRequest(new { Message = "Password is Incorrect" });
            }

            return Ok(new
            {
                Message = "Login Success!"
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] User userObj)
        {
            if (userObj == null)
            {
                return BadRequest();
            }

            // Check username
            if(await CheckUserNameExistAsync(userObj.Username))
                return BadRequest(new { Message = "Username Already Exist!" });

            // Check email
            if (await CheckEmailExistAsync(userObj.Email))
                return BadRequest(new { Message = "Email Already Exist!" });

            // Check password strength
            var pass = CheckPasswordStrength(userObj.Password);
            if(!string.IsNullOrEmpty(pass)) 
                return BadRequest(new { Message = pass.ToString() });

            userObj.Password = PasswordHasher.HashPassword(userObj.Password);
            userObj.Role = "User";
            userObj.Token = "";

            await _authContext.Users.AddAsync(userObj);
            await _authContext.SaveChangesAsync();
            return Ok(new
            {
                Message = "User Registered!"
            });
        }

        private async Task<bool> CheckUserNameExistAsync(string username)
        {
            return await _authContext.Users.AnyAsync(x => x.Username == username);
        }

        private async Task<bool> CheckEmailExistAsync(string email)
        {
            return await _authContext.Users.AnyAsync(x => x.Email == email);
        }

        private string CheckPasswordStrength(string password)
        {
            StringBuilder sb = new StringBuilder();

            if(password.Length < 2)
                sb.Append("Minimum password length should be 2" + Environment.NewLine);
            if (!(Regex.IsMatch(password, "[a-z]") && Regex.IsMatch(password, "[A-Z]") &&
                Regex.IsMatch(password, "[0-9]")))
                sb.Append("Password should be Alpanumeric" + Environment.NewLine);
            if(!(Regex.IsMatch(password, "[<,>,@,!,#,$,%,^,&,*,(,),+,\\[,\\],{,},?,:,;,|,',\\,.,/,~,`,-,=]")))
                sb.Append("Password should contain special chars" + Environment.NewLine);

            return sb.ToString();
        }
    }
}
