import { PrismaClient } from "@prisma/client";
import { Message } from "discord.js";

/**
 * Leaves a sprint
 * @param {PrismaClient} prisma
 * @param {Message} message
 * @returns
 */
export async function leaveSprint(prisma, message) {
  if (message.content.split(" ").length != 3) {
    message.reply(
      "Some arguments are missing! Please use as !sprint leave <id>"
    );
    return;
  }
  let id = message.content.split(" ").at(-1);
  try {
    id = parseInt(id);
  } catch (err) {
    message.reply("ID must be a number!");
    return;
  }
  const user = await prisma.user.findUnique({
    where: {
      username: message.author.username,
    },
  });
  // Check that the user is in the sprint
  const sprint = await prisma.sprint.findUnique({
    where: {
      id: id,
    },
    include: {
      participants: true,
    },
  });
  if (!sprint.participants.find((p) => p.id === user.id)) {
    message.reply("You are not in this sprint!");
    return;
  }
  await prisma.sprint.update({
    where: {
      id: id,
    },
    data: {
      participants: {
        disconnect: {
          id: user.id,
        },
      },
    },
  });
  // Remove linking table entry
  await prisma.userSprint.delete({
    where: {
      userId: user.id,
      sprintId: id,
    },
  });
  message.reply("You have left the sprint!");
}
