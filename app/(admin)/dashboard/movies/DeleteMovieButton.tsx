"use client"

import { deleteMovie } from "./actions"

export default function DeleteMovieButton({
  id,
  posterId
}:{id:string,posterId?:string}){

  return(

    <button
      onClick={()=>deleteMovie(id,posterId)}
      className="bg-red-600 text-white px-3 py-1 rounded"
    >
      Delete
    </button>

  )
}