import * as AWS from 'aws-sdk';
import { Container } from 'noicejs';
import { Bot, BotModule } from 'src/Bot';
import { loadConfig } from 'src/Config';
import { Event } from 'vendor/so-client/src/events';

const STATUS_SUCCESS = 0;
const STATUS_ERROR = 1;

function signal(): Promise<void> {
  return new Promise((res, rej) => {
    process.on('SIGINT', () => res());
  });
}

async function main(): Promise<number> {
  console.info('hello bot');

  const ctr = Container.from(new BotModule());
  await ctr.configure();

  const config = await loadConfig();
  const bot = await ctr.create<Bot, any>(Bot, {config});

  await bot.start();
  await signal();
  await bot.stop();

  return STATUS_SUCCESS;
}

main().then((status) => process.exit(status)).catch((err) => {
  console.error('uncaught error:', err);
  process.exit(1);
});
