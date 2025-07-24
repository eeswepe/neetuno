import React from "react";
import { BookHeart } from "lucide-react";
import Button from "./ui/Button";

const WelcomePage = ({onStart})=> {
  return (
    <div className=" min-h-screen bg-gray-900 flex flex-col justify-center items-center text-center p-4 animate-fade-in">
      <div className="bg-gray-800 p-8 sm:p-12 rounded-2xl shadow-2xl max-w-2xl w-full border border-gray-700">
        
        <div className="mb-6">
          <BookHeart className="mx-auto h-16 w-16 text-indigo-400" strokeWidth={1.5} />
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          Selamat Datang di <span className="text-indigo-400">Neetuno</span>
        </h1>

        <p className="text-lg text-gray-300 mb-10 max-w-xl mx-auto">
          Atur dan lacak semua hal yang ingin Anda pelajari. Dari pengembangan web hingga resep masakan, semua dalam satu tempat yang rapi.
        </p>

        <Button onClick={onStart} className="px-8 py-3 text-lg">
          Mulai Atur Pembelajaran
        </Button>
      </div>
    </div>
  )
}

export default WelcomePage

