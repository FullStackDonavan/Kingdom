import prisma from "~/server/database/client";
import { getUserByAuthToken } from "~/server/database/repositories/sessionRepository";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    if (!body.verseId || typeof body.highlighted !== "boolean") {
      throw createError({ statusCode: 400, message: "Invalid data" });
    }

    const authToken = getHeader(event, "authorization")?.replace("Bearer ", "");
    if (!authToken) {
      throw createError({ statusCode: 401, message: "Unauthorized: Missing token" });
    }

    const user = await getUserByAuthToken(authToken);
    if (!user) {
      throw createError({ statusCode: 401, message: "Unauthorized: Invalid token" });
    }

    const updatedHighlight = await prisma.highlightedVerse.upsert({
      where: { verseId_userId: { verseId: body.verseId, userId: user.id } },
      update: { highlighted: body.highlighted },
      create: {
        verseId: body.verseId,
        userId: user.id,
        highlighted: body.highlighted,
      },
    });

    return { highlighted: updatedHighlight.highlighted };
  } catch (error) {
    console.error("API Error:", error);
    throw createError({ statusCode: 500, message: error.message || "Server Error" });
  }
});
