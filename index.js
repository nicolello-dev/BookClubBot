// Require the necessary discord.js classes
import { Client, Events, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";

import { handleNewMessage } from "./lib/handleNewMessage.js";

config();

const { TOKEN } = process.env;
const token = TOKEN;

const prisma = new PrismaClient();

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
  try {
    return await handleNewMessage(prisma, message);
  } catch (err) {
    console.error(err);
    message.reply("Error handling message, please try again.");
    return;
  }
});

// Log in to Discord with your client's token
client.login(token);
