"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Open_Sans, Roboto_Condensed } from "next/font/google"; // Font loading

// Components
import { NumericInput } from "@/components/NumericInput";
import { FormLabel } from "@/components/FormLabel";
import { Processing } from "@/lib/processing";

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

  // Form Values
  const [maternalAge, setMaternalAge] = useState(30);
  const [maternalBmi, setMaternalBmi] = useState(25.0);
  const [gestation, setGestation] = useState(40);
  const [prolongedLabor, setProlongedLabor] = useState(false);

  const [occiputDir, setOcciputDir] = useState("Left");
  const [occiputOrient, setOcciputOrient] = useState("Anterior");

  const [dilation, setDilation] = useState(0.0);
  const [headDistance, setHeadDistance] = useState(40);
  const [caput, setCaput] = useState(10);

  const topRef = useRef<HTMLDivElement>(null);

  // --- Handlers ---

  const handleCalculate = () => {
    // Format Occiput: Left + Anterior -> LOA
    const formattedOcciput =
      `${occiputDir[0]}O${occiputOrient[0]}`.toUpperCase();

    const prob = Processing.predictRisk({
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
          <h1
            className={`${openSansCondensed.className} text-3xl font-bold text-[#1D1936]`}
          >
            INTRAPARTUM
          </h1>
        </div>
      </header>

      <div ref={topRef} className="mx-auto max-w-3xl px-5 pt-6">
        <h2 className="mb-6 text-xl font-semibold uppercase tracking-wide text-[#09000A]">
          Single Assessment
        </h2>

        {/* Results Section (Animated) */}
        <AnimatePresence>
          {result !== null && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mb-8 flex flex-col items-center justify-center rounded-2xl bg-white p-8 shadow-md ring-1 ring-black/5">
                {/* Progress Bar Visual */}
                <div className="relative mb-6 h-4 w-full max-w-xs overflow-hidden rounded-full bg-gray-200">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-[#B8AAFF]"
                  />
                </div>

                <div className="text-center">
                  <span
                    className={`${openSansCondensed.className} text-6xl font-bold text-[#1D1936]`}
                  >
                    {result.toFixed(2)}
                  </span>
                  <span
                    className={`${openSansCondensed.className} text-4xl font-bold text-[#1D1936]`}
                  >
                    %
                  </span>
                  <p
                    className={`${openSansCondensed.className} mt-2 text-sm font-semibold uppercase tracking-wider text-[#1D1936]`}
                  >
                    Probability of Vaginal Birth
                  </p>
                  <p
                    className={`${openSansCondensed.className} mt-4 text-3xl font-bold uppercase text-[#1D1936]`}
                  >
                    {Processing.getRiskLabel(result)}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Container */}
        <div className="rounded-xl border-2 border-black bg-[#F7E7EF] p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {/* Grid for Desktop / Flex col for Mobile */}
          <div className="grid grid-cols-1 gap-x-8 gap-y-2 md:grid-cols-2">
            {/* Column 1 */}
            <div>
              <FormLabel
                label="Maternal Age"
                unit="years"
                info={["Age of mother at time of labor."]}
              />
              <NumericInput
                value={maternalAge}
                onChange={setMaternalAge}
                min={10}
                max={55}
              />

              <FormLabel
                label="Maternal BMI"
                info={["Weight (kg) / Height (m)²"]}
              />
              <NumericInput
                value={maternalBmi}
                onChange={setMaternalBmi}
                min={17}
                max={40}
                isInteger={false}
              />

              <FormLabel
                label="Gestation"
                unit="weeks"
                info={["Length of pregnancy."]}
              />
              <NumericInput
                value={gestation}
                onChange={setGestation}
                min={30}
                max={45}
              />
            </div>

            {/* Column 2 */}
            <div>
              <FormLabel
                label="Prolonged Labour"
                info={[
                  "Labor lasting longer than usual (>20h first-time, >14h others).",
                ]}
              />
              <div className="flex gap-4">
                {/* Yes/No Toggle Custom Buttons */}
                <button
                  onClick={() => setProlongedLabor(true)}
                  className={`flex-1 rounded border border-black py-2 text-lg font-bold uppercase transition-colors ${
                    prolongedLabor ? "bg-[#D0C8FF]" : "bg-white"
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => setProlongedLabor(false)}
                  className={`flex-1 rounded border border-black py-2 text-lg font-bold uppercase transition-colors ${
                    !prolongedLabor ? "bg-[#D0C8FF]" : "bg-white"
                  }`}
                >
                  No
                </button>
              </div>

              <FormLabel
                label="Occiput Position"
                info={[
                  "Position of baby's head.",
                  "Anterior (front), Posterior (back), Transverse (side).",
                ]}
              />
              <div className="flex gap-2">
                <select
                  className="h-12 flex-1 rounded border border-gray-300 bg-white px-2 font-bold text-[#1D1936]"
                  value={occiputDir}
                  onChange={(e) => setOcciputDir(e.target.value)}
                >
                  <option value="Left">LEFT</option>
                  <option value="Right">RIGHT</option>
                </select>
                <select
                  className="h-12 flex-[1.5] rounded border border-gray-300 bg-white px-2 font-bold text-[#1D1936]"
                  value={occiputOrient}
                  onChange={(e) => setOcciputOrient(e.target.value)}
                >
                  <option value="Anterior">ANTERIOR</option>
                  <option value="Posterior">POSTERIOR</option>
                  <option value="Transverse">TRANSVERSE</option>
                </select>
              </div>
            </div>
          </div>

          {/* Full Width Section below grid */}
          <div className="mt-2 grid grid-cols-1 gap-x-8 md:grid-cols-2">
            <div>
              <FormLabel
                label="Cervical Dilation"
                unit="cm"
                info={["Opening of cervix (Max 10cm)."]}
              />
              <NumericInput
                value={dilation}
                onChange={setDilation}
                min={0}
                max={10}
                isInteger={false}
              />
            </div>
            <div>
              <FormLabel
                label="Head Perineum Dist."
                unit="mm"
                info={["Distance between head and perineum."]}
              />
              <NumericInput
                value={headDistance}
                onChange={setHeadDistance}
                min={0}
                max={100}
              />
            </div>
          </div>

          <div className="md:w-1/2 md:pr-4">
            <FormLabel
              label="Caput Succedaneum"
              unit="mm"
              info={["Swelling on baby's head."]}
            />
            <NumericInput value={caput} onChange={setCaput} min={0} max={75} />
          </div>

          {/* Action Buttons */}
          <div className="mt-10 flex gap-4">
            <button
              onClick={handleClear}
              className="flex-1 rounded border border-black bg-white py-3 text-lg font-bold uppercase text-[#1D1936] transition-transform active:scale-95"
            >
              Clear
            </button>
            <button
              onClick={handleCalculate}
              className="flex-1 rounded border border-black bg-[#B8AAFF] py-3 text-lg font-bold uppercase text-[#1D1936] shadow-md transition-transform active:scale-95"
            >
              Calculate
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
