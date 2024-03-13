// Import commands from local files
import { add } from "./commands/add.js";
import { remove } from "./commands/remove.js";
import { buy } from "./commands/buy.js";
import { inventory } from "./commands/inventory.js";
import { profile } from "./commands/profile.js";
import { book } from "./commands/book.js";
import { rate } from "./commands/rate.js";
import { prog } from "./commands/prog.js";
import { libraryHandler } from "./commands/library/handler.js"; // handles !library commands
import { sprintHandler } from "./commands/sprint/handler.js"; // handles !sprint commands
import { sprintStats } from "./commands/sprintStats.js";

// Util functions
import { checkUserExistsInDB } from "./checkUserExistsInDB.js";

// Classes for typing
import { PrismaClient } from "@prisma/client";
import { Message } from "discord.js";

/**
 *
 * @param {PrismaClient} prisma
 * @param {Message} message
 */
export async function handleNewMessage(prisma, message) {
  if (message.author.bot || !message.content.startsWith("!")) return; // Ignore bots' messages and non-commands
  await checkUserExistsInDB(prisma, message.author); // Create user if not exists
  const messageContent = message.content.split(" ");
  const command = messageContent[0];
  switch (command) {
    case "!add":
      await add(prisma, message);
      break;
    case "!remove":
      await remove(prisma, message);
      break;
    case "!buy":
      await buy(prisma, message);
      break;
    case "!inventory":
      await inventory(prisma, message);
      break;
    case "!profile":
      await profile(prisma, message);
      break;
    case "!book":
      await book(prisma, message);
      break;
    case "!rate":
      await rate(prisma, message);
      break;
    case "!prog":
      await prog(prisma, message);
      break;
    case "!library":
      await libraryHandler(prisma, message);
      break;
    case "!sprint":
      await sprintHandler(prisma, message);
      break;
    case "!sprintStats":
      await sprintStats(prisma, message);
      break;
    default:
      break;
  }
}
