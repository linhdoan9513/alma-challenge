import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-green-600">alma</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Get an assessment of your immigration case from experienced
            attorneys
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/lead-form"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Get Assessment
            </Link>
            <Link
              href="/admin"
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Admin Panel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
