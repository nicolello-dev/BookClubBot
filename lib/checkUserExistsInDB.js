import { PrismaClient } from "@prisma/client";
import { User } from "discord.js";

/**
 * Checks if a user exists in the database, if not, creates it.
 * @param {PrismaClient} prisma
 * @param {User} user
 */
export async function checkUserExistsInDB(prisma, user) {
  let id;
  try {
    id = parseInt(user.id);
  } catch (err) {
    throw new Error("User id is not a number!");
  }
  const res = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!res) {
    await prisma.user.create({
      data: {
        id,
        username: user.username,
      },
    });
  }
}
