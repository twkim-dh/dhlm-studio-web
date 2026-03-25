"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getSeasonalWeather, CITIES, type City, type WeatherData } from "@/lib/weather";

interface OutfitRec {
  items: string[];
  style: string;
  tip: string;
}

function getOutfitByTemp(temp: number): OutfitRec {
  if (temp >= 28) {
    return {
      items: ["\uD83D\uDC55 \uBC18\uD314", "\uD83E\uDE73 \uBC18\uBC14\uC9C0", "\uD83E\uDE74 \uC0CC\uB4E4", "\uD83E\uDDD4 \uC36C\uD06C\uB9BC"],
      style: "\uC2DC\uC6D0\uD558\uACE0 \uD1B5\uD48D \uC88B\uC740 \uC637\uCC28\uB9BC",
      tip: "\uC790\uC678\uC120 \uCC28\uB2E8 \uD544\uC218! \uC120\uAE00\uB77C\uC2A4 + \uBAA8\uC790 \uCD94\uCC9C",
    };
  }
  if (temp >= 23) {
    return {
      items: ["\uD83D\uDC55 \uBC18\uD314 \uC154\uCE20", "\uD83D\uDC56 \uBA74\uBC14\uC9C0", "\uD83D\uDC5F \uC2A4\uB2C8\uCEE4\uC988"],
      style: "\uAC00\uBCBC\uC6B4 \uCE90\uC8FC\uC5BC \uC637\uCC28\uB9BC",
      tip: "\uC544\uCE68\uC800\uB141 \uAE30\uC628\uCC28 \uB300\uBE44 \uC587\uC740 \uAC78\uCE58\uAE30 \uD558\uB098",
    };
  }
  if (temp >= 17) {
    return {
      items: ["\uD83E\uDDE5 \uAC00\uB514\uAC74/\uC790\uCF13", "\uD83D\uDC55 \uAE34\uD314", "\uD83D\uDC56 \uCCAD\uBC14\uC9C0", "\uD83D\uDC5F \uC2A4\uB2C8\uCEE4\uC988"],
      style: "\uAC04\uC808\uAE30 \uB808\uC774\uC5B4\uB4DC \uC637\uCC28\uB9BC",
      tip: "\uC544\uCE68\uC5D4 \uC4C0\uC4C0\uD558\uB2C8 \uAC00\uB514\uAC74 \uCC59\uAE30\uC138\uC694",
    };
  }
  if (temp >= 12) {
    return {
      items: ["\uD83E\uDDE5 \uCF54\uD2B8", "\uD83E\uDDE3 \uB2C8\uD2B8", "\uD83D\uDC56 \uAE34\uBC14\uC9C0", "\uD83E\uDD7E \uBD80\uCE20"],
      style: "\uB530\uB73B\uD55C \uB808\uC774\uC5B4\uB4DC \uC637\uCC28\uB9BC",
      tip: "\uBAA9\uB3C4\uB9AC\uB098 \uC2A4\uCE74\uD504\uB97C \uD3EC\uC778\uD2B8\uB85C!",
    };
  }
  if (temp >= 5) {
    return {
      items: ["\uD83E\uDDE5 \uD328\uB529/\uCF54\uD2B8", "\uD83E\uDDE3 \uAE30\uBAA8 \uC637", "\uD83E\uDDE3 \uBAA9\uB3C4\uB9AC", "\uD83E\uDDE4 \uC7A5\uAC11"],
      style: "\uBCF4\uC628 \uC911\uC2EC \uACA8\uC6B8 \uC637\uCC28\uB9BC",
      tip: "\uD788\uD2B8\uD14D \uC774\uB108 \uD544\uC218!",
    };
  }
  return {
    items: ["\uD83E\uDDE5 \uB871\uD328\uB529", "\uD83D\uDC55 \uD788\uD2B8\uD14D", "\uD83E\uDD7E \uBC29\uD55C\uBD80\uCE20", "\uD83C\uDFA7 \uADC0\uB9C8\uAC1C"],
    style: "\uCD5C\uAC15 \uBC29\uD55C \uC637\uCC28\uB9BC",
    tip: "\uD53C\uBD80 \uB178\uCD9C \uCD5C\uC18C\uD654! \uBAA8\uC790 + \uBAA9\uB3C4\uB9AC + \uC7A5\uAC11",
  };
}

