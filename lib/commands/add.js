import { PrismaClient } from "@prisma/client";
import { Message } from "discord.js";

/**
 *
 * @param {PrismaClient} prisma
 * @param {Message} message
 */
export async function add(prisma, message) {
  if (!message) {
    throw new Error("Message is not defined!");
  }
  if (message.content.split(" ").length < 3) {
    message.reply(
      "Please provide a number to add to your balance and a reason afterwards!"
    );
    return;
  }
  let points = message.content.split(" ")[1];
  let reason = message.content.slice(2);
  try {
    points = parseInt(points);
    try {
      await prisma.reward.create({
        data: {
          points,
          reason,
          User: {
            connect: {
              id: message.author.id,
            },
          },
        },
      });
      const totalPoints =
        (
          await prisma.user.findUnique({
            where: {
              id: message.author.id,
            },
            include: {
              rewards: true,
            },
          })
        ).rewards
          .map((n) => n.points)
          .reduce((a, v) => a + v, 0) || 0;
      message.reply(
        `Added ${points}$ to your balance! You now have ${totalPoints}$`
      );
    } catch (err) {
      console.error("Error updating user balance: ", err);
      message.reply("Error updating user balance, please try again.");
      return;
    }
  } catch (err) {
    console.error("Content is not a number! Received: ", points);
    message.reply("Content is not a number! Please try again.");
  }
  return;
}
