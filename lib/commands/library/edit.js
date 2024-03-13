import { PrismaClient } from "@prisma/client";
import { Message } from "discord.js";

/**
 * Edits a book's details in the user's library
 * @param {PrismaClient} prisma
 * @param {Message} message
 */
export async function editBook(prisma, message) {
  if (!message) {
    throw new Error("Message is not defined!");
  }
  if (message.content.split(" ").length < 3) {
    message.reply("Please provide a book name to edit from your library!");
    return;
  }
  // The message will be like !library edit <status> <book name>
  // So bookName wlil start at the 3rd word
  const status = message.content.split(" ")[2];
  if (
    status !== "reading" &&
    status !== "favorite" &&
    status !== "read" &&
    status !== "tbr" &&
    status !== "remove"
  ) {
    message.reply(
      "Invalid status! Please use 'reading', 'read', 'favorite', 'tbr' or 'remove'."
    );
    return;
  }

  if (status == "remove") {
    const bookName = message.content.split(" ").slice(3).join(" ");
    console.log("Removing book", bookName);
    try {
      await prisma.book.delete({
        where: {
          title_userId: {
            title: bookName,
            userId: parseInt(message.author.id),
          },
        },
      });
    } catch (err) {
      console.error("Error removing book from library: ", err);
      message.reply(
        "Error removing book from library, it likely isn't a part of it. If so, type !library add <name>. If not, please try again."
      );
      return;
    }
    message.reply(`Removed ${bookName} from your library.`);
    return;
  }
  const extra = {
    reading: false,
    favorite: false,
    read: false,
    wishlist: false,
  };
  if (status === "reading") {
    extra.reading = true;
  } else if (status === "favorite") {
    extra.favorite = true;
  } else if (status === "read") {
    extra.read = true;
  } else if (status === "tbr") {
    extra.wishlist = true;
  }
  console.log(extra);
  const bookName = message.content.split(" ").slice(3).join(" ");
  const user = message.author.username;
  const userId = await prisma.user.findUnique({
    where: {
      username: user,
    },
  });
  try {
    await prisma.book.update({
      where: {
        title_userId: {
          title: bookName,
          userId: userId.id,
        },
      },
      data: {
        ...extra,
      },
    });
  } catch (err) {
    console.error("Error editing book from library: ", err);
    message.reply(
      "Error editing book from library, you likely don't have it there yet. If so, type !library add <name>. If not, please try again."
    );
    return;
  }
  message.reply(`Added ${bookName} to your library as ${status}.`);
}
