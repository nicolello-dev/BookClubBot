import { PrismaClient } from "@prisma/client";
import { Message } from "discord.js";

/**
 * Updates the pages read during the latest sprint
 * @param {PrismaClient} prisma
 * @param {Message} message
 * @returns
 */
export async function logSprintPages(prisma, message) {
  if (message.content.split(" ").length != 3) {
    message.reply(
      "Some arguments are missing! Please use as !sprint final <pages>"
    );
    return;
  }
  const strPages = message.content.split(" ").at(-1);
  let pages;
  try {
    pages = parseInt(pages);
  } catch (err) {
    message.reply("<pages> must be a number!");
    return;
  }
  const latestSprint = await prisma.sprint.findFirst({
    where: {
      participants: {
        some: {
          id: parseInt(message.author.id),
        },
      },
    },
    orderBy: {
      id: "desc",
    },
  });
  if (!latestSprint) {
    message.reply("You are not in any sprint!");
    return;
  }
  await prisma.userSprint.update({
    where: {
      userId_sprintId: {
        userId: parseInt(message.author.id),
        sprintId: latestSprint.id,
      },
    },
    data: {
      pagesRead: pages,
    },
  });
  message.reply("Pages read updated!");
}
