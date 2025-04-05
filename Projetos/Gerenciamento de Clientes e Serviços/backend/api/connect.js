import mysql from "mysql2";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Cabo090705.",
  database: "BEM_ESTAR",
});

connection.connect((err) => {
  if (err) {
    console.error("Erro de conexão: " + err.stack);
    return;
  }
});

export default connection;
