import { PrismaClient } from "@prisma/client";
import { Message } from "discord.js";

/**
 * Buys item from the store to the user.
 * @param {PrismaClient} prisma
 * @param {Message} message
 */
export async function buy(prisma, message) {
  const messageContent = message.content.split(" ");
  const item = messageContent[1];
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(message.author.id),
    },
  });
  if (!user) {
    message.reply("User not found in database! Please try again.");
    return;
  }
  if (user.points < 150) {
    message.reply("You don't have enough points to buy this item!");
    return;
  }
  // Create the item
  try {
    await prisma.item.create({
      data: {
        name: item,
        User: {
          connect: {
            id: parseInt(message.author.id),
          },
        },
      },
    });
  } catch (err) {
    console.error("Error creating item: ", err);
    message.reply("Error creating item, please try again.");
    return;
  }
  // Remove points from the user
  try {
    await prisma.reward.create({
      data: {
        points: -150,
        reason: `Bought ${item}`,
        User: {
          connect: {
            id: parseInt(message.author.id),
          },
        },
      },
    });
  } catch (err) {
    console.error("Error updating user points: ", err);
    message.reply("Error updating user points, please try again.");
    return;
  }
  message.reply(`You bought "${item}"!`);
}
