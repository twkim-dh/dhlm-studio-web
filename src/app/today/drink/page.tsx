"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getSeasonalWeather, CITIES, type City, type WeatherData } from "@/lib/weather";

interface DrinkItem {
  emoji: string;
  name: string;
  tag: "HOT" | "ICE" | "ANY";
}

function getDrinksByWeather(temp: number, condition: string): { category: string; drinks: DrinkItem[] } {
  if (condition === "rain") {
    return {
      category: "\uBE44 \uC624\uB294 \uB0A0 \uD55C \uC794",
      drinks: [
        { emoji: "\uD83C\uDF76", name: "\uB9C9\uAC78\uB9AC", tag: "ANY" },
        { emoji: "\uD83C\uDF77", name: "\uC640\uC778", tag: "ANY" },
        { emoji: "\uD83C\uDF75", name: "\uB530\uB73B\uD55C \uCC28", tag: "HOT" },
        { emoji: "\u2615", name: "\uCF54\uCF54\uC544", tag: "HOT" },
        { emoji: "\uD83C\uDF75", name: "\uC0DD\uAC15\uCC28", tag: "HOT" },
      ],
    };
  }
  if (temp >= 28) {
    return {
      category: "\uB354\uC6B4 \uB0A0 \uC2DC\uC6D0\uD558\uAC8C",
      drinks: [
        { emoji: "\u2615", name: "\uC544\uC774\uC2A4\uC544\uBA54\uB9AC\uCE74\uB178", tag: "ICE" },
        { emoji: "\uD83C\uDF4B", name: "\uB808\uBAAC\uC5D0\uC774\uB4DC", tag: "ICE" },
        { emoji: "\uD83C\uDF49", name: "\uC218\uBC15\uC8FC\uC2A4", tag: "ICE" },
        { emoji: "\uD83C\uDF7A", name: "\uB9E5\uC8FC", tag: "ICE" },
        { emoji: "\uD83E\uDDCA", name: "\uC544\uC774\uC2A4\uD2F0", tag: "ICE" },
      ],
    };
  }
  if (temp >= 20) {
    return {
      category: "\uC0C1\uCFE0\uD55C \uB0A0 \uC0C1\uCFE4\uD558\uAC8C",
      drinks: [
        { emoji: "\u2615", name: "\uCE74\uD398\uB77C\uB5BC", tag: "ANY" },
        { emoji: "\uD83C\uDF75", name: "\uB179\uCC28", tag: "ICE" },
        { emoji: "\u2615", name: "\uCF5C\uB4DC\uBE0C\uB8E8", tag: "ICE" },
        { emoji: "\uD83E\uDD64", name: "\uC2A4\uBB34\uB514", tag: "ICE" },
        { emoji: "\uD83E\uDDC3", name: "\uACFC\uC77C\uC8FC\uC2A4", tag: "ICE" },
      ],
    };
  }
  if (temp >= 12) {
    return {
      category: "\uC4C0\uC4C0\uD55C \uB0A0 \uB530\uB73B\uD558\uAC8C",
      drinks: [
        { emoji: "\u2615", name: "\uB530\uB73B\uD55C \uB77C\uB5BC", tag: "HOT" },
        { emoji: "\uD83C\uDF4A", name: "\uC720\uC790\uCC28", tag: "HOT" },
        { emoji: "\uD83C\uDF75", name: "\uC0DD\uAC15\uCC28", tag: "HOT" },
        { emoji: "\u2615", name: "\uCE74\uD478\uCE58\uB178", tag: "HOT" },
        { emoji: "\uD83E\uDD5B", name: "\uBC00\uD06C\uD2F0", tag: "HOT" },
      ],
    };
  }
  return {
    category: "\uCD94\uC6B4 \uB0A0 \uBCF4\uC628\uC74C\uB8CC",
    drinks: [
      { emoji: "\u2615", name: "\uD56B\uCD08\uCF54", tag: "HOT" },
      { emoji: "\uD83C\uDF3E", name: "\uACE1\uBB3C\uB77C\uB5BC", tag: "HOT" },
      { emoji: "\uD83C\uDF75", name: "\uC778\uC0BC\uCC28", tag: "HOT" },
      { emoji: "\uD83C\uDF75", name: "\uC30D\uD654\uCC28", tag: "HOT" },
      { emoji: "\uD83C\uDF3F", name: "\uB9E4\uC2E4\uCC28", tag: "HOT" },
    ],
  };
}

