import { PrismaClient } from "@prisma/client";
import { Message } from "discord.js";
import { createSprint } from "./create.js";
import { joinSprint } from "./join.js";
import { leaveSprint } from "./leave.js";
import { logSprintPages } from "./log.js";

/**
 * Handles all sprint-related commands
 * @param {PrismaClient} prisma
 * @param {Message} message
 */
export async function sprintHandler(prisma, message) {
  if (!message) {
    throw new Error("Message is not defined!");
  }
  const messageContent = message.content.split(" ");
  const command = messageContent[1];
  switch (command) {
    case "start":
      await createSprint(prisma, message);
      break;
    case "join":
      await joinSprint(prisma, message);
      break;
    case "leave":
      await leaveSprint(prisma, message);
      break;
    case "end":
      await endSprint(prisma, message);
      break;
    case "info":
      await sprintInfo(prisma, message);
      break;
    case "log":
      await logSprintPages(prisma, message);
      break;
    default:
      break;
  }
}
