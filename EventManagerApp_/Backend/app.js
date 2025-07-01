import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js"; // Assurez-vous que le chemin est correct
import authRoutes from "./routes/authRoutes.js"
import eventRoutes from "./routes/eventRoutes.js"
import notificationRoutes from "./routes/notificationRoutes.js"
import registrationRoutes from "./routes/registrationRoutes.js"
import rateLimiter from "./middlewares/rate-limiter.js"
import favoriteRoutes from "./routes/favoriteRoutes.js";
// import paymentRoutes from './routes/paymentRoutes.js';
const app = express();
app.use(express.json()); // Middleware pour parser le JSON dans les requêtes

app.use(cors({ origin: true, credentials: true })); // Middleware pour activer CORS
app.use(rateLimiter);

app.get("/", (req, res) => {
    res.send("API OK ✅");
});
// app.use("/api/payment", paymentRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/user", userRoutes); // Assurez-vous que le chemin est correct
app.use("/api/auth", authRoutes); // Assurez-vous que le chemin est correct
app.use("/api/event", eventRoutes); // Assurez-vous que le chemin est correct
app.use("/api/registration", registrationRoutes); // Assurez-vous que le chemin est correct
app.use("/api/notification", notificationRoutes); // Assurez-vous que le chemin est correct

export default app; // Exporter l'application Express pour l'utiliser dans d'autres fichiers