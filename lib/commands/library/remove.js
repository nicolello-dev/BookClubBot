import { PrismaClient } from "@prisma/client";
import { Message } from "discord.js";

/**
 * Removes a book from the user's library
 * @param {PrismaClient} prisma
 * @param {Message} message
 */
export async function removeFromLibrary(prisma, message) {
  if (!message) {
    throw new Error("Message is not defined!");
  }
  if (message.content.split(" ").length < 3) {
    message.reply("Please provide a book name to add to your library!");
    return;
  }
  // The message will be like !library remove <book name>
  // So bookName wlil start at the 3rd word
  const bookName = message.content.split(" ").slice(2).join(" ");
  try {
    await prisma.book.delete({
      where: {
        title_userId: {
          title: bookName,
          userId: message.author.id,
        },
      },
    });
    message.reply(`Removed ${bookName} from your library.`);
  } catch (err) {
    console.error("Error removing book from library: ", err);
    message.reply("Error removing book from library, please try again.");
    return;
  }
}
