import { PrismaClient } from "@prisma/client";
import { Message, TextChannel } from "discord.js";

/**
 * Handles sprint start
 * @param {PrismaClient} prisma
 * @param {Number} id
 * @param {TextChannel} channel
 */
async function onSprintStart(prisma, id, channel) {
  channel.send(`Sprint ${id} has started!`);
}

/**
 * Handles sprint end
 * @param {PrismaClient} prisma
 * @param {Number} id
 * @param {TextChannel} channel
 */
async function onSprintEnd(prisma, id, channel) {
  // mention all users who joined the sprint
  const sprint = await prisma.sprint.findUnique({
    where: {
      id,
    },
    include: {
      participants: true,
    },
  });
  const members = sprint.participants.map((m) => "@" + m.username).join(" ");
  channel.send(
    `Sprint ${id} has ended!\nYou have five minutes to record your pages! ${members}`
  );
}

/**
 * Handles the very end of the sprint, when users submit their pages
 * @param {PrismaClient} prisma
 * @param {Number} id
 * @param {TextChannel} channel
 */
async function onPagesSubmit(prisma, id, channel) {
  throw new Error("Not implemented");
}

/**
 * Creates a sprint with no members
 * @param {PrismaClient} prisma
 * @param {Message} message
 */
export async function createSprint(prisma, message) {
  if (message.content.split(" ").length != 4) {
    message.reply(
      "Some arguments are missing! Please use as !sprint create <time> <delay>"
    );
    return;
  }
  let duration = message.content.split(" ").at(-2);
  let delay = message.content.split(" ").at(-1);
  try {
    duration = parseInt(duration);
    delay = parseInt(delay);
  } catch (err) {
    message.reply("Duration and delay must be numbers!");
    return;
  }
  // Check that there are no other sprints running
  const sprints = await prisma.sprint.findMany();
  if (
    sprints.some(
      (s) =>
        s.endDate > new Date().toISOString() ||
        s.startDate > new Date().toISOString()
    )
  ) {
    message.reply("There is already a sprint running!");
    return;
  }
  try {
    const startDate = new Date(
      new Date().getTime() + delay * 60 * 1000
    ).toISOString();
    const endDate = new Date(
      new Date().getTime() + (delay + duration) * 60 * 1000
    ).toISOString();
    const res = await prisma.sprint.create({
      data: {
        startDate,
        endDate,
      },
    });
    setTimeout(
      () => onSprintStart(prisma, res.id, message.channel),
      delay * 60 * 1000
    );
    setTimeout(
      () => onSprintEnd(prisma, res.id, message.channel),
      (delay + duration) * 60 * 1000
    );
    await message.reply(
      `Sprint created for ${duration} minutes in ${delay} minutes. ID: ${res.id}`
    );
  } catch (err) {
    console.error(err);
    message.reply(
      "An error occurred while creating the sprint or while running it."
    );
  }
}
