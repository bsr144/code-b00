require("dotenv").config();

const app = require("./src/express");
const port = process.env.APP_PORT || 3000;

(async () => {
  try {
    await app.connectDatabase();

    const server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    process.on("SIGINT", async () => {
      console.log(
        "Received SIGINT. Closing server and disconnecting from database..."
      );
      server.close(async () => {
        console.log("Express server closed.");
        await app.closeDatabase();
        console.log("Disconnected from database.");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
})();
