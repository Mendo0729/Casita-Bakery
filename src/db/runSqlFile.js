require("dotenv").config();

const fs = require("fs/promises");
const path = require("path");
const pool = require("../config/databaseClient");

const allowedFiles = {
  schema: "schema.sql",
  seed: "seed.sql"
};

async function runSqlFile() {
  const target = process.argv[2];
  const fileName = allowedFiles[target];

  if (!fileName) {
    throw new Error("Use: node src/db/runSqlFile.js schema|seed");
  }

  const filePath = path.join(__dirname, fileName);
  const sql = await fs.readFile(filePath, "utf8");

  await pool.query(sql);
  console.log(`${fileName} executed successfully.`);
}

runSqlFile()
  .catch((error) => {
    console.error("Failed to execute SQL file.");
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
