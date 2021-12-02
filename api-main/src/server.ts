import express, {Request, Response, NextFunction} from 'express';
import cors from 'cors';
import routes from './routes';
import { Kafka } from 'kafkajs';

const app = express();

const kafka = new Kafka({
  clientId: 'api-example-certification',
  brokers: ['localhost:9092'],
  retry: {
    initialRetryTime: 300, //Retentativa em tempo exponencial
    retries: 10
  },
});

const producer = kafka.producer();
const consumer = kafka.consumer({groupId: 'certificate-group'});

app.use((request: Request, response: Response, next: NextFunction) => {
  request.producer = producer; //Remover middleware daqui.
  return next();
});

app.use(cors());
app.use(routes);

async function run() {
  await producer.connect();
  await consumer.connect();

  await consumer.subscribe({ topic: 'certification-response' });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Resposta: ${String(message.value)}`);
    }
  });

  app.listen(3000);
}

run().catch(console.error);

