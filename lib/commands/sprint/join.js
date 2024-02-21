import { PrismaClient } from "@prisma/client";
import { Message } from "discord.js";

/**
 * Joins the player to a sprint
 * @param {PrismaClient} prisma
 * @param {Message} message
 * @returns
 */
export async function joinSprint(prisma, message) {
  if (message.content.split(" ").length != 3) {
    message.reply(
      "Some arguments are missing! Please use as !sprint join <id>"
    );
    return;
  }
  let strId = message.content.split(" ").at(-1);
  let id;
  try {
    id = parseInt(strId);
  } catch (err) {
    message.reply("ID must be a number!");
    return;
  }
  // Check that the user is not already in the sprint
  const sprint = await prisma.sprint.findUnique({
    where: {
      id: id,
    },
    include: {
      participants: true,
    },
  });
  if (sprint.participants.find((p) => p.id === message.author.id)) {
    message.reply("You are already in this sprint!");
    return;
  }
  await prisma.sprint.update({
    where: {
      id: id,
    },
    data: {
      participants: {
        connect: {
          id: message.author.id,
        },
      },
    },
  });
  // Create linking table entry
  await prisma.userSprint.create({
    data: {
      userId: message.author.id,
      sprintId: id,
    },
  });
  message.reply("You have joined the sprint!");
}
