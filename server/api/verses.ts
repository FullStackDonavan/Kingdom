import prisma from "~/server/database/client";
import { getUserByAuthToken } from "~/server/database/repositories/sessionRepository";

export default defineEventHandler(async (event) => {
  try {
    const { chapterId } = getQuery(event);

    if (!chapterId) {
      throw createError({ statusCode: 400, message: "Chapter ID is required" });
    }

    // Get the logged-in user's highlights
    const authToken = getHeader(event, "authorization")?.replace("Bearer ", "");
    if (!authToken) {
      throw createError({ statusCode: 401, message: "Unauthorized" });
    }

    const user = await getUserByAuthToken(authToken);
    if (!user) {
      throw createError({ statusCode: 401, message: "User not found" });
    }

    const verses = await prisma.verses.findMany({
      where: { chapterId: parseInt(chapterId, 10) },
      include: {
        highlightedVerses: {
          where: { userId: user.id },
          select: { highlighted: true },
        },
      },
    });

    const processedVerses = verses.map((verse) => ({
      id: verse.id,
      number: verse.number,
      text: verse.text,
      highlighted: verse.highlightedVerses.length > 0 && verse.highlightedVerses[0].highlighted,
    }));

    return { verses: processedVerses };
  } catch (error) {
    console.error("Error fetching verses:", error);
    throw createError({ statusCode: 500, message: "Server Error" });
  }
});
