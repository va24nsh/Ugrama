import { httpServer } from "./app";
import { initializeDatabases } from "./config/databases";

const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
  try {
    await initializeDatabases();
    console.log("Databases initialized successfully");

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Socket.IO server is ready for video chat connections`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
