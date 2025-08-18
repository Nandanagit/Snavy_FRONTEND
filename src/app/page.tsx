"use client";
import { useState } from "react";
import { apiClient } from "../types/axios"; 
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
export default function Home() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const router = useRouter();

  const handleGenerate = async () => {
    if (!url) {
      setError("Please enter a URL");
      return;
    }

    try {
      setError("");
      setLoading(true);
      setData(null);

      const response = await apiClient.post("/scrape-website", {
        url,
      });

      setData(response.data);
      console.log("Scraped data:", response.data);
    } catch (err: any) {
      console.error("Scrape error:", err);
      setError("Failed to scrape website.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">Video Generator</h1>
      <p className="text-gray-600 mb-6">
        Turn any website&apos;s images into a promotional video
      </p>

      <div className="flex gap-2 mb-4 w-full max-w-md">
        <input
          type="text"
          placeholder="https://example.com/"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Scraping..." : "Scrape Website"}
        </button>
      </div>

      {error && toast.error(error)}
      {data && toast.success(`Scraping completed successfully!`)}
      {data && router.push("/page2")}
    </main>
  );
}
