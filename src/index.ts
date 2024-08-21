import express from "express";
import connectToDB from "./config/dbConfig";
import ServerConfig from "./config/serverConfig";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import roomHandler from "./handlers/roomHandler";

const app = express();

// Middleware
app.use(cors());

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

// API route
app.get("/", (_req, res) => {
	return res.json({
		message: "WebRTC VIDEOMEET Backend server is alive!",
	});
});

// Socket.IO connection handler
io.on("connection", socket => {
	console.log("A new user connected with socketId: ", socket.id);

	roomHandler(socket); // Pass the socket connection to the room handler for room creation and joining

	socket.on("disconnect", () => {
		console.log("A user got disconnected!");
	});
});

// Function to start the server after DB connection
const startServer = async () => {
	try {
		await connectToDB(); // Connect to DB first
		console.log("DB Connected");

		server.listen(ServerConfig.PORT, () => {
			console.log(`Server is running on PORT: ${ServerConfig.PORT}`);
		});
	} catch (error) {
		console.error("Error starting the server:", error);
		process.exit(1); // Exit process with failure code
	}
};

// Start server
startServer();
