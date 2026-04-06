"use client"

import useSWRInfinite from "swr/infinite"
import MovieReviewUI from "./MovieReviewUI"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function MovieReviewWrapper({ movieId }: { movieId: string }) {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.nextCursor) return null

    if (pageIndex === 0) {
      return `/api/review?movieId=${movieId}`
    }

    return `/api/review?movieId=${movieId}&cursor=${previousPageData.nextCursor}`
  }

  const {
    data,
    size,
    setSize,
    isLoading,
    mutate
  } = useSWRInfinite(getKey, fetcher)

  if (isLoading) return <div className="text-white">Loading...</div>

  // 🔥 gộp tất cả page
  const pages = data || []
  const firstPage = pages[0]

  const reviews = pages.flatMap(p => p.reviews)

  return (
    <MovieReviewUI
      avgRating={firstPage.avgRating}
      reviewCount={firstPage.reviewCount}
      stats={firstPage.stats}
      reviews={reviews}
      loadMore={() => setSize(size + 1)}
      hasMore={!!pages[pages.length - 1]?.nextCursor}
      onSuccess={mutate} // 🔥 reload
      movieId={movieId}
    />
  )
}