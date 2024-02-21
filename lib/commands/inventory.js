import { PrismaClient } from "@prisma/client";
import { Message } from "discord.js";

/**
 * Replies with a list of the user's inventory
 * @param {PrismaClient} prisma
 * @param {Message} message
 */
export async function inventory(prisma, message) {
  const user = await prisma.user.findUnique({
    where: {
      id: message.author.id,
    },
    include: {
      inventory: true,
    },
  });
  if (!user) {
    message.reply("User not found in database! Please try again.");
    return;
  }
  if (user.inventory.length === 0) {
    message.reply(
      "Your inventory is empty! You can buy items with !buy <item>. (150 points)"
    );
    return;
  }
  const items = user.inventory.map((item) => item.name).join(", ");
  message.reply(`Here's your inventory: ${items}`);
}
