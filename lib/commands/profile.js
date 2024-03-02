import { PrismaClient } from "@prisma/client";
import {
  Message,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";

/**
 * Replies with the user's profile
 * @param {PrismaClient} prisma
 * @param {Message} message
 * @returns
 */
export async function profile(prisma, message) {
  let username = message.author.username;
  if (message.content.split(" ").length == 2) {
    username = message.content.split(" ")[1];
  }
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    include: {
      inventory: true,
      books: true,
      rewards: true,
    },
  });
  if (!user) {
    message.reply(username, "not found in database! Please try again.");
    return;
  }
  const replyEmbed = new EmbedBuilder()
    .setAuthor({
      name: username,
      iconURL: message.author.displayAvatarURL(),
    })
    .setTitle(`${username}'s profile`)
    .setTimestamp()
    .addFields([
      {
        name: "Points",
        value:
          user.rewards
            .map((n) => n.points)
            .reduce((a, b) => a + b, 0)
            .toString() || "0",
      },
      {
        name: "Inventory",
        value: user.inventory.map((item) => item.name).join(", ") || "Empty",
      },
      {
        name: "Books reading",
        value:
          user.books
            .filter((book) => book.reading)
            .map((book) => book.title)
            .join(", ") || "Not reading any books for now",
        inline: true,
      },
      {
        name: "Books read",
        value:
          user.books
            .filter((book) => book.read)
            .map((book) => book.title)
            .join(", ") || "No books read yet",
        inline: true,
      },
      {
        name: "Favorite books",
        value:
          user.books
            .filter((book) => book.favorite)
            .map((book) => book.title)
            .join(", ") || "No books marked as favorite yet",
        inline: true,
      },
    ]);
  const showPointsLogButton = new ButtonBuilder()
    .setCustomId("showPointsLog")
    .setLabel("Show points log")
    .setStyle(ButtonStyle.Primary);
  const showReadBooksButton = new ButtonBuilder()
    .setCustomId("showReadBooksButton")
    .setLabel('Show books marked as "read"')
    .setStyle(ButtonStyle.Primary);
  const showToBeReadBooksButton = new ButtonBuilder()
    .setCustomId("showToBeReadBooksButton")
    .setLabel('Show books marked as "To Be Read"')
    .setStyle(ButtonStyle.Primary);
  const row = new ActionRowBuilder().addComponents(
    showPointsLogButton,
    showReadBooksButton,
    showToBeReadBooksButton
  );
  const reply = await message.channel.send({
    embeds: [replyEmbed],
    components: [row],
  });

  try {
    const confirmation = await reply.awaitMessageComponent();
    if (confirmation.customId == "showPointsLog") {
      const pointsLog = new EmbedBuilder()
        .setTitle(`${username}'s points log`)
        .setTimestamp()
        .addFields(
          user.rewards.length
            ? user.rewards.map((reward) => {
                return {
                  name: reward.reason,
                  value: reward.points.toString(),
                };
              })
            : {
                name: "No points log",
                value: "No points log",
              }
        );
      confirmation.reply({
        embeds: [pointsLog],
      });
    } else if (confirmation.customId == "showReadBooksButton") {
      const readBooks = new EmbedBuilder()
        .setTitle(`${username}'s read books`)
        .setTimestamp()
        .addFields(
          user.books.filter((book) => book.read).length
            ? user.books
                .filter((book) => book.read)
                .map((book) => {
                  return {
                    name: book.title,
                    value: book.author,
                  };
                })
            : {
                name: "No read books",
                value: "No read books",
              }
        );
      confirmation.reply({
        embeds: [readBooks],
      });
    } else if (confirmation.customId == "showToBeReadBooksButton") {
      const toBeReadBooks = new EmbedBuilder()
        .setTitle(`${username}'s "To Be Read" books`)
        .setTimestamp()
        .addFields(
          user.books.filter((book) => book.wishlist).length
            ? user.books
                .filter((book) => book.wishlist)
                .map((book) => {
                  return {
                    name: book.title,
                    value: book.author,
                  };
                })
            : {
                name: "No books to be read",
                value: "No books to be read",
              }
        );
      confirmation.reply({
        embeds: [toBeReadBooks],
      });
    }
  } catch (err) {
    console.error(err);
    reply.reply("You took too long to reply!");
    return;
  }
}
