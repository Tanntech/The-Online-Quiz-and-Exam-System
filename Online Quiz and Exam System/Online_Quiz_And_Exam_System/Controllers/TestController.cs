//using Microsoft.AspNetCore.Mvc;
//using Online_Quiz_API.DAL;

//namespace Online_Quiz_And_Exam_System.Controllers
//{
//    [ApiController]
//    [Route("api/test")]
//    public class TestController : ControllerBase
//    {
//        private readonly DbConnection _dbConnection;

//        public TestController(DbConnection dbConnection)
//        {
//            _dbConnection = dbConnection;
//        }

//        [HttpGet("db-test")]
//        public IActionResult DbTest()
//        {
//            using var con = _dbConnection.GetConnection();
//            con.Open();
//            return Ok("Azure SQL Connected Successfully");
//        }
//    }
//}
