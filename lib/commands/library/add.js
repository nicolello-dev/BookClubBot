import { PrismaClient } from "@prisma/client";
import { Message } from "discord.js";

/**
 * Adds a book to the user's library
 * @param {PrismaClient} prisma
 * @param {Message} message
 */
export async function addToLibrary(prisma, message) {
  if (!message) {
    throw new Error("Message is not defined!");
  }
  if (message.content.split(" ").length < 3) {
    message.reply("Please provide a book name to add to your library!");
    return;
  }
  // The message will be like !library add <status> <book name>
  // So bookName wlil start at the 3rd word
  const status = message.content.split(" ")[2];
  if (
    status !== "reading" &&
    status !== "favorite" &&
    status !== "read" &&
    status !== "to be read"
  ) {
    message.reply(
      "Invalid status! Please use 'reading', 'read', 'favorite' or 'to be read'."
    );
    return;
  }
  const extra = {};
  if (status === "reading") {
    extra.reading = true;
  } else if (status === "favorite") {
    extra.favorite = true;
  } else if (status === "read") {
    extra.read = true;
  } else if (status === "to be read") {
    extra.wishlist = true;
  }
  const bookName = message.content.split(" ").slice(3).join(" ");
  const user = message.author.username;
  try {
    await prisma.book.create({
      data: {
        title: bookName,
        ...extra,
        User: {
          connect: {
            username: user,
          },
        },
      },
    });
  } catch (err) {
    console.error("Error adding book to library: ", err);
    message.reply(
      "Error adding book to library, you likely already have it in your library. If not, please try again."
    );
    return;
  }
  message.reply(`Added ${bookName} to your library as ${status}.`);
}
