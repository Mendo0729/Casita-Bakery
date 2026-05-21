const app = require("./src/app");
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Casita Bakery Web running at http://localhost:${PORT}`);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use.`);
    console.error("Close the process using that port or start the app with another PORT value.");
    process.exit(1);
  }

  console.error("Failed to start Casita Bakery Web.");
  console.error(error);
  process.exit(1);
});
