"use client";

import React, { useState, useRef } from "react";
import { Open_Sans, Roboto_Condensed } from "next/font/google"; // Font loading

// Components
import { IntrapartumForm } from "@/components/IntrapartumForm";
import { ManipalForm } from "@/components/ManipalForm";
import { IntrapartumModel } from "@/models/IntrapartumModel";
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
  const [selectedModel, setSelectedModel] = useState("intrapartum");
  const [result, setResult] = useState<number | null>(null);

  // Intrapartum Model Form Values
  const [maternalAge, setMaternalAge] = useState(30);
  const [maternalBmi, setMaternalBmi] = useState(25.0);
  const [gestation, setGestation] = useState(40);
  const [prolongedLabor, setProlongedLabor] = useState(false);

  const [occiputDir, setOcciputDir] = useState("Left");
  const [occiputOrient, setOcciputOrient] = useState("Anterior");

  const [dilation, setDilation] = useState(0.0);
  const [headDistance, setHeadDistance] = useState(40);
  const [caput, setCaput] = useState(10);

  // Manipal Model Form Values
  const [maniAgeMaternal, setManiAgeMaternal] = useState(28);
  const [maniHeadPerineumDistance, setManiHeadPerineumDistance] = useState(42);
  const [maniAngleOfProgression, setManiAngleOfProgression] = useState(110);
  const [maniCaput, setManiCaput] = useState(10);
  const [maniPositionDir, setManiPositionDir] = useState("Left");
  const [maniPositionOrient, setManiPositionOrient] = useState("Posterior");
  const [maniProlongedLabor, setManiProlongedLabor] = useState(false);

  const topRef = useRef<HTMLDivElement>(null);

  // --- Handlers ---

  const handleCalculate = () => {
    if (selectedModel === "intrapartum") {
      // Format Occiput: Left + Anterior -> LOA
      const formattedOcciput =
        `${occiputDir[0]}O${occiputOrient[0]}`.toUpperCase();

      const prob = IntrapartumModel.predictRisk({
        gestationWeeks: gestation,
        cervicalDilationCm: dilation,
        caputSuccedaneumMm: caput,
        headPerineumDistanceMm: headDistance,
        occiputPosition: formattedOcciput,
        maternalAgeYears: maternalAge,
        maternalBmi: maternalBmi,
        prolongedLabor: prolongedLabor,
      });

      setResult(prob);
    } else if (selectedModel === "manipal") {
      // Format Position: Left + Posterior -> LOP (same as Intrapartum)
      const formattedPosition =
        `${maniPositionDir[0]}O${maniPositionOrient[0]}`.toUpperCase();

      // Check if position is ROP or LOP
      const binaryPosition =
        formattedPosition === "ROP" || formattedPosition === "LOP" ? 1 : 0;

      // Caput is binary: 1 if >= 10mm, 0 otherwise
      const caputBinary = maniCaput >= 10 ? 1 : 0;

      const prob = ManipalModel.predictRisk({
        maternalAgeYears: maniAgeMaternal,
        headPerineumDistanceCm: maniHeadPerineumDistance / 10, // Convert mm to cm
        angleOfProgressionDegrees: maniAngleOfProgression,
        isCaput: caputBinary,
        binaryPosition: binaryPosition,
        hasProlongedLabor: maniProlongedLabor,
      });

      setResult(prob);
    }

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
    <main className={`min-h-screen bg-[#FFF9F9] ${openSans.className} pb-20`}>
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#FFF9F9]/90 backdrop-blur-sm px-6 py-4 shadow-sm">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h1
              className={`${openSansCondensed.className} text-3xl font-bold text-[#1D1936]`}
            >
              INTRAPARTUM
            </h1>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="h-10 rounded border-2 border-black bg-white px-3 font-bold text-sm text-[#1D1936] uppercase transition-colors hover:bg-[#F7E7EF]"
            >
              <option value="intrapartum">Intrapartum Model</option>
              <option value="manipal">Manipal Model</option>
            </select>
          </div>
        </div>
      </header>

      <div ref={topRef} className="mx-auto max-w-3xl px-5 pt-6">
        <h2 className="mb-6 text-xl font-semibold uppercase tracking-wide text-[#09000A]">
          Single Assessment
        </h2>

        {selectedModel === "intrapartum" && (
          <IntrapartumForm
            result={result}
            maternalAge={maternalAge}
            setMaternalAge={setMaternalAge}
            maternalBmi={maternalBmi}
            setMaternalBmi={setMaternalBmi}
            gestation={gestation}
            setGestation={setGestation}
            prolongedLabor={prolongedLabor}
            setProlongedLabor={setProlongedLabor}
            occiputDir={occiputDir}
            setOcciputDir={setOcciputDir}
            occiputOrient={occiputOrient}
            setOcciputOrient={setOcciputOrient}
            dilation={dilation}
            setDilation={setDilation}
            headDistance={headDistance}
            setHeadDistance={setHeadDistance}
            caput={caput}
            setCaput={setCaput}
            onCalculate={handleCalculate}
            onClear={handleClear}
          />
        )}

        {selectedModel === "manipal" && (
          <ManipalForm
            result={result}
            maternalAge={maniAgeMaternal}
            setMaternalAge={setManiAgeMaternal}
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
        )}
      </div>
    </main>
  );
}
