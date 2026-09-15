import { app } from "./app";
import { connectDatabase, disconnectDatabase } from "./config/database";

const port = Number(process.env.PORT ?? 3000);

const startServer = async (): Promise<void> => {
  await connectDatabase();

  const server = app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });

  const shutdown = async (): Promise<void> => {
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

startServer().catch(async (error) => {
  console.error("Failed to start server", error);
  await disconnectDatabase();
  process.exit(1);
});
