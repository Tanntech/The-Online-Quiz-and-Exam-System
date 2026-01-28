using Microsoft.AspNetCore.Mvc;
using Online_Quiz_And_Exam_System.Models;
using Online_Quiz_API.DAL;

namespace Online_Quiz_And_Exam_System.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly UserDAL _dal;

        public AuthController(UserDAL dal)
        {
            _dal = dal;
        }


        [HttpPost("login")]
        public IActionResult Login([FromBody] User u)
        {
            if (string.IsNullOrEmpty(u.Email) || string.IsNullOrEmpty(u.Password))
                return BadRequest("Email and password are required");

            if (!u.Email.EndsWith("@gmail.com"))
                return BadRequest("Invalid email format");

            var user = _dal.ValidateUser(u.Email, u.Password);

            if (user == null)
                return Unauthorized("Invalid email or password");

            return Ok(user);
        }


        [HttpPost("register")]
        public IActionResult Register([FromBody] User u)
        {
            if (string.IsNullOrEmpty(u.Email) || !u.Email.EndsWith("@gmail.com"))
                return BadRequest("Email must be a valid @gmail.com address");

            if (!IsStrongPassword(u.Password))
                return BadRequest("Password does not meet complexity requirements");

            _dal.Register(u);
            return Ok("User registered successfully");
        }

        private bool IsStrongPassword(string password)
        {
            var regex = new System.Text.RegularExpressions.Regex(
                @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=])[A-Za-z\d@$!%*?&#^()_+\-=]{8,}$"
            );

            return regex.IsMatch(password);
        }


        [HttpPost("google")]
        public IActionResult GoogleLogin(User user)
        {
            var existingUser = _dal.GetUserByEmail(user.Email);

            if (existingUser != null)
                return Ok(existingUser);

            // New Google user → register
            _dal.RegisterGoogleUser(user);

            var newUser = _dal.GetUserByEmail(user.Email);
            return Ok(newUser);
        }




    }
}
