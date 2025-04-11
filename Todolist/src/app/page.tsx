import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-8 sm:p-12 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col items-center text-center gap-8 max-w-2xl">
        <h1 className="text-5xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
          Welcome to Feed App
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">
          Stay connected with the latest updates, news, and posts from your network. 
          Join our community today and start exploring!
        </p>

        <div className="flex gap-4 items-center flex-wrap justify-center">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white gap-2 hover:from-blue-700 hover:to-purple-700 text-sm sm:text-base h-12 px-6 sm:px-8 shadow-lg hover:shadow-xl"
            href="/user/login"
          >
            Login
          </a>
          <a
            className="rounded-full border border-solid border-blue-600 dark:border-purple-400 transition-colors flex items-center justify-center bg-transparent text-blue-600 dark:text-purple-400 gap-2 hover:bg-blue-50 dark:hover:bg-gray-800 text-sm sm:text-base h-12 px-6 sm:px-8 shadow-lg hover:shadow-xl"
            href="/user/signup"
          >
            Sign Up
          </a>
        </div>
      </main>


    </div>
  );
}