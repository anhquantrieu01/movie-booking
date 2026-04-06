import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

// RATE LIMIT (basic)
const requestMap = new Map<string, number>();

function checkRateLimit(userId: string) {
  const now = Date.now();
  const last = requestMap.get(userId) || 0;

  if (now - last < 3000) {
    return false;
  }

  requestMap.set(userId, now);
  return true;
}

export async function POST(req: Request) {
  try {
    const { movieId, rating, comment } = await req.json();
    if (!movieId || !rating || !comment) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // RATE LIMIT
    if (!checkRateLimit(userId)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    // CHECK USER ĐÃ XEM CHƯA
    const hasWatched = await prisma.booking.findFirst({
      where: {
        userId,
        showtime: {
          movieId,
        },
        payment: {
          status: "SUCCESS",
        },
      },
    });

    if (!hasWatched) {
      return NextResponse.json(
        { error: "Bạn chưa xem phim này" },
        { status: 403 },
      );
    }

    // TRANSACTION
    const result = await prisma.$transaction(async (tx) => {
      // UPSERT REVIEW
      const review = await tx.review.upsert({
        where: {
          userId_movieId: {
            userId,
            movieId,
          },
        },
        update: {
          rating,
          comment,
        },
        create: {
          userId,
          movieId,
          rating,
          comment,
        },
      });

      // AGGREGATE
      const stats = await tx.review.aggregate({
        where: { movieId },
        _avg: { rating: true },
        _count: true,
      });

      // UPDATE MOVIE
      await tx.movie.update({
        where: { id: movieId },
        data: {
          avgRating: stats._avg.rating || 0,
          reviewCount: stats._count,
        },
      });

      return {
        review,
        avgRating: stats._avg.rating || 0,
        reviewCount: stats._count,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("REVIEW_ERROR:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const movieId = searchParams.get("movieId")
  const cursor = searchParams.get("cursor") 
  if (!movieId) {
    return NextResponse.json({ error: "Missing movieId" }, { status: 400 })
  }

  const PAGE_SIZE = 10

  // 🔥 movie stats
  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
    select: {
      avgRating: true,
      reviewCount: true,
    },
  })

  // 🔥 stats 1-5 sao
  const statsRaw = await prisma.review.groupBy({
    by: ["rating"],
    where: { movieId },
    _count: true,
  })

  const stats = [1,2,3,4,5].map(star => {
    const found = statsRaw.find(s => s.rating === star)
    return { star, count: found?._count || 0 }
  })

  // 🔥 reviews (cursor pagination)
  const reviews = await prisma.review.findMany({
    where: { movieId },
    take: PAGE_SIZE,
    ...(cursor && {
      skip: 1,
      cursor: { id: cursor },
    }),
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  })

  return NextResponse.json({
    avgRating: movie?.avgRating || 0,
    reviewCount: movie?.reviewCount || 0,
    stats,
    reviews,
    nextCursor: reviews.length === PAGE_SIZE
      ? reviews[reviews.length - 1].id
      : null,
  })
}
