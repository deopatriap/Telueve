console.log("Test: Starting...");

async function run() {
  try {
    console.log("Test: Importing Express...");
    await import("express");
    console.log("SUCCESS: Express");

    console.log("Test: Importing CORS...");
    await import("cors");
    console.log("SUCCESS: CORS");

    console.log("Test: Importing Socket.IO...");
    await import("socket.io");
    console.log("SUCCESS: Socket.IO");

    console.log("Test: Importing gRPC...");
    await import("@grpc/grpc-js");
    console.log("SUCCESS: gRPC");

    console.log("Test: Importing Proto Loader...");
    await import("@grpc/proto-loader");
    console.log("SUCCESS: Proto Loader");

    console.log("Test: Importing Auth Routes...");
    await import("./src/routes/authRoutes.js");
    console.log("SUCCESS: Auth Routes");

    console.log("Test: Importing Event Routes...");
    await import("./src/routes/eventRoutes.js");
    console.log("SUCCESS: Event Routes");

    console.log("Test: Importing Admin Routes...");
    await import("./src/routes/adminRoutes.js");
    console.log("SUCCESS: Admin Routes");

    console.log("Test: Importing Registration Routes...");
    await import("./src/routes/registrationRoutes.js");
    console.log("SUCCESS: Registration Routes");

    console.log("Test: Importing User Routes...");
    await import("./src/routes/userRoutes.js");
    console.log("SUCCESS: User Routes");

    console.log("Test: Importing Announcements Model...");
    await import("./src/models/announcementModel.js");
    console.log("SUCCESS: Announcements Model");

    console.log("Test: Importing Settings Model...");
    await import("./src/models/settingsModel.js");
    console.log("SUCCESS: Settings Model");

  } catch (err) {
    console.error("FAIL:", err);
  }
}

run();
