"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaSearch, FaLink, FaVideo } from "react-icons/fa";

export default function FirecrawlPage2() {
  const [domain, setDomain] = useState("");
  const [domainLoading, setDomainLoading] = useState(false);
  const [urls, setUrls] = useState<string[]>([]);
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [scenes, setScenes] = useState<{ title: string; content: string }[]>([]);


  // Fetch domain from API
  const fetchDomain = async () => {
    try {
      setDomainLoading(true);
      const response = await fetch("http://localhost:6001/get-domain-of-temp-user");
      if (response.ok) {
        const data = await response.json();
        setDomain(data.domain || "");
      }
    } catch (error) {
      console.error("Failed to fetch domain:", error);
    } finally {
      setDomainLoading(false);
    }
  };

  useEffect(() => {
    fetchDomain();
  }, []);

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
        interface MappedData {
          links?: unknown[];
        }
        const typedData = data as MappedData;
        const list = Array.isArray(typedData?.links)
        ? typedData.links
        : Array.isArray(data)
        ? data
        : [];
      
      interface LinkItem {
        url?: string;
      }
      const normalized: string[] = list
        .map((x: unknown) =>
          typeof x === "string"
            ? x
            : typeof (x as LinkItem)?.url === "string"
            ? (x as LinkItem).url as string
            : undefined
        )
        .filter((u: unknown): u is string => typeof u === "string" && u.length > 0);
      
      setUrls(normalized);
    } catch (err) {
        console.error("Error fetching pages", err);
    }
    };

    const router = useRouter();
    const handleGenerateScenes = async () => {
        setLoading(true);
        setScenes([]);
    
        try {
          const response = await fetch("http://localhost:6001/ai/generate-scenes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              urls: selectedUrls,
              domain: domain,
              numScenes: 8,
              tone: "exciting",
              platform: "reels",
              maxLinesPerScene: 3,
              includeCTA: true,
              language: "english",
              hooksOnly: false,
              title: "Promotional Video",
              keywords: ["product", "brand", "promotion"],
              safeMode: true
            }),
          });
    
          if (response.ok) {
            const data = await response.json();
            // Transform the API response to match our scene format
            const generatedScenes = data.scenes ? data.scenes.map((scene: any, index: number) => ({
              title: `Scene ${index + 1}`,
              content: typeof scene === 'string' ? scene : scene.content || scene.name || 'Generated scene content'
            })) : [];
            
            setScenes(generatedScenes);
          } else {
            console.error("Failed to generate scenes:", response.statusText);
            // Fallback to dummy scenes if API fails
            const fallbackScenes = [
              { title: "Scene 1", content: "Welcome to our brand story - discover what makes us unique." },
              { title: "Scene 2", content: "Explore our premium products designed for your lifestyle." },
              { title: "Scene 3", content: "Join thousands of satisfied customers - shop now!" },
            ];
            setScenes(fallbackScenes);
          }
        } catch (error) {
          console.error("Error generating scenes:", error);
          // Fallback to dummy scenes on error
          const fallbackScenes = [
            { title: "Scene 1", content: "Welcome to our brand story - discover what makes us unique." },
            { title: "Scene 2", content: "Explore our premium products designed for your lifestyle." },
            { title: "Scene 3", content: "Join thousands of satisfied customers - shop now!" },
          ];
          setScenes(fallbackScenes);
        } finally {
          setLoading(false);
        }
      };

  return (
    <div className="min-h-screen bg-[#020403] flex flex-col items-center p-10">
      {/* Logo */}
      <h1 className="text-3xl font-signature text-violet-200">Snavy</h1>

      {/* Domain Section */}
      <div className="bg-gradient-to-br from-[#A05DD8] to-[#3B176C] p-10 rounded-2xl shadow-md w-full max-w-7xl mb-10">
        <div className="grid grid-cols-2 gap-6">
          {/* Domain Input */}
          <div>
            <label className="block font-semibold text-violet-100 mb-2">
              Domain
            </label>
            <div className="relative">
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder={domainLoading ? "Loading domain..." : "Enter website domain"}
                className="w-full p-3 rounded-lg border border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400 placeholder-white"
                disabled={domainLoading}
              />
              {domainLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                </div>
              )}
            </div>
            <button
              onClick={handleGetPages}
              className="mt-3 px-4 py-2 bg-violet-300/70 text-white rounded-lg shadow hover:bg-violet-700 hover:scale-105 transition-all duration-200 cursor-pointer flex items-center gap-2"
            >
              <FaSearch /> Get all pages
            </button>
          </div>
          
{/* urls found */}
          <div>
            <label className="block font-semibold text-violet-900 mb-2">
              URLs Found
            </label>
            <div className="bg-violet-300/70 text-white p-3 rounded-lg h-32 overflow-y-auto">
            {urls.length > 0 ? (
              urls.map((url, i) => (
                <div
                  key={i}
                  className="cursor-pointer hover:underline"
                  onClick={() =>
                    setSelectedUrls((prev) => (prev.includes(url) ? prev : [...prev, url]))
                  }
                >
                  <FaLink className="inline mr-2" /> {url}
                </div>
              ))
            ) : (
              <p>No URLS found</p>
            )}
              </div>
            </div>
        </div>
      </div>

      {/* Selected URLs Section */}
      <div className="bg-gradient-to-br from-[#A05DD8] to-[#3B176C] p-10 rounded-2xl shadow-md w-full max-w-7xl mb-16">
        <label className="block font-semibold text-violet-100 mb-2">
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
            className="mt-4 bg-green-600 hover:bg-green-700 hover:scale-105 transition-all duration-200 cursor-pointer text-white px-4 py-2 rounded-lg shadow-md"
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
        <label className="block font-semibold text-violet-100 mb-4">
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
          <button
            onClick={() => router.push('/v2/generated-video')}
            className="px-6 py-3 bg-violet-300/70 text-white rounded-xl shadow hover:bg-violet-700 hover:scale-105 transition-all duration-200 cursor-pointer flex items-center gap-2"
          >
            <FaVideo /> Generate Video
          </button>
        </div>
      </div>
    </div>
  );
}
