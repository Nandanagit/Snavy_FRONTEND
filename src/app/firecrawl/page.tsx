"use client";

import React, { useState } from "react";
import { FaSearch, FaLink, FaVideo } from "react-icons/fa";

export default function FirecrawlPage() {
  const [domain, setDomain] = useState("");
  const [urls, setUrls] = useState<(string | { url: string })[]>([]);
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [scenes, setScenes] = useState<{ title: string; content: string }[]>([]);


 const handleGetPages = async () => {
    try {
        const res = await fetch("http://localhost:6001/firecrawl/map-site", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: domain }),
        });

        if (!res.ok) {
        throw new Error(await res.text());
        }

        const data = await res.json();
        console.log("Mapped URLs:", data);
        setUrls(data);
    } catch (err) {
        console.error("Error fetching pages", err);
    }
    };

    const handleGenerateScenes = async () => {
        setLoading(true);
        setScenes([]);
    
        try {
          const res = await fetch("http://localhost:3000/firecrawl/generate-scenes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ urls: selectedUrls }),
          });
    
          // For now, just mock scenes instead of real scraping
          const dummyScenes = [
            { title: "Scene 1", content: "This is a dummy scene generated from the URLs." },
            { title: "Scene 2", content: "Another scene with placeholder content." },
            { title: "Scene 3", content: "Final dummy scene for preview." },
          ];
    
          // Pretend backend responded
          setTimeout(() => {
            setScenes(dummyScenes);
            setLoading(false);
          }, 2000);
        } catch (error) {
          console.error("Error generating scenes", error);
          setLoading(false);
        }
      };

  return (
    <div className="min-h-screen bg-[#020403] flex flex-col items-center p-10">
      {/* Logo */}
      <h1 className="text-4xl font-extrabold text-violet-300 mb-8 font-cursive">
        SNAVY
      </h1>

      {/* Domain Section */}
      <div className="bg-gradient-to-br from-[#A05DD8] to-[#3B176C] p-10 rounded-2xl shadow-md w-full max-w-7xl mb-10">
        <div className="grid grid-cols-2 gap-6">
          {/* Domain Input */}
          <div>
            <label className="block font-semibold text-violet-300 mb-2">
              Domain
            </label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="Enter website domain"
              className="w-full p-3 rounded-lg border border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400 placeholder-white"
            />
            <button
              onClick={handleGetPages}
              className="mt-3 px-4 py-2 bg-violet-300/70 text-white rounded-lg shadow hover:bg-violet-700 flex items-center gap-2"
            >
              <FaSearch /> Get all pages
            </button>
          </div>

          {/* URLs Found */}
          <div>
            <label className="block font-semibold text-violet-100 mb-2">
              URLs Found
            </label>
            <div className="bg-violet-300/60 text-white p-3 rounded-lg h-32 overflow-y-auto">
              {urls.length > 0 ? (
                urls.map((item, i) => {
                    const url = typeof item === "string" ? item : item.url; // ✅ handle both cases
                    return (
                      <div
                        key={i}
                        className="cursor-pointer hover:underline"
                        onClick={() =>
                          setSelectedUrls((prev) =>
                            prev.includes(url) ? prev : [...prev, url]
                          )
                        }
                      >
                        <FaLink className="inline mr-2" /> {url}
                      </div>
                    );
                  })
                ) : (
                  <p>No URLs fetched yet</p>
                )}
              </div>
            </div>
        </div>
      </div>

      {/* Selected URLs Section */}
      <div className="bg-gradient-to-br from-[#A05DD8] to-[#3B176C] p-10 rounded-2xl shadow-md w-full max-w-7xl mb-16">
        <label className="block font-semibold text-violet-300 mb-2">
          Selected URLs
        </label>
        <div className="bg-violet-300/70 text-white p-3 rounded-lg h-29 overflow-y-auto">
          {selectedUrls.length > 0 ? (
            selectedUrls.map((url, i) => (
              <div key={i}>
                <FaLink className="inline mr-2" /> {url}
              </div>
            ))
          ) : (
            <p>No URLs selected</p>
          )}
        </div>
     

      {selectedUrls.length > 0 && (
        <div className="mt-4">
          <h2 className="font-semibold text-violet-400">Selected URLs</h2>
          <ul className="list-disc ml-6 text-violet-400">
            {selectedUrls.map((url, i) => (
              <li key={i}>{url}</li>
            ))}
          </ul>

          {/* Button to Generate Scenes */}
          <button
            onClick={handleGenerateScenes}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Generate Scenes
          </button>
        </div>
      )}
 </div>
      {/* Loading Skeleton */}
      {loading && (
        <div className="mt-6 space-y-4">
          <div className="h-6 bg-violet-100 animate-pulse rounded"></div>
          <div className="h-6 bg-violet-100 animate-pulse rounded"></div>
          <div className="h-6 bg-violet-100 animate-pulse rounded"></div>
        </div>
      )}

      {/* Scene Section */}
      <div className="bg-gradient-to-br from-[#A05DD8] to-[#3B176C] p-10 rounded-2xl shadow-md w-full max-w-7xl">
        <label className="block font-semibold text-violet-300 mb-4">
          Scene
        </label>
        <div className="grid grid-cols-3 gap-4">
          {scenes.map((scene,i) => (
            <div
              key={i}
              className="bg-violet-300/70 text-white p-6 rounded-xl shadow-md text-center"
            >
              <h3 className="font-semibold text-violet-100">{scene.title}</h3>
              <p className="text-violet-100">{scene.content}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <button className="px-6 py-3 bg-violet-300/70 text-white rounded-xl shadow hover:bg-violet-700 flex items-center gap-2">
            <FaVideo /> Generate Video
          </button>
        </div>
      </div>
    </div>
  );
}
