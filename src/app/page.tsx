"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiArrowRight, FiGlobe } from "react-icons/fi";
import { toast } from "react-toastify";

export default function Home() {
  const [error, setError] = useState("");
  const [data, setData] = useState<any>(null);
  const [username, setName] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // const handleGenerate = async () => {
  //   if (!url) {
  //     setError("Please enter a URL");
  //     return;
  //   }
  //   try {
  //     setError("");
  //     setLoading(true);
  //     setData(null);
  //     const response = await apiClient.post("/scrape-website", { url });
  //     const store = await apiClient.post("mongo/store-user-details", {
  //       username,
  //       password,
  //       url,
  //     });
  //     console.log("Stored:", store.data);
  //     setData(response.data);
  //     console.log("Scraped data:", response.data);
  //   } catch (err: any) {
  //     console.error("Scrape error:", err);
  //     setError("Failed to scrape website.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      toast.success("Scraping completed successfully!");
      const timer = setTimeout(() => {
        router.push("/page3");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [data, router]);

  return (
    <main className="min-h-screen bg-[#020403] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-violet-800 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg">
              <FiGlobe className="text-white text-2xl" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-violet-200 mb-2">
            Video Generator
          </h1>
          <p className="text-violet-200">
            Turn any website's images into a promotional video
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="mb-4">
            {/* Username */}
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Username
            </label>
            <input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />

            {/* Password */}
            <label className="block text-sm font-semibold text-gray-700 mb-3 mt-4">
              Password
            </label>
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />

            {/*
            Website URL - Commented Out
            <label className="block text-sm font-semibold text-gray-700 mb-3 mt-4">
              Website URL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiGlobe className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="https://example.com/"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            */}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          {/* Submit */}
          <button
            onClick={() => router.push("/page3")}
            className="w-full bg-gradient-to-r from-violet-800 to-violet-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-violet-900 hover:to-violet-700 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
          >
            Login <FiArrowRight className="text-lg" />
          </button>
        </div>
      </div>
    </main>
  );
}
