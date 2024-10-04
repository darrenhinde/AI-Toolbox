import { streamObject , generateObject} from 'ai';
import { LangfuseExporter } from 'langfuse-vercel';
import { registerOTel } from '@vercel/otel';

// Ensure that OpenTelemetry is registered with the Langfuse exporter
registerOTel({
  serviceName: 'your-service-name', // Replace with your service name
  traceExporter: new LangfuseExporter(),
});

// Function that logs before and after calling streamObject
export async function streamObjectWithLogging<T>({
  model,
  schema,
  mode,
  system,
  prompt,
  messages,
  maxRetries,
  abortSignal,
  headers,
  onFinish,
  ...settings
}: Parameters<typeof streamObject<T>>[0]): Promise<
  ReturnType<typeof streamObject<T>>
> {
  // Enable telemetry for tracing
  const telemetry = {
    isEnabled: true,
    functionId: "streamObjectWithLogging", // Trace name
    metadata: {
      userId: "user-123", // Example user ID
      sessionId: "session-456", // Example session ID
      tags: ["stream", "object"], // Custom tags
      // Add any other custom attributes here
    },
  };

  console.log("streamObject called with params:", {
    model,
    schema,
    mode,
    system,
    prompt,
    messages,
    maxRetries,
    abortSignal,
    headers,
    onFinish,
    ...settings,
  });

  const result = await streamObject<T>({
    model,
    schema,
    mode,
    system,
    prompt,
    messages,
    maxRetries,
    abortSignal,
    headers,
    onFinish,
    experimental_telemetry: telemetry, // Pass telemetry settings
    ...settings,
  });

  console.log("streamObject result:", result);

  // Access the partialObjectStream property after awaiting the result
  // Do not console.log as if other function uses this then will break
  // console.log("partialObjectStream:", result.partialObjectStream);

  return result;
}