function getConditionTip(condition: string, dust: boolean): string | null {
  const tips: string[] = [];
  if (condition === "rain") tips.push("\u2602\uFE0F \uC6B0\uC0B0 \uD544\uC218! \uBC29\uC218 \uC2E0\uBC1C \uCD94\uCC9C");
  if (condition === "snow") tips.push("\u2744\uFE0F \uBC29\uD55C\uBD80\uCE20 + \uBAA9\uB3C4\uB9AC");
  if (dust) tips.push("\uD83D\uDE37 \uB9C8\uC2A4\uD06C \uCC29\uC6A9");
  if (condition === "humid") tips.push("\uD83D\uDCA8 \uD1B5\uD48D \uC88B\uC740 \uC18C\uC7AC \uCD94\uCC9C");
  if (condition === "windy") tips.push("\uD83C\uDF2C\uFE0F \uBC14\uB78C\uB9C9\uC774 \uC544\uC774\uD15C \uCD94\uCC9C");
  return tips.length > 0 ? tips.join(" / ") : null;
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

export default function OutfitPage() {
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

  const outfit = weather ? getOutfitByTemp(weather.temp) : null;
  const conditionTip = weather ? getConditionTip(weather.condition, weather.dust) : null;

  async function handleShare() {
    if (!weather || !outfit) return;
    const text = `\uC624\uB298 ${city} ${weather.temp}\u00B0C ${weather.icon} \u2192 ${outfit.items.map(i => i.split(" ")[1]).join("+")} \uCD94\uCC9C!`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "\uC624\uB298 \uBB50 \uC785\uC9C0?", text });
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
        <h1 className="text-2xl font-black text-[#F97316]">{"\uD83D\uDC55 \uC624\uB298 \uBB50 \uC785\uC9C0?"}</h1>
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

      {/* Outfit Recommendation */}
      {outfit && mounted && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="w-full space-y-4"
        >
          {/* Style Label */}
          <motion.div variants={itemVariants} className="text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#F97316] text-white text-sm font-bold">
              {outfit.style}
            </span>
          </motion.div>

          {/* Clothing Items */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
            {outfit.items.map((item) => (
              <div
                key={item}
                className="rounded-xl bg-white border border-gray-100 shadow-sm p-4 text-center"
              >
                <span className="text-3xl block mb-2">{item.split(" ")[0]}</span>
                <span className="text-sm font-bold text-gray-800">{item.split(" ").slice(1).join(" ")}</span>
              </div>
            ))}
          </motion.div>

          {/* Tip */}
          <motion.div
            variants={itemVariants}
            className="rounded-xl bg-orange-50 border border-orange-100 p-4"
          >
            <p className="text-sm font-medium text-gray-700">
              {"\uD83D\uDCA1"} {outfit.tip}
            </p>
          </motion.div>

          {/* Condition-based extra tip */}
          {conditionTip && (
            <motion.div
              variants={itemVariants}
              className="rounded-xl bg-amber-50 border border-amber-200 p-4"
            >
              <p className="text-sm font-medium text-gray-700">{conditionTip}</p>
            </motion.div>
          )}

          {/* Share */}
          <motion.div variants={itemVariants} className="flex justify-center pt-2">
            <button
              onClick={handleShare}
              className="px-6 py-2.5 rounded-xl bg-[#F97316] text-white font-bold text-sm shadow-md hover:bg-orange-600 transition-colors"
            >
              {"\uD83D\uDCE4 \uCD94\uCC9C \uACF5\uC720\uD558\uAE30"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
