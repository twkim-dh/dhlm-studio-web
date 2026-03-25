"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getSeasonalWeather, CITIES, type City, type WeatherData } from "@/lib/weather";

const CARDS = [
  {
    emoji: "\uD83D\uDC55",
    title: "\uC624\uB298 \uBB50 \uC785\uC9C0?",
    description: "\uB0A0\uC528\uC5D0 \uB531 \uB9DE\uB294 \uC637\uCC28\uB9BC \uCD94\uCC9C",
    href: "/today/outfit",
    gradient: "from-orange-400 to-amber-400",
  },
  {
    emoji: "\uD83C\uDF5C",
    title: "\uC624\uB298 \uBB50 \uBA39\uC9C0?",
    description: "\uB0A0\uC528\uC5D0 \uC5B4\uC6B8\uB9AC\uB294 \uBA54\uB274 \uCD94\uCC9C",
    href: "/today/food",
    gradient: "from-orange-500 to-red-400",
  },
  {
    emoji: "\u2615",
    title: "\uC624\uB298 \uBB50 \uB9C8\uC2DC\uC9C0?",
    description: "\uB0A0\uC528\uC5D0 \uB531 \uB9DE\uB294 \uC74C\uB8CC \uCD94\uCC9C",
    href: "/today/drink",
    gradient: "from-amber-400 to-orange-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function TodayPage() {
  const [city, setCity] = useState<City>("\uC11C\uC6B8");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("today-city");
    if (saved && CITIES.includes(saved as City)) {
      setCity(saved as City);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const w = getSeasonalWeather(city);
    setWeather(w);
    localStorage.setItem("today-city", city);
  }, [city, mounted]);

  const today = new Date();
  const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;

  return (
    <div className="flex flex-col items-center flex-1 px-5 py-8 max-w-[480px] mx-auto w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="flex flex-col items-center mt-4 mb-2"
      >
        <span className="text-5xl mb-2">{weather?.icon ?? "\u2600\uFE0F"}</span>
        <h1 className="text-3xl font-black text-[#F97316] tracking-tight">
          {"\uC624\uB298\uC758 \uCD94\uCC9C"}
        </h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-sm text-gray-500 mb-6 font-medium"
      >
        {dateStr} {"\uB0A0\uC528 \uAE30\uBC18 \uB9DE\uCDA4 \uCD94\uCC9C"}
      </motion.p>

      {/* City Selector */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full mb-6"
      >
        <div className="flex flex-wrap gap-2 justify-center">
          {CITIES.map((c) => (
            <button
              key={c}
              onClick={() => setCity(c)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                city === c
                  ? "bg-[#F97316] text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-orange-50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Weather Display */}
      {weather && mounted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 p-5 mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">{city} {"\uD604\uC7AC \uB0A0\uC528"}</p>
              <div className="flex items-end gap-1 mt-1">
                <span className="text-5xl font-black text-gray-900">{weather.temp}</span>
                <span className="text-2xl font-bold text-gray-400 mb-1">{"\u00B0C"}</span>
              </div>
            </div>
            <div className="text-center">
              <span className="text-5xl">{weather.icon}</span>
              <p className="text-sm font-medium text-gray-600 mt-1">{weather.label}</p>
            </div>
          </div>
          <div className="flex gap-4 mt-3 pt-3 border-t border-orange-100">
            <span className="text-xs text-gray-500">{"\uD83D\uDCA7"} {"\uC2B5\uB3C4"} {weather.humidity}%</span>
            {weather.dust && (
              <span className="text-xs text-red-500 font-medium">{"\uD83D\uDE37"} {"\uBBF8\uC138\uBA3C\uC9C0 \uC8FC\uC758"}</span>
            )}
          </div>
        </motion.div>
      )}

      {/* Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full space-y-4"
      >
        {CARDS.map((card) => (
          <motion.div key={card.title} variants={itemVariants}>
            <Link
              href={card.href}
              className="block w-full rounded-2xl p-5 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-2xl shadow-sm`}
                >
                  {card.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#F97316] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-500">{card.description}</p>
                </div>
                <span className="text-gray-300 group-hover:text-[#F97316] transition-colors text-xl">
                  {"\u203A"}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Info */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 text-xs text-gray-400 text-center"
      >
        {"\u2139\uFE0F \uB0A0\uC528\uB294 \uACC4\uC808 \uAE30\uBC18 \uC2DC\uBBAC\uB808\uC774\uC158\uC785\uB2C8\uB2E4. \uC2E4\uC81C \uB0A0\uC528\uC640 \uB2E4\uB97C \uC218 \uC788\uC5B4\uC694."}
      </motion.p>
    </div>
  );
}
