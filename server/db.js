const mysql2 = require("mysql2");

const connection = mysql2.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "student_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  port: 8889,
}); 

module.exports = connection.promise();
