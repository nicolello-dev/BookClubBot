import { PrismaClient } from "@prisma/client";
import { Message } from "discord.js";

/**
 * Joins the player to a sprint
 * @param {PrismaClient} prisma
 * @param {Message} message
 * @returns
 */
export async function joinSprint(prisma, message) {
  if (message.content.split(" ").length != 4) {
    message.reply(
      "Some arguments are missing! Please use as !sprint join <id> <starting_pages>"
    );
    return;
  }
  const strId = message.content.split(" ").at(-1);
  const striPages = message.content.split(" ").at(-2);
  let id;
  let pages;
  try {
    id = parseInt(strId);
    pages = parseInt(striPages);
  } catch (err) {
    message.reply("id must be a number!");
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
  if (sprint.participants.find((p) => p.id === parseInt(message.author.id))) {
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
          id: parseInt(message.author.id),
        },
      },
    },
  });
  // Create linking table entry
  await prisma.userSprint.create({
    data: {
      userId: parseInt(message.author.id),
      sprintId: id,
      pagesRead: pages,
    },
  });
  message.reply("You have joined the sprint!");
}
