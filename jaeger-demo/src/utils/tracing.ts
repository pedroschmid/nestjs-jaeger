import * as process from 'process';
import * as opentelemetry from '@opentelemetry/sdk-node';

import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';

export const initTracing = async (): Promise<void> => {
  const jaegerExporter = new JaegerExporter({
    endpoint: 'http://jaeger:14268/api/traces',
    maxPacketSize: 65000,
  });

  const openTelemetrySDK = new opentelemetry.NodeSDK({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: 'nestjs-jaeger-example',
    }),
    instrumentations: [
      getNodeAutoInstrumentations({
        '@opentelemetry/instrumentation-fs': { enabled: false },
      }),
    ],
    spanProcessor: new SimpleSpanProcessor(jaegerExporter),
    autoDetectResources: true,
  });

  try {
    await openTelemetrySDK.start();
    console.log('Tracing initialized');
  } catch (error) {
    console.log('Error initializing tracing', error);
  }

  process.on('SIGTERM', () => {
    openTelemetrySDK
      .shutdown()
      .then(() => console.log('Tracing terminated'))
      .catch((error) => console.log('Error terminating tracing', error))
      .finally(() => process.exit(0));
  });
};
