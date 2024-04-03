import express, { NextFunction } from "express";
import morgan from "morgan";
import * as dotenv from "dotenv";
import * as Sentry from "@sentry/node";
import cors from "cors";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import dbConnect from "./helpers/db_connect.ts";

dotenv.config();

const app = express();

//init Sentry.io
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({ app }),
    nodeProfilingIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// All controllers should live here
app.get("/", function rootHandler(req: express.Request, res: express.Response) {
  res.end("Goofy ahh TypeScript!");
});

// The error handler must be registered before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());
dbConnect();
// Optional fallthrough error handler
app.use(function onError(
  err: Error,
  req: express.Request,
  res: express.Response,
  next: NextFunction
) {
  res.statusCode;
  res.end("An error occurred");
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

app.get(
  "/debug-sentry",
  function mainHandler(req: express.Request, res: express.Response) {
    testSentry();
    res.end("Error sent to Sentry!");
  }
);

const testSentry = async () => {
  try {
    throw new Error("My first Sentry error!");
  } catch (error: any) {
    Sentry.captureException(error);
  }
};
