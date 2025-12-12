import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllEvents, searchEvent } from '../models/eventModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// proto file is stored under src/grpc/proto/event.proto
const PROTO_PATH = path.join(__dirname, 'proto/event.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const eventProto = grpc.loadPackageDefinition(packageDefinition).event;

const server = new grpc.Server();

server.addService(eventProto.EventService.service, {
  GetAllEvents: async (_, callback) => {
    try {
      const events = await getAllEvents();
      callback(null, { events });
    } catch (err) {
      callback(err, null);
    }
  },
  SearchEvents: async (call, callback) => {
    try {
      const keyword = call.request.query;
      const events = await searchEvent(keyword);
      callback(null, { events });
    } catch (err) {
      callback(err, null);
    }
  },
});

const PORT = '0.0.0.0:50051';
server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`✅ gRPC server running at ${PORT}`);
  server.start();
});
