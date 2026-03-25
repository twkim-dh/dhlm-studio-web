"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getSeasonalWeather, CITIES, type City, type WeatherData } from "@/lib/weather";

interface FoodItem {
  emoji: string;
  name: string;
  reason: string;
}

function getFoodsByWeather(temp: number, condition: string): { category: string; foods: FoodItem[] } {
  if (condition === "rain") {
    return {
      category: "\uBE44 \uC624\uB294 \uB0A0 \uBA39\uC2B1\uB2C8\uB2E4",
      foods: [
        { emoji: "\uD83E\uDDC6", name: "\uD30C\uC804+\uB9C9\uAC78\uB9AC", reason: "\uBE44 \uC624\uB294 \uB0A0\uC758 \uC815\uC11D" },
        { emoji: "\uD83C\uDF5C", name: "\uCE7C\uAD6D\uC218", reason: "\uB530\uB73B\uD55C \uAD6D\uBB3C\uC774 \uC704\uB85C\uAC00 \uB418\uB294 \uB0A0" },
        { emoji: "\uD83E\uDD5F", name: "\uC218\uC81C\uBE44", reason: "\uBE57\uBC29\uC6B8 \uB5A8\uC5B4\uC9C0\uB294 \uC18C\uB9AC\uC640 \uD568\uAED8" },
        { emoji: "\uD83E\uDDC7", name: "\uBD80\uCE68\uAC1C", reason: "\uBC14\uC0AD\uBC14\uC0AD \uACE0\uC18C\uD558\uACE0 \uB530\uB73B\uD558\uAC8C" },
        { emoji: "\uD83C\uDF72", name: "\uB728\uAC70\uC6B4 \uAD6D", reason: "\uBE44 \uC624\uB294 \uB0A0\uC5D4 \uB728\uB73B\uD55C \uAD6D\uBB3C\uC774 \uCD5C\uACE0" },
      ],
    };
  }
  if (condition === "snow") {
    return {
      category: "\uB208 \uC624\uB294 \uB0A0 \uBA39\uC2B5\uB2C8\uB2E4",
      foods: [
        { emoji: "\uD83C\uDF1F", name: "\uBD95\uC5B4\uBE75", reason: "\uB208 \uC624\uB294 \uB0A0 \uAC70\uB9AC \uAC04\uC2DD" },
        { emoji: "\uD83C\uDF6A", name: "\uD638\uB5A1", reason: "\uB530\uB73B\uD558\uACE0 \uB2EC\uCF64\uD55C \uACA8\uC6B8 \uAC04\uC2DD" },
        { emoji: "\uD83E\uDD62", name: "\uC5B4\uBB35", reason: "\uBF40\uB4DD\uBF40\uB4DD \uB530\uB73B\uD55C \uC5B4\uBB35\uAD6D\uBB3C" },
        { emoji: "\uD83C\uDF60", name: "\uAD70\uACE0\uAD6C\uB9C8", reason: "\uD638\uD638 \uBD88\uBA74\uC11C \uBA39\uB294 \uB9DB" },
        { emoji: "\u2615", name: "\uD56B\uCD08\uCF54", reason: "\uB208 \uAD6C\uACBD\uD558\uBA70 \uD55C \uC794" },
      ],
    };
  }
  if (temp >= 28) {
    return {
      category: "\uB354\uC6B4 \uB0A0 \uC2DC\uC6D0\uD558\uAC8C",
      foods: [
        { emoji: "\uD83C\uDF5C", name: "\uB0C9\uBA74", reason: "\uC2DC\uC6D0\uD55C \uC721\uC218\uB85C \uB354\uC704 \uD0C8\uCD9C" },
        { emoji: "\uD83E\uDD63", name: "\uCF69\uAD6D\uC218", reason: "\uACE0\uC18C\uD558\uACE0 \uB2F4\uBC31\uD55C \uC5EC\uB984 \uBCF4\uC591\uC2DD" },
        { emoji: "\uD83D\uDC1F", name: "\uBB3C\uD68C", reason: "\uC2E0\uC120\uD55C \uD574\uC0B0\uBB3C\uB85C \uC2DC\uC6D0\uD558\uAC8C" },
        { emoji: "\uD83E\uDD57", name: "\uC0D0\uB7EC\uB4DC", reason: "\uAC00\uBCBC\uC6B4 \uD55C \uB07C\uB85C \uB354\uC704 \uB9C9\uAE30" },
        { emoji: "\uD83C\uDF49", name: "\uC218\uBC15\uC8FC\uC2A4", reason: "\uB2EC\uCF64\uD558\uACE0 \uC2DC\uC6D0\uD55C \uC5EC\uB984 \uC74C\uB8CC" },
      ],
    };
  }
  if (temp >= 20) {
    return {
      category: "\uB530\uB73B\uD55C \uB0A0 \uB9DB\uC788\uAC8C",
      foods: [
        { emoji: "\uD83C\uDF57", name: "\uCE58\uD0A8", reason: "\uCE58\uB9E5! \uC57C\uC678\uC5D0\uC11C \uBA39\uAE30 \uB531 \uC88B\uC740 \uB0A0" },
        { emoji: "\uD83C\uDF55", name: "\uD53C\uC790", reason: "\uC591\uD638\uD55C \uB0A0\uC528\uC5D0 \uBC30\uB2EC \uC2DC\uCF1C\uBCFC\uAE4C\uC694" },
        { emoji: "\uD83E\uDD69", name: "\uC0BC\uACA9\uC0B4", reason: "\uBC14\uBE54 \uD30C\uD2F0\uD558\uAE30 \uC88B\uC740 \uB0A0\uC528" },
        { emoji: "\uD83C\uDF5D", name: "\uD30C\uC2A4\uD0C0", reason: "\uC0C1\uCF8C\uD55C \uB0A0\uC528\uC5D0 \uAC00\uBCBC\uC6B4 \uC2DD\uC0AC" },
        { emoji: "\uD83C\uDF36\uFE0F", name: "\uB5A1\uBCF6\uC774", reason: "\uC0B0\uCC45 \uD6C4 \uAC04\uC2DD\uC73C\uB85C \uB531!" },
      ],
    };
  }
  if (temp >= 12) {
    return {
      category: "\uC4C0\uC4C0\uD55C \uB0A0 \uB530\uB73B\uD558\uAC8C",
      foods: [
        { emoji: "\uD83C\uDF72", name: "\uBD80\uB300\uCC0C\uAC1C", reason: "\uC5BC\uD070\uD55C \uB0A0 \uC5BC\uD070\uD55C \uCC0C\uAC1C" },
        { emoji: "\uD83E\uDD58", name: "\uAE40\uCE58\uCC0C\uAC1C", reason: "\uD55C\uAD6D\uC778\uC758 \uC18C\uC6B8 \uD478\uB4DC" },
        { emoji: "\uD83C\uDF5C", name: "\uC6B0\uB3D9", reason: "\uB530\uB73B\uD55C \uAD6D\uBB3C\uC774 \uBAB8\uC744 \uB179\uC5EC\uC900\uB2E4" },
        { emoji: "\uD83C\uDF5C", name: "\uB77C\uBA74", reason: "\uAC04\uD3B8\uD558\uACE0 \uB530\uB73B\uD55C \uD55C \uB07C" },
        { emoji: "\uD83C\uDF5C", name: "\uCE7C\uAD6D\uC218", reason: "\uC190 \uBC18\uC8FD \uD558\uB098\uBA74 \uBD84\uC704\uAE30 \uAC11" },
      ],
    };
  }
  return {
    category: "\uCD94\uC6B4 \uB0A0 \uB728\uAC81\uAC8C",
    foods: [
      { emoji: "\uD83E\uDD62", name: "\uBF08\uD574\uC7A5\uAD6D", reason: "\uCD94\uC6B4 \uB0A0 \uBF08 \uB179\uC740 \uAD6D\uBB3C\uC774 \uCD5C\uACE0" },
      { emoji: "\uD83C\uDF72", name: "\uC21C\uB450\uBD80", reason: "\uBCF4\uAE00\uBCF4\uAE00 \uB728\uAC70\uC6B4 \uC21C\uB450\uBD80\uCC0C\uAC1C" },
      { emoji: "\uD83E\uDD63", name: "\uC124\uB801\uD0D5", reason: "\uB728\uAC81\uD55C \uAD6D\uBB3C\uC774 \uBAB8\uC744 \uD480\uC5B4\uC904 \uB0A0" },
      { emoji: "\uD83E\uDD5F", name: "\uB5A1\uAD6D", reason: "\uACA8\uC6B8 \uBCF4\uC591\uC2DD \uB300\uD45C" },
      { emoji: "\uD83E\uDD62", name: "\uC5B4\uBB35\uD0D5", reason: "\uBF40\uB4DD\uBF40\uB4DD \uC5B4\uBB35\uC73C\uB85C \uBCF4\uC628 \uD655\uBCF4" },
    ],
  };
}

