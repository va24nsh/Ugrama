import { app } from "./app";
import { initializeDatabases } from "./config/databases";

const PORT = Number(process.env.PORT) || 5000;

initializeDatabases()

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
