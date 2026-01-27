using Microsoft.Data.SqlClient;
using Online_Quiz_And_Exam_System.Models;
using Online_Quiz_And_Exam_System.Models;
using System.Collections.Generic;

namespace Online_Quiz_API.DAL
{
    public class ResultDAL
    {
        private readonly DbConnection _db;

        public ResultDAL(DbConnection db)
        {
            _db = db;
        }

        // =========================
        // SAVE RESULT
        // =========================
        public void Save(TestResult r)
        {
            using var con = _db.GetConnection();

            var cmd = new SqlCommand(@"
        INSERT INTO TestResults
        (UserId, ModuleId, Score, Attempted, Unattempted, TestType)
        VALUES
        (@uid, @mid, @score, @att, @unatt, @type)", con);

            cmd.Parameters.AddWithValue("@uid", r.UserId);
            cmd.Parameters.AddWithValue("@mid", r.ModuleId);
            cmd.Parameters.AddWithValue("@score", r.Score);
            cmd.Parameters.AddWithValue("@att", r.Attempted);
            cmd.Parameters.AddWithValue("@unatt", r.Unattempted);
            cmd.Parameters.AddWithValue("@type", r.TestType); // ✅ THIS LINE WAS MISSING

            con.Open();
            cmd.ExecuteNonQuery();
        }


        // =========================
        // GET USER RESULTS (DASHBOARD)
        // =========================
        public List<TestResult> GetResultsByUser(int userId)
        {
            List<TestResult> list = new();

            using SqlConnection con = _db.GetConnection();
            SqlCommand cmd = new SqlCommand(
                "SELECT * FROM TestResults WHERE UserId=@u", con);

            cmd.Parameters.AddWithValue("@u", userId);

            con.Open();
            SqlDataReader dr = cmd.ExecuteReader();

            while (dr.Read())
            {
                list.Add(new TestResult
                {
                    ResultId = (int)dr["ResultId"],
                    UserId = (int)dr["UserId"],
                    ModuleId = (int)dr["ModuleId"],
                    Score = (int)dr["Score"],
                    TestDate = (DateTime)dr["TestDate"]
                });
            }
            return list;
        }






        public List<object> GetAttemptSummary(int userId)
        {
            List<object> list = new();

            using SqlConnection con = _db.GetConnection();
            SqlCommand cmd = new SqlCommand(@"
        SELECT m.ModuleName, COUNT(*) AS Attempts
        FROM TestResults t
        JOIN Modules m ON t.ModuleId = m.ModuleId
        WHERE t.UserId = @uid
        GROUP BY m.ModuleName", con);

            cmd.Parameters.AddWithValue("@uid", userId);
            con.Open();

            SqlDataReader dr = cmd.ExecuteReader();
            while (dr.Read())
            {
                list.Add(new
                {
                    moduleName = dr["ModuleName"].ToString(),
                    attempts = (int)dr["Attempts"]
                });
            }
            return list;
        }







        public object GetLatestStats(int userId)
        {
            using var con = _db.GetConnection();

            var cmd = new SqlCommand(@"
        SELECT TOP 1 
            m.ModuleName,
            r.Score,
            r.Attempted,
            r.Unattempted,

            (SELECT COUNT(*) 
             FROM TestResults 
             WHERE UserId = @uid) AS TotalTests,

            (SELECT COUNT(*) 
             FROM TestResults 
             WHERE UserId = @uid AND TestType = 'Practice') AS PracticeTests,

            (SELECT COUNT(*) 
             FROM TestResults 
             WHERE UserId = @uid AND TestType = 'Mock') AS MockTests,

            (SELECT MAX(Score) 
             FROM TestResults 
             WHERE UserId = @uid) AS BestScore,

            (SELECT AVG(CAST(Score AS FLOAT)) 
             FROM TestResults 
             WHERE UserId = @uid) AS AverageScore

        FROM TestResults r
        JOIN Modules m ON r.ModuleId = m.ModuleId
        WHERE r.UserId = @uid
        ORDER BY r.ResultId DESC
    ", con);

            cmd.Parameters.AddWithValue("@uid", userId);

            con.Open();
            using var dr = cmd.ExecuteReader();

            if (!dr.Read())
                return null;

            return new
            {
                moduleName = dr["ModuleName"],
                score = dr["Score"],
                attempted = dr["Attempted"],
                unattempted = dr["Unattempted"],
                totalTests = dr["TotalTests"],
                practiceTests = dr["PracticeTests"],
                mockTests = dr["MockTests"],
                bestScore = dr["BestScore"],
                averageScore = dr["AverageScore"]
            };
        }








    }
}