// Deterministic shuffle
function deterministicShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = ((s * 1103515245 + 12345) & 0x7fffffff);
    const j = s % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const TAG_COLORS = {
  HOT: { bg: "bg-red-100", text: "text-red-600" },
  ICE: { bg: "bg-blue-100", text: "text-blue-600" },
  ANY: { bg: "bg-gray-100", text: "text-gray-600" },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function DrinkPage() {
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
  const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate() + 7;

  const drinkData = weather ? getDrinksByWeather(weather.temp, weather.condition) : null;
  const shuffled = drinkData ? deterministicShuffle(drinkData.drinks, dateSeed) : [];

  async function handleShare() {
    if (!weather || shuffled.length === 0) return;
    const top = shuffled[0];
    const tempLabel = weather.temp <= 11 ? "\uCD94\uC6B4" : weather.temp >= 28 ? "\uB354\uC6B4" : "";
    const text = `${tempLabel ? tempLabel + " \uB0A0\uC5D4" : "\uC624\uB298\uC740"} ${top.name}! ${top.emoji}${weather.icon}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "\uC624\uB298 \uBB50 \uB9C8\uC2DC\uC9C0?", text });
      } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(text);
      alert("\uD074\uB9BD\uBCF4\uB4DC\uC5D0 \uBCF5\uC0AC\uB418\uC5C8\uC5B4\uC694!");
    }
  }

  return (
    <div className="flex flex-col items-center flex-1 px-5 py-8 max-w-[480px] mx-auto w-full">
      {/* Back + Title */}
      <div className="w-full flex items-center mb-6">
        <Link href="/today" className="text-gray-400 hover:text-[#F97316] transition-colors mr-3 text-lg">
          {"\u2190"}
        </Link>
        <h1 className="text-2xl font-black text-[#F97316]">{"\u2615 \uC624\uB298 \uBB50 \uB9C8\uC2DC\uC9C0?"}</h1>
      </div>

      {/* City Selector */}
      <div className="w-full mb-5">
        <div className="flex flex-wrap gap-2 justify-center">
          {CITIES.map((c) => (
            <button
              key={c}
              onClick={() => setCity(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                city === c
                  ? "bg-[#F97316] text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-orange-50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Weather Summary */}
      {weather && mounted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 p-4 mb-6"
        >
          <div className="flex items-center gap-4">
            <span className="text-4xl">{weather.icon}</span>
            <div>
              <p className="text-sm text-gray-500">{city} {"\uC624\uB298 \uB0A0\uC528"}</p>
              <p className="text-2xl font-black text-gray-900">
                {weather.temp}{"\u00B0C"} <span className="text-base font-medium text-gray-500">{weather.label}</span>
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Drink Recommendations */}
      {drinkData && mounted && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="w-full space-y-4"
        >
          {/* Category Label */}
          <motion.div variants={itemVariants} className="text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#F97316] text-white text-sm font-bold">
              {drinkData.category}
            </span>
          </motion.div>

          {/* Drink Cards */}
          <motion.div variants={itemVariants} className="space-y-3">
            {shuffled.map((drink, idx) => {
              const tagColor = TAG_COLORS[drink.tag];
              return (
                <div
                  key={drink.name}
                  className={`flex items-center gap-4 rounded-xl bg-white shadow-sm p-4 ${
                    idx === 0 ? "border-2 border-orange-200" : "border border-gray-100"
                  }`}
                >
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center text-3xl">
                    {drink.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {idx === 0 && (
                        <span className="text-xs font-bold text-[#F97316]">{"\uD83C\uDFC6"}</span>
                      )}
                      <span className="font-bold text-gray-900 text-lg">{drink.name}</span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${tagColor.bg} ${tagColor.text}`}>
                    {drink.tag}
                  </span>
                </div>
              );
            })}
          </motion.div>

          {/* Share */}
          <motion.div variants={itemVariants} className="flex justify-center pt-2">
            <button
              onClick={handleShare}
              className="w-full px-6 py-2.5 rounded-xl bg-[#F97316] text-white font-bold text-sm shadow-md hover:bg-orange-600 transition-colors"
            >
              {"\uD83D\uDCE4 \uCD94\uCC9C \uACF5\uC720\uD558\uAE30"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
