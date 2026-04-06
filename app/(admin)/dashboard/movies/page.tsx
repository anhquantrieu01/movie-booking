import { prisma } from "@/lib/prisma"
import CreateMovieForm from "./CreateMovieForm"
import EditMovieForm from "./EditMovieForm"
import DeleteMovieButton from "./DeleteMovieButton"
import Image from "next/image"

export default async function Page() {

  const movies = await prisma.movie.findMany({
    orderBy: { releaseDate: "desc" }
  })

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold text-red-600 mb-6">
        Movie Management
      </h1>

      <CreateMovieForm />

      <div className="mt-6 overflow-x-auto">

        <table className="w-full border rounded text-left">

          <thead className="bg-red-600 text-white">
            <tr>
              <th className="p-3">Poster</th>
              <th className="p-3">Title</th>
              <th className="p-3">Status</th>
              <th className="p-3">Language</th>
              <th className="p-3">Country</th>
              <th className="p-3">Age Rating</th>
              <th className="p-3">Duration</th>
              <th className="p-3">Release</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {movies.map(movie => (
              <tr key={movie.id} className="border-b hover:bg-red-50">

                <td className="p-3">
                  {movie.posterUrl && (
                    <Image
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-16 rounded"
                      width={64}
                      height={96}
                    />
                  )}
                </td>

                <td className="p-3 font-medium">{movie.title}</td>
                <td className="p-3">{movie.status}</td>
                <td className="p-3">{movie.language}</td>
                <td className="p-3">{movie.country}</td>
                <td className="p-3">{movie.ageRating || "-"}</td>
                <td className="p-3">{movie.duration} min</td>
                <td className="p-3">{movie.releaseDate.toDateString()}</td>

                <td className="p-3 flex gap-2 justify-end">
                  <EditMovieForm movie={movie} />
                  <DeleteMovieButton
                    id={movie.id}
                    posterId={movie.posterId || ""}
                  />
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  )
}