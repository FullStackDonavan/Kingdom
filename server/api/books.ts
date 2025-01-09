import prisma from "~/server/database/client";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const translationId = Number(query.translationId);

  if (!translationId) {
    throw createError({ statusCode: 400, message: "translationId is required" });
  }

  const books = await prisma.books.findMany({
    where: {
      translationId,
    },
    select: {
      id: true,
      name: true,
    },
  });

  return { books };
});
