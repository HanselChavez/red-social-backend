import dotenv from 'dotenv';
import "reflect-metadata";
import app from './app';
dotenv.config();
import { AppDataSource } from './config/data-source';


const PORT = process.env.PORT || 3000;
process.on("SIGINT", async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    console.log("🔌 Conexión cerrada");
  }
  process.exit(0);
});
if (!AppDataSource.isInitialized) {
  AppDataSource.initialize()
    .then(() => {
      console.log("📦 Base de datos conectada");

      app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      });
    })
    .catch((error) => console.log("❌ Error DB:", error));
}