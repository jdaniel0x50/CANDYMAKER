using System.Collections.Generic;
using System.Linq;
using Dapper;
using System.Data;
using Microsoft.Extensions.Options;
using MySql.Data.MySqlClient;
using <%= namespace %>.Models;

namespace <%= namespace %>.Factory
{
    public class UserFactory : IFactory<User>
    {
        // private readonly IOptions<MySqlOptions> MySqlConfig;
        private string connectionString;
        public UserFactory()
        {
            //MySqlConfig = config;
            //connectionString = MySqlConfig.Value.ConnectionString;
            connectionString = "server=localhost;userid=root;password=root;port=3306;database=netcore_users;SslMode=None";
        }
        internal IDbConnection Connection
        {
            get
            {
                return new MySqlConnection(connectionString);
            }
        }

    }
}