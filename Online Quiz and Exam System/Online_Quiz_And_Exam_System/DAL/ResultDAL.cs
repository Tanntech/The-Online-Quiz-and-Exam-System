using Microsoft.Data.SqlClient;
using Online_Quiz_And_Exam_System.Models;
using System.Collections.Generic;
using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;


namespace Online_Quiz_API.DAL
{
    public class ResultDAL
    {
        private readonly DbConnection _db;

        public ResultDAL(DbConnection db)
        {
            _db = db;
        }

        // ================= SAVE RESULT =================
        public void Save(TestResult r)
        {
            using var conn = _db.GetConnection();

            var cmd = new SqlCommand(@"
                INSERT INTO TestResults
                (UserId, ModuleId, Score, Attempted, Unattempted, TestType)
                VALUES
                (@uid, @mid, @score, @att, @unatt, @type)", conn);

            cmd.Parameters.AddWithValue("@uid", r.UserId);
            cmd.Parameters.AddWithValue("@mid", r.ModuleId);
            cmd.Parameters.AddWithValue("@score", r.Score);
            cmd.Parameters.AddWithValue("@att", r.Attempted);
            cmd.Parameters.AddWithValue("@unatt", r.Unattempted);
            cmd.Parameters.AddWithValue("@type", r.TestType);

            conn.Open();
            cmd.ExecuteNonQuery();
        }

        // ================= ATTEMPT SUMMARY =================
        public List<object> GetAttemptSummary(int userId)
        {
            List<object> list = new();

            using var conn = _db.GetConnection();
            var cmd = new SqlCommand(@"
                SELECT m.ModuleName, COUNT(*) AS Attempts
                FROM TestResults t
                JOIN Modules m ON t.ModuleId = m.ModuleId
                WHERE t.UserId = @uid
                GROUP BY m.ModuleName", conn);

            cmd.Parameters.AddWithValue("@uid", userId);
            conn.Open();

            using var dr = cmd.ExecuteReader();
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

        // ================= LATEST RESULT (FIXED & SAFE) =================
        public object GetLatestResult(int userId)
        {
            using var conn = _db.GetConnection();

            var cmd = new SqlCommand(@"
                SELECT TOP 1
                    m.ModuleName,
                    r.Score,
                    r.Attempted,
                    r.Unattempted,

                    (SELECT COUNT(*) FROM TestResults WHERE UserId = @uid) AS TotalTests,
                    (SELECT COUNT(*) FROM TestResults WHERE UserId = @uid AND TestType = 'Practice') AS PracticeTests,
                    (SELECT COUNT(*) FROM TestResults WHERE UserId = @uid AND TestType = 'Mock') AS MockTests,
                    (SELECT ISNULL(MAX(Score), 0) FROM TestResults WHERE UserId = @uid) AS BestScore

                FROM TestResults r
                JOIN Modules m ON r.ModuleId = m.ModuleId
                WHERE r.UserId = @uid
                ORDER BY r.ResultId DESC
            ", conn);

            cmd.Parameters.AddWithValue("@uid", userId);

            conn.Open();
            using var dr = cmd.ExecuteReader();

            if (!dr.Read())
                return null;   // 🔑 new user case

            return new
            {
                moduleName = dr["ModuleName"],
                score = dr["Score"],
                attempted = dr["Attempted"],
                unattempted = dr["Unattempted"],
                totalTests = dr["TotalTests"],
                practiceTests = dr["PracticeTests"],
                mockTests = dr["MockTests"],
                bestScore = dr["BestScore"]
            };
        }
    }
}
