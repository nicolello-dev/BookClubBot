import { PrismaClient } from "@prisma/client";
import { Message } from "discord.js";

/**
 * Rates the book if the user has read it
 * @param {PrismaClient} prisma
 * @param {Message} message
 */
export async function rate(prisma, message) {
  const messageContent = message.content.split(" ");
  const rating = messageContent[messageContent.length - 1]; // The last one is the rating
  const book = messageContent.slice(1, messageContent.length - 1).join(" "); // The rest is the book
  console.log("Rating book: ", book, " with rating: ", rating);
  // Check if the user has the book in their inventory
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(message.author.id),
    },
    include: {
      books: true,
    },
  });
  if (!user) {
    message.reply("User not found in database! Please try again.");
    return;
  }
  const userBook = user.books.find((b) => b.title === book);
  if (!userBook) {
    message.reply("You don't have this book in your inventory!");
    return;
  }
  if (!userBook.read) {
    message.reply("You haven't read this book yet!");
    return;
  }
  // Update the book with the rating
  try {
    await prisma.book.update({
      where: {
        id: userBook.id,
      },
      data: {
        rating: parseInt(rating),
      },
    });
    message.reply(`Succesfully rated "${book}" with a ${rating}!`);
  } catch (err) {
    console.error("Error updating book rating: ", err);
    message.reply("Error updating book rating, please try again.");
    return;
  }
}