// Deterministic shuffle: same date = same result
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

export default function FoodPage() {
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
  const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

  const foodData = weather ? getFoodsByWeather(weather.temp, weather.condition) : null;
  const shuffled = foodData ? deterministicShuffle(foodData.foods, dateSeed) : [];
  const top3 = shuffled.slice(0, 3);

  async function handleShare() {
    if (!weather || top3.length === 0) return;
    const condText = weather.condition === "rain" ? "\uBE44 \uC624\uB294 \uB0A0\uC5D0\uB294" : weather.condition === "snow" ? "\uB208 \uC624\uB294 \uB0A0\uC5D0\uB294" : `${weather.temp}\u00B0C \uB0A0\uC528\uC5D4`;
    const text = `${condText} ${top3[0].name}! ${top3[0].emoji}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "\uC624\uB298 \uBB50 \uBA39\uC9C0?", text });
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
        <h1 className="text-2xl font-black text-[#F97316]">{"\uD83C\uDF5C \uC624\uB298 \uBB50 \uBA39\uC9C0?"}</h1>
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

      {/* Food Recommendations */}
      {foodData && mounted && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="w-full space-y-4"
        >
          {/* Category Label */}
          <motion.div variants={itemVariants} className="text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#F97316] text-white text-sm font-bold">
              {foodData.category}
            </span>
          </motion.div>

          {/* Top 3 */}
          <motion.div variants={itemVariants}>
            <p className="text-sm font-bold text-gray-700 mb-3">{"\u2B50 \uC624\uB298\uC758 \uCD94\uCC9C TOP 3"}</p>
            <div className="space-y-3">
              {top3.map((food, idx) => (
                <div
                  key={food.name}
                  className="flex items-center gap-4 rounded-xl bg-white border-2 border-orange-200 shadow-sm p-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center text-2xl">
                    {food.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#F97316]">#{idx + 1}</span>
                      <span className="font-bold text-gray-900">{food.name}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{food.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Remaining */}
          {shuffled.length > 3 && (
            <motion.div variants={itemVariants}>
              <p className="text-sm font-bold text-gray-700 mb-3">{"\uD83D\uDE0B \uC774\uAC83\uB3C4 \uC88B\uC544\uC694"}</p>
              <div className="grid grid-cols-2 gap-3">
                {shuffled.slice(3).map((food) => (
                  <div
                    key={food.name}
                    className="rounded-xl bg-white border border-gray-100 shadow-sm p-3 text-center"
                  >
                    <span className="text-2xl block mb-1">{food.emoji}</span>
                    <span className="text-sm font-bold text-gray-800">{food.name}</span>
                    <p className="text-[10px] text-gray-400 mt-0.5">{food.reason}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <motion.div variants={itemVariants} className="flex flex-col gap-3 pt-2">
            <button
              onClick={handleShare}
              className="w-full px-6 py-2.5 rounded-xl bg-[#F97316] text-white font-bold text-sm shadow-md hover:bg-orange-600 transition-colors"
            >
              {"\uD83D\uDCE4 \uCD94\uCC9C \uACF5\uC720\uD558\uAE30"}
            </button>
            <Link
              href="/mwomuk"
              className="w-full px-6 py-2.5 rounded-xl border-2 border-[#F97316] text-[#F97316] font-bold text-sm text-center hover:bg-orange-50 transition-colors"
            >
              {"\uD83D\uDC65 \uCE5C\uAD6C\uC640 \uD568\uAED8 \uACE0\uB974\uAE30 \u2192"}
            </Link>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
