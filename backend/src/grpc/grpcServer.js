import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createUser, findUserByEmail } from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getAllEvents, searchEvent, getEventsPaginated } from '../models/eventModel.js';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, 'proto', 'event_service.proto');

const packageDef = protoLoader.loadSync(PROTO_PATH);
const grpcObj = grpc.loadPackageDefinition(packageDef);
const eventcampus = grpcObj.eventcampus;

const authService = {
  Register: async (call, callback) => {
    const { nama, email, password } = call.request;
    try {
      const existing = await findUserByEmail(email);
      if (existing) return callback(null, { success: false, message: "Email sudah terdaftar" });
      const user = await createUser(nama, email, password);
      return callback(null, { success: true, message: "Registrasi berhasil", user_id: user.id });
    } catch (err) {
      return callback(null, { success: false, message: err.message });
    }
  },

  Login: async (call, callback) => {
    const { email, password } = call.request;
    try {
      const user = await findUserByEmail(email);
      if (!user) return callback(null, { success: false, message: "User tidak ditemukan" });
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return callback(null, { success: false, message: "Password salah" });
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return callback(null, { success: true, message: "Login berhasil", token });
    } catch (err) {
      return callback(null, { success: false, message: err.message });
    }
  }
};

const eventService = {
  ListEvents: async (call, callback) => {
    try {
      const page = call.request.page || 1;
      const limit = call.request.limit || 10;
      const { rows, total } = await getEventsPaginated(page, limit);
      const events = rows.map(r => ({ id: r.id, nama_event: r.nama_event, deskripsi: r.deskripsi, waktu_event: r.waktu_event.toISOString() }));
      callback(null, { events, total, page, limit });
    } catch (err) {
      callback(err);
    }
  },

  SearchEvents: async (call, callback) => {
    try {
      const q = call.request.query || '';
      const results = await searchEvent(q);
      const events = results.map(r => ({ id: r.id, nama_event: r.nama_event, deskripsi: r.deskripsi, waktu_event: r.waktu_event.toISOString() }));
      callback(null, { events, total: events.length, page: 1, limit: events.length });
    } catch (err) {
      callback(err);
    }
  }
};

function main() {
  const server = new grpc.Server();
  server.addService(eventcampus.AuthService.service, authService);
  server.addService(eventcampus.EventService.service, eventService);
  const addr = `0.0.0.0:${process.env.GRPC_PORT || 50051}`;
  server.bindAsync(addr, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) return console.error('gRPC bind error:', err);
    server.start();
    console.log('✅ gRPC server running at', addr);
  });
}

main();
