import { Message } from "discord.js";
import { PrismaClient } from "@prisma/client";
import { addToLibrary } from "./add.js";
import { removeFromLibrary } from "./remove.js";
import { editBook } from "./edit.js";

/**
 * Handles the !library commands
 * @param {PrismaClient} prisma
 * @param {Message} message
 */
export async function libraryHandler(prisma, message) {
  if (message.content.startsWith("!library add")) {
    await addToLibrary(prisma, message);
  } else if (message.content.startsWith("!library remove")) {
    await removeFromLibrary(prisma, message);
  } else if (message.content.startsWith("!library edit")) {
    await editBook(prisma, message);
  } else {
    await message.reply(
      "Invalid command! Please use !library add <status> <book>, !library remove <book> or !library edit <status> <book>."
    );
  }
}
