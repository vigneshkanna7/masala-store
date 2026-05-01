// src/pages/VideosPage.js
import React, { useState } from "react";

const categories = ["All", "Chicken", "Mutton", "Vegetarian", "Breakfast", "Beverages"];

const videos = [
  {
    id: 1,
    title: "Chicken Masala Recipe",
    category: "Chicken",
    description: "A rich and aromatic chicken curry made with Melam Chicken Masala powder.",
    youtubeId: "LXKFLaHNnRs",
  },
  {
    id: 2,
    title: "Mutton Curry with Melam Masala",
    category: "Mutton",
    description: "Tender mutton pieces slow-cooked with Melam Mutton Masala for an authentic Kerala taste.",
    youtubeId: "6vqjvO8RPXM",
  },
  {
    id: 3,
    title: "Vegetable Masala Curry",
    category: "Vegetarian",
    description: "A wholesome vegetable curry made with fresh produce and Melam Vegetable Masala.",
    youtubeId: "K4si_P9MQDY",
  },
  {
    id: 4,
    title: "Kerala Sambar Recipe",
    category: "Vegetarian",
    description: "Traditional Kerala-style sambar with Melam Sambar Masala — perfect with rice or idli.",
    youtubeId: "pqOCBHPDOCY",
  },
  {
    id: 5,
    title: "Appam & Stew Breakfast",
    category: "Breakfast",
    description: "Classic Kerala breakfast combo — soft appam paired with a creamy vegetable stew.",
    youtubeId: "TnFl8SRG6E4",
  },
  {
    id: 6,
    title: "Masala Chai Recipe",
    category: "Beverages",
    description: "A warming cup of spiced Indian chai brewed with Melam's aromatic spice blend.",
    youtubeId: "vH3RFH6XKLI",
  },
  {
    id: 7,
    title: "Meat Masala Fry",
    category: "Mutton",
    description: "A dry, spicy meat fry recipe using Melam Meat Masala — great as a side dish.",
    youtubeId: "zj_kEDSG4Yk",
  },
  {
    id: 8,
    title: "Egg Roast Kerala Style",
    category: "Breakfast",
    description: "Kerala-style egg roast with Melam spices — pairs perfectly with appam or parotta.",
    youtubeId: "5JoRbGfqmic",
  },
];

const VideosPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [playingId, setPlayingId] = useState(null);

  const filtered = activeCategory === "All"
    ? videos
    : videos.filter((v) => v.category === activeCategory);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Page Title */}
        <h1 className="text-4xl font-semibold text-center text-gray-800 mb-2">
          Videos
        </h1>
        <p className="text-center text-gray-500 mb-10">
          Watch our authentic Kerala recipes come to life
        </p>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition
                ${activeCategory === cat
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-white text-gray-600 border-gray-300 hover:border-red-400 hover:text-red-600"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((video) => (
            <div
              key={video.id}
              className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition group"
            >
              {/* Thumbnail / Embed */}
              <div className="relative w-full aspect-video bg-gray-100">
                {playingId === video.id ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <>
                    <img
                      src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Play button overlay */}
                    <button
                      onClick={() => setPlayingId(video.id)}
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-40 transition"
                    >
                      <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                        <svg
                          className="w-6 h-6 text-white ml-1"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </button>
                  </>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <span className="text-xs font-medium text-red-600 uppercase tracking-wide">
                  {video.category}
                </span>
                <h3 className="text-sm font-semibold text-gray-800 mt-1 mb-1 leading-snug">
                  {video.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                  {video.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">No videos found in this category.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default VideosPage;