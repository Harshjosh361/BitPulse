import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 bg-blue-500 rounded-full animate-pulse" />
            <h1 className="text-xl font-bold text-black">Bit Pulse</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16 flex flex-col items-center text-center">
          <div className="mb-6 sm:mb-8 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl">
              Shorten Links, Expand Possibilities
            </h2>
          </div>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600 max-w-2xl px-4">
            Transform long URLs into concise, trackable links instantly. Perfect for social media, marketing campaigns,
            and anywhere space matters.
          </p>

          <div className="mt-6 sm:mt-8 md:mt-10 w-full max-w-2xl px-4">
            <div className="relative rounded-lg shadow-sm">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <input
                  type="url"
                  placeholder="Paste your long URL here"
                  className="w-full flex-1 py-3 sm:py-4 px-4 sm:px-6 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
                <Link
                  href="/login"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg 
                           transform transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-blue-200"
                >
                  Shorten URL
                </Link>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4">
              By clicking Shorten URL, you agree to our Terms of Service
            </p>
          </div>

          <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 px-4">
            {[
              { title: "Lightning-Fast", text: "Instant link shortening" },
              { title: "Analytics", text: "Real-time click tracking" },
              { title: "Custom URLs", text: "Branded short links" },
              { title: "Secure", text: "HTTPS encryption" },
            ].map((feature) => (
              <div key={feature.title} className="p-4 sm:p-6 border border-gray-100 rounded-xl bg-gray-50">
                <h3 className="text-lg font-semibold text-black">{feature.title}</h3>
                <p className="mt-2 text-sm sm:text-base text-gray-600">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 mt-8">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <p className="text-center text-xs sm:text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Bit Pulse. Making long URLs a thing of the past.
          </p>
        </div>
      </footer>
    </div>
  )
}
