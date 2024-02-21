import { PrismaClient } from "@prisma/client";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Message,
} from "discord.js";

/**
 * Searches for a book using openlibrary's API
 * @param {PrismaClient} prisma
 * @param {Message} message
 */
export async function search(prisma, message) {
  const messageContent = message.content.split(" ");
  const book = messageContent.slice(1).join(" ");
  // Check that the user doesn't have the book already
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(message.author.id),
    },
    include: {
      books: true,
    },
  });
  if (user.books.find((b) => b.title == book)) {
    message.reply(`You already have "${book}" in your library!`);
    return;
  }
  console.log("Searching for book: ", book);
  const reply = await message.reply(`Searching for book: ${book}`);
  const res = await (
    await fetch(`https://www.googleapis.com/books/v1/volumes?q=${book}`)
  ).json();
  if (!res) {
    reply.edit(`Bad request made. Couldn't find "${book}"!`);
    return;
  }
  if (!res.items || res.items.length == 0) {
    reply.edit(`No books found for "${book}"!`);
    return;
  }
  const addToCurrentlyReadingButton = new ButtonBuilder()
    .setCustomId("addToCurrentlyReadingButton")
    .setLabel('Add book to the "Currently Reading" group')
    .setStyle(ButtonStyle.Primary);
  const addToFavoritesButton = new ButtonBuilder()
    .setCustomId("addToFavoritesButton")
    .setLabel('Add book to the "favorites" group')
    .setStyle(ButtonStyle.Primary);
  const addToToBeReadButton = new ButtonBuilder()
    .setCustomId("addToToBeReadButton")
    .setLabel('Add book to the "To Be Read" group')
    .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder().addComponents(
    addToCurrentlyReadingButton,
    addToFavoritesButton,
    addToToBeReadButton
  );
  const response = await reply.edit({
    content: `Found book: ${
      res.items[0].volumeInfo.title
    } by ${res.items[0].volumeInfo.authors.join(", ")}, pages: ${
      res.items[0].volumeInfo.pageCount
    }`,
    components: [row],
  });
  try {
    const confirmation = await response.awaitMessageComponent();
    // CURRENTLY READING
    if (confirmation.customId == "addToCurrentlyReadingButton") {
      try {
        await prisma.book.create({
          data: {
            title: res.items[0].volumeInfo.title,
            author: res.items[0].volumeInfo.authors.join(", "),
            pagesTotal: res.items[0].volumeInfo.pageCount,
            reading: true,
            favorite: false,
            pagesRead: 0,
            read: false,
            wishlist: false,
            User: {
              connect: {
                id: parseInt(message.author.id),
              },
            },
          },
        });
        await confirmation.reply("Book added to library!");
      } catch (err) {
        console.error(err);
        await confirmation.reply(
          "Error adding book to library! Likely you already have it."
        );
      }
      // FAVORITES
    } else if (confirmation.customId == "addToFavoritesButton") {
      try {
        await prisma.book.create({
          data: {
            title: res.items[0].volumeInfo.title,
            author: res.items[0].volumeInfo.authors.join(", "),
            pagesTotal: res.items[0].volumeInfo.pageCount,
            favorite: true,
            pagesRead: res.items[0].volumeInfo.pageCount,
            read: true,
            reading: false,
            wishlist: false,
            User: {
              connect: {
                id: parseInt(message.author.id),
              },
            },
          },
        });
        await confirmation.reply("Book added to library!");
      } catch (err) {
        console.error(err);
        await confirmation.reply(
          "Error adding book to library! Likely you already have it."
        );
      }
      // TO BE READ
    } else if (confirmation.customId == "addToFavoritesButton") {
      try {
        await prisma.book.create({
          data: {
            title: res.items[0].volumeInfo.title,
            author: res.items[0].volumeInfo.authors.join(", "),
            pagesTotal: res.items[0].volumeInfo.pageCount,
            favorite: false,
            pagesRead: res.items[0].volumeInfo.pageCount,
            read: false,
            reading: false,
            wishlist: true,
            User: {
              connect: {
                id: parseInt(message.author.id),
              },
            },
          },
        });
        await confirmation.reply("Book added to library!");
      } catch (err) {
        console.error(err);
        await confirmation.reply(
          "Error adding book to library! Likely you already have it."
        );
      }
    } else {
      await confirmation.reply("Wrong interaction! Please try again.");
    }
  } catch (err) {
    console.error(err);
    await reply.reply("You took too long to confirm the book!");
  }
}
