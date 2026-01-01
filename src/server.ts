import app from "./app";
import { initializePool } from "./database";

const PORT = process.env.PORT || 3000;

// Initialize DB connection pool
initializePool();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: development`);
});
