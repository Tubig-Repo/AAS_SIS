const mysql2 = require("mysql2");

const connection = mysql2.createConnection({
  host: "localhost",
  user: "root",
  password: "", // XAMPP default: no password
  database: "users",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  port: 3306,
});

module.exports = connection.promise();
// Test case if the connection is succesful
// connection.connect((err) => {
//   if (err) throw err;
//   console.log("Connected to MySQL!");
// });
