import { PrismaClient } from "@prisma/client";
import { Message } from "discord.js";

/**
 * Edits a book's progress
 * @param {PrismaClient} prisma
 * @param {Message} message
 * @returns
 */
export async function prog(prisma, message) {
  if (!message) {
    throw new Error("Message is not defined!");
  }
  if (message.content.split(" ").length < 3) {
    message.reply(
      "Some arguments are missing! Please use as !prog <book name> <progress> [/ <total pages>]"
    );
    return;
  }
  // The message will be like !prog <book name> <progress> [/ <tot>]
  // So bookName will start at the 2nd word
  let bookName;
  let progress;
  let totalPages;
  if (message.content.split(" ").at(-2) == "/") {
    bookName = message.content.split(" ").slice(1, -3).join(" ");
    progress = message.content.split(" ").at(-3);
    totalPages = message.content.split(" ").at(-1);
  } else {
    bookName = message.content.split(" ").slice(1, -1).join(" ");
    progress = message.content.split(" ").slice(-1).join(" ");
  }
  try {
    progress = parseInt(progress);
    totalPages = parseInt(totalPages);
  } catch (err) {
    message.reply("Progress and total pages must be numbers!");
    return;
  }
  try {
    if (totalPages) {
      await prisma.book.update({
        where: {
          title_userId: {
            title: bookName,
            userId: message.author.id,
          },
        },
        data: {
          pagesRead: progress,
          pagesTotal: totalPages,
        },
      });
      await message.reply(
        `Updated progress for ${bookName} to ${progress}/${totalPages}.`
      );
      return;
    } else {
      await prisma.book.update({
        where: {
          title_userId: {
            title: bookName,
            userId: message.author.id,
          },
        },
        data: {
          pagesRead: progress,
        },
      });
      await message.reply(
        `Updated progress for ${bookName} to ${progress} pages.`
      );
    }
  } catch (err) {
    console.error("Error updating progress: ", err);
    await message.reply("Error updating progress, please try again.");
    return;
  }
}
