import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import registrationRoutes from './routes/registrationRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Socket.io & gRPC Imports
import { createServer } from "http";
import { Server } from "socket.io";
// gRPC Client Imports
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';
import { fileURLToPath } from 'url';
import { startGrpcServer } from './grpc/grpcServer.js';

dotenv.config();
const app = express();
const httpServer = createServer(app);
import compression from 'compression';
app.use(compression());


// Allowed origins
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3002', 'http://127.0.0.1:3000', 'http://127.0.0.1:3002'];

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// gRPC Client Setup
// ==========================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CHAT_PROTO_PATH = path.join(__dirname, 'grpc', 'proto', 'chat.proto');

let chatClient = null;

try {
  const packageDef = protoLoader.loadSync(CHAT_PROTO_PATH);
  const grpcObj = grpc.loadPackageDefinition(packageDef);
  const chatPackage = grpcObj.chat;

  chatClient = new chatPackage.ChatService(
    `0.0.0.0:${process.env.GRPC_PORT || 50051}`,
    grpc.credentials.createInsecure()
  );
  console.log("✅ gRPC Chat Client initialized");
} catch (error) {
  console.error("❌ Failed to init gRPC client:", error);
}

// ==========================================
// Socket.IO Logic
// ==========================================
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  let stream = null;

  if (chatClient) {
    stream = chatClient.StreamMessages({});

    stream.on('data', (data) => {
      socket.emit('message', data);
    });

    stream.on('error', (err) => {
      console.error('gRPC Stream Error:', err);
    });

    stream.on('end', () => {
      console.log('gRPC Stream ended');
    });
  }

  socket.on('sendMessage', (data) => {
    if (chatClient) {
      chatClient.SendMessage(data, (err, response) => {
        if (err) console.error("gRPC Send Error:", err);
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    if (stream) stream.cancel();
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/users", userRoutes);

// Root
app.get("/", (req, res) => {
  res.json({ message: "🎉 Event Campus API Running!" });
});

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route tidak ditemukan', path: req.originalUrl });
});

// Global Error
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Terjadi kesalahan pada server!',
    error: process.env.NODE_ENV === 'development' ? { message: err.message, stack: err.stack } : {}
  });
});

// Start server
const PORT = process.env.PORT || 5001;

// ==========================================
// Auto-start gRPC Server (Inline)
// ==========================================
// ==========================================
// ==========================================

httpServer.listen(PORT, '0.0.0.0', async () => {
  try {
    console.log(`✅ Server (HTTP + Socket.io) running on port ${PORT}`);
    console.log(`🌐 Base URL: http://localhost:${PORT}`);

    // Start gRPC server inline
    startGrpcServer();
  } catch (err) {
    console.error("❌ DB Init Failed:", err);
  }
});

