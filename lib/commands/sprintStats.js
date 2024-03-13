import { PrismaClient } from "@prisma/client";
import { Message } from "discord.js";

/**
 * Returns stats about the sprints joined by the user, including their number, and total pages read
 * @param {PrismaClient} prisma
 * @param {Message} message
 */
export async function sprintStats(prisma, message) {
  if (!message) {
    throw new Error("Message is not defined!");
  }
  const user = await prisma.user.findUnique({
    where: {
      username: message.author.username,
    },
    include: { sprints: true, UserSprint: true },
  });
  if (!user) {
    message.reply("You are not in any sprint!");
    return;
  }
  const sprints = user.UserSprint;
  if (!sprints || sprints.length === 0) {
    message.reply("You have not participated in any sprint!");
    return;
  }
  const totalSprints = sprints.length;
  const totalPages = sprints.reduce(
    (acc, sprint) => acc + sprint.pagesFinal - sprint.pagesInitial,
    0
  );
  message.reply(
    `You have joined ${totalSprints} sprints and read ${totalPages} pages!`
  );
}
