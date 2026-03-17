"use client";

import React, { useState, useRef } from "react";
import { Open_Sans, Roboto_Condensed } from "next/font/google"; // Font loading
import Image from "next/image";

// Components
import { ManipalForm } from "@/components/ManipalForm";
import { ManipalModel } from "@/models/ManipalModel";

// Font Configuration to match Flutter
const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});
const openSansCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["300", "700"],
});

export default function IntrapartumApp() {
  // --- State ---
  const [result, setResult] = useState<number | null>(null);

  // Manipal Model Form Values
  const [maniAgeMaternal, setManiAgeMaternal] = useState(28);
  const [maniMaternalBmi, setManiMaternalBmi] = useState(25.0);
  const [maniCervicalDilation, setManiCervicalDilation] = useState(5.0);
  const [maniGestationalAge, setManiGestationalAge] = useState(38);
  const [maniHeadPerineumDistance, setManiHeadPerineumDistance] = useState(42);
  const [maniAngleOfProgression, setManiAngleOfProgression] = useState(110);
  const [maniCaput, setManiCaput] = useState(10);
  const [maniPositionDir, setManiPositionDir] = useState("Left");
  const [maniPositionOrient, setManiPositionOrient] = useState("Posterior");
  const [maniProlongedLabor, setManiProlongedLabor] = useState(false);

  const topRef = useRef<HTMLDivElement>(null);

  // --- Handlers ---

  const handleCalculate = () => {
    // Format Position: Left + Posterior -> LOP
    const formattedPosition =
      `${maniPositionDir[0]}O${maniPositionOrient[0]}`.toUpperCase();

    // Check if position is ROP or LOP
    const binaryPosition =
      formattedPosition === "ROP" || formattedPosition === "LOP" ? 1 : 0;

    // Caput is binary: 1 if >= 10mm, 0 otherwise
    const caputBinary = maniCaput >= 10 ? 1 : 0;

    const prob = ManipalModel.predictRisk({
      maternalBmi: maniMaternalBmi,
      cervicalDilationCm: maniCervicalDilation,
      gestationalAgeWeeks: maniGestationalAge,
      maternalAgeYears: maniAgeMaternal,
      headPerineumDistanceCm: maniHeadPerineumDistance / 10, // Convert mm to cm
      angleOfProgressionDegrees: maniAngleOfProgression,
      isCaput: caputBinary,
      binaryPosition: binaryPosition,
      hasProlongedLabor: maniProlongedLabor ? 1 : 0,
    });

    setResult(prob);

    // Smooth scroll to top
    setTimeout(() => {
      topRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleClear = () => {
    setResult(null);
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main
      className={`min-h-screen flex flex-col bg-[#FFF9F9] ${openSans.className}`}
    >
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#FFF9F9]/90 backdrop-blur-sm px-6 py-4 shadow-sm">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h1
              className={`${openSansCondensed.className} text-3xl font-bold text-[#1D1936] mx-auto`}
            >
              INTRAPARTUM AI
            </h1>
          </div>
        </div>
      </header>

      <div ref={topRef} className="mx-auto max-w-3xl px-5 pt-6 flex-grow pb-12">
        <h2 className="mb-6 text-xl font-semibold uppercase tracking-wide text-[#09000A]">
          Single Assessment
        </h2>

        <ManipalForm
          result={result}
          maternalAge={maniAgeMaternal}
          setMaternalAge={setManiAgeMaternal}
          maternalBmi={maniMaternalBmi}
          setMaternalBmi={setManiMaternalBmi}
          cervicalDilation={maniCervicalDilation}
          setCervicalDilation={setManiCervicalDilation}
          gestationalAge={maniGestationalAge}
          setGestationalAge={setManiGestationalAge}
          headPerineumDistance={maniHeadPerineumDistance}
          setHeadPerineumDistance={setManiHeadPerineumDistance}
          angleOfProgression={maniAngleOfProgression}
          setAngleOfProgression={setManiAngleOfProgression}
          caput={maniCaput}
          setCaput={setManiCaput}
          positionDir={maniPositionDir}
          setPositionDir={setManiPositionDir}
          positionOrient={maniPositionOrient}
          setPositionOrient={setManiPositionOrient}
          prolongedLabor={maniProlongedLabor}
          setProlongedLabor={setManiProlongedLabor}
          onCalculate={handleCalculate}
          onClear={handleClear}
        />
      </div>

      {/* Footer */}
      <footer className="mt-auto pb-16 bg-transparent">
        <div className="mx-auto max-w-3xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm font-bold tracking-[0.2em] text-[#1D1936]/50 uppercase text-center">
            A Manipal Initiative
          </p>
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 opacity-90 transition-opacity hover:opacity-100"
            style={{
              backgroundColor: "#e6571a",
              maskImage: 'url("/Manipal_University_logo.png")',
              maskRepeat: "no-repeat",
              maskPosition: "center right",
              maskSize: "contain",
              WebkitMaskImage: 'url("/Manipal_University_logo.png")',
              WebkitMaskPosition: "center right",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskSize: "contain",
            }}
          />
        </div>
      </footer>
    </main>
  );
}
