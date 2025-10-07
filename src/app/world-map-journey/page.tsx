"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Globe,
  Trophy,
  CheckCircle,
  XCircle,
  Info,
  Award,
  MapPin,
  Plus,
  Minus,
  RotateCcw
} from "lucide-react";

type JourneyCountry = {
  id: number;
  name: string;
  flag: string;
  year: string;
  question: string;
  options: string[];
  correctAnswer: string;
  detail: string;
  references?: string[];
};

// Map country name to SVG <g id> code in world-map-full-new.svg
const countryToSvgId: Record<string, string> = {
  Vietnam: "VN",
  France: "FR",
  "United Kingdom": "GB",
  "United States": "US",
  Algeria: "DZ",
  Tunisia: "TN",
  Belgium: "BE",
  Italy: "IT",
  Germany: "DE",
  Russia: "RU",
  China: "CN",
  Thailand: "TH",
  India: "IN",
  Singapore: "SG",
  "Hong Kong": "HK",
  Burma: "MM",
  Malaysia: "MY",
  Indonesia: "ID",
  Philippines: "PH",
  Laos: "LA",
  Cambodia: "KH",
  Switzerland: "CH",
  Austria: "AT",
  Poland: "PL",
  Morocco: "MA",
  Spain: "ES",
  Netherlands: "NL",
  Denmark: "DK",
  Sweden: "SE",
  Norway: "NO"
};

export default function WorldMapJourneyPage() {
  const [countries, setCountries] = useState<JourneyCountry[]>([]);
  const [selected, setSelected] = useState<JourneyCountry | null>(null);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [answers, setAnswers] = useState<Record<string, "correct" | "wrong">>({});
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [done, setDone] = useState(false);
  const [svgLoaded, setSvgLoaded] = useState(false);
  const svgRef = useRef<HTMLObjectElement>(null);

  // Pan/zoom state
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    fetch("/data/journey-countries.json")
      .then((r) => r.json())
      .then((d: JourneyCountry[]) => setCountries(d))
      .catch((e) => console.error("Load journey data failed", e));
  }, []);

  const totalAnswered = useMemo(() => Object.keys(answers).length, [answers]);
  const progress = useMemo(() => {
    return countries.length ? Math.round((totalAnswered / countries.length) * 100) : 0;
  }, [countries.length, totalAnswered]);

  const colorCountry = (countryName: string, color: string) => {
    const svgDoc = svgRef.current?.contentDocument;
    if (!svgDoc) return;
    const svgId = countryToSvgId[countryName];
    if (!svgId) return;
    const group = svgDoc.getElementById(svgId);
    if (!group) return;
    const paths = group.querySelectorAll("path");
    paths.forEach((p) => {
      const el = p as SVGPathElement;
      el.style.fill = color;
      el.style.filter = "none";
      el.style.stroke = "#ffffff";
      el.style.strokeWidth = "2";
    });
  };

  // Setup SVG interactions after load
  useEffect(() => {
    const handleLoad = () => {
      const svgDoc = svgRef.current?.contentDocument;
      if (!svgDoc) return;
      setSvgLoaded(true);

      const groups = svgDoc.querySelectorAll("g[id]");
      groups.forEach((g) => {
        const svgId = (g as SVGGElement).id;
        // find target country
        const country = countries.find((c) => countryToSvgId[c.name] === svgId);
        const paths = (g as SVGGElement).querySelectorAll("path");
        paths.forEach((p) => {
          const el = p as SVGPathElement;
          el.classList.add("country");
          el.style.cursor = country ? "pointer" : "default";
          el.style.transition = "all .2s ease";
          if (!country) {
            el.style.fill = "#e5e7eb"; // others gray
            el.style.stroke = "#ffffff";
            el.style.strokeWidth = "0.5";
          } else {
            const key = country.name.toLowerCase().replace(/\s+/g, "");
            const status = answers[key];
            el.style.stroke = "#ff6b00";
            el.style.strokeWidth = "2";
            el.style.fill = status === "correct" ? "#10b981" : status === "wrong" ? "#ef4444" : "#ffd700";
            el.addEventListener("click", () => handleCountryClick(country.name));
            el.addEventListener("mouseenter", () => {
              if (!answers[key]) {
                el.style.fill = "#ffcc00";
              }
            });
            el.addEventListener("mouseleave", () => {
              const s = answers[key];
              el.style.fill = s === "correct" ? "#10b981" : s === "wrong" ? "#ef4444" : "#ffd700";
            });
          }
        });
      });
    };

    if (svgRef.current && countries.length) {
      svgRef.current.addEventListener("load", handleLoad);
      if (svgRef.current.contentDocument) handleLoad();
    }
    return () => {
      if (svgRef.current) svgRef.current.removeEventListener("load", handleLoad);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countries, answers]);

  const handleCountryClick = (name: string) => {
    const c = countries.find((x) => x.name === name);
    if (!c) return;
    const key = name.toLowerCase().replace(/\s+/g, "");
    if (answers[key]) return; // already answered
    setSelected(c);
    setResult(null);
  };

  const handleAnswer = (opt: string) => {
    if (!selected) return;
    const isCorrect = opt === selected.correctAnswer;
    const key = selected.name.toLowerCase().replace(/\s+/g, "");
    setAnswers((prev) => ({ ...prev, [key]: isCorrect ? "correct" : "wrong" }));
    setResult(isCorrect ? "correct" : "wrong");
    if (isCorrect) {
      setScore((s) => ({ ...s, correct: s.correct + 1 }));
      colorCountry(selected.name, "#10b981");
    } else {
      setScore((s) => ({ ...s, wrong: s.wrong + 1 }));
      colorCountry(selected.name, "#ef4444");
    }
    const answeredCount = Object.keys(answers).length + 1;
    if (answeredCount === countries.length) {
      setTimeout(() => setDone(true), 500);
    }
  };

  // Pan/zoom handlers
  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (dragging) setPan({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
  };
  const onMouseUp = () => setDragging(false);
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((z) => Math.min(Math.max(z * factor, 0.5), 3));
  };
  const resetView = () => {
    setPan({ x: 0, y: 0 });
    setZoom(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 rounded-3xl shadow-2xl mb-6">
            <Globe className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-2">
            Giải mã Hành Trình Cứu Nước (1911–1941)
          </h1>
          <p className="text-gray-300">Chọn các quốc gia Bác Hồ đã đi qua, trả lời câu hỏi và khám phá chi tiết lịch sử.</p>
          <div className="flex justify-center gap-3 mt-4">
            <Badge className="bg-gradient-to-r from-red-600 to-orange-600 text-white">30 năm tìm đường cứu nước</Badge>
          </div>
        </div>

        <Card className="max-w-5xl mx-auto mb-6 border-2 border-purple-300 bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
            <CardTitle className="flex items-center justify-between">
              <span className="text-xl font-bold text-gray-800">Tiến độ</span>
              <Badge className="bg-gradient-to-r from-red-600 to-orange-600 text-white text-lg px-4">
                {score.correct} đúng • {score.wrong} sai • {totalAnswered}/{countries.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              <Progress value={progress} className="h-4 bg-gray-100" />
              <div className="flex items-center gap-4 text-sm text-gray-700">
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-600" /> Đúng: {score.correct}</div>
                <div className="flex items-center gap-2"><XCircle className="w-4 h-4 text-red-600" /> Sai: {score.wrong}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full mx-auto border-2 border-purple-300 bg-white/95 backdrop-blur-sm shadow-2xl overflow-hidden">
          <CardContent className="p-1">
            <div
              className="relative w-full bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg overflow-hidden"
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              onWheel={onWheel}
              style={{ height: "90vh", minHeight: "820px", cursor: dragging ? "grabbing" : "grab" }}
            >
              {!svgLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10 rounded-lg">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-gray-600">Đang tải bản đồ thế giới…</p>
                  </div>
                </div>
              )}

              <object
                ref={svgRef}
                data="/world-map-full.svg"
                type="image/svg+xml"
                className="w-full h-full rounded-lg"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  minWidth: "1500px",
                  minHeight: "800px",
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transformOrigin: "center center",
                  transition: dragging ? "none" : "transform 0.1s ease-out"
                }}
                aria-label="Interactive World Map"
              />

              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur rounded-2xl p-4 shadow-xl border-2 border-purple-200 max-w-xs z-20">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg"><Info className="w-5 h-5 text-purple-600" /></div>
                  <div>
                    <p className="font-semibold text-gray-800 mb-1">Hướng dẫn</p>
                    <p className="text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-red-600 inline mr-1" /> Chọn quốc gia (màu vàng) để trả lời câu hỏi
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Kéo để di chuyển • Cuộn để phóng to/thu nhỏ • Reset để mặc định</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-20">
                <Button onClick={() => setZoom((z) => Math.min(z * 1.2, 3))} size="sm" variant="outline" className="bg-white/90"> <Plus className="w-4 h-4" /> </Button>
                <Button onClick={() => setZoom((z) => Math.max(z / 1.2, 0.5))} size="sm" variant="outline" className="bg-white/90"> <Minus className="w-4 h-4" /> </Button>
                <Button onClick={resetView} size="sm" variant="outline" className="bg-white/90"> <RotateCcw className="w-4 h-4" /> </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="max-w-6xl mx-auto mt-8 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-red-200">
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-3"><div className="w-10 h-8 bg-[#e0e0e0] border-2 border-gray-400 rounded-lg"></div><span className="text-sm text-gray-700">Quốc gia khác</span></div>
            <div className="flex items-center gap-3"><div className="w-10 h-8 bg-[#ffd700] border-2 border-[#ff6b00] rounded-lg"></div><span className="text-sm text-gray-700">Mục tiêu (chưa trả lời)</span></div>
            <div className="flex items-center gap-3"><div className="w-10 h-8 bg-[#10b981] border-2 border-[#00cc66] rounded-lg"></div><span className="text-sm text-gray-700">Trả lời đúng</span></div>
            <div className="flex items-center gap-3"><div className="w-10 h-8 bg-[#ef4444] border-2 border-[#dc2626] rounded-lg"></div><span className="text-sm text-gray-700">Trả lời sai</span></div>
          </div>
        </div>

        {selected && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl">
              <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6 rounded-t-3xl">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <span className="text-4xl">{selected.flag}</span>
                  <span>{selected.name}</span>
                  <span className="text-sm opacity-90">{selected.year}</span>
                </h2>
              </div>
              <div className="p-6">
                <p className="text-lg font-semibold text-gray-800 mb-4">{selected.question}</p>
                <div className="grid gap-3">
                  {selected.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(opt)}
                      disabled={result !== null}
                      className={`py-3 px-4 rounded-xl text-left font-medium transition-all ${
                        result === null
                          ? "bg-blue-500 hover:bg-blue-600 text-white"
                          : result === "correct" && opt === selected.correctAnswer
                          ? "bg-green-500 text-white"
                          : result === "wrong" && opt === selected.correctAnswer
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{opt}</span>
                        {result !== null && opt === selected.correctAnswer && <CheckCircle className="w-5 h-5" />}
                      </div>
                    </button>
                  ))}
                </div>

                {result && (
                  <div className={`mt-5 p-4 rounded-xl flex items-start gap-3 ${
                    result === "correct" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {result === "correct" ? <CheckCircle className="w-5 h-5 mt-1" /> : <XCircle className="w-5 h-5 mt-1" />}
                    <div>
                      <p className="font-semibold mb-2">{result === "correct" ? "Chính xác!" : "Chưa đúng. Đáp án đúng:"} {result === "wrong" && <span className="underline">{selected.correctAnswer}</span>}</p>
                      <p className="text-sm leading-relaxed text-gray-800">{selected.detail}</p>
                      {selected.references?.length ? (
                        <ul className="list-disc pl-5 mt-2 text-sm text-gray-700">
                          {selected.references.map((ref, idx) => (
                            <li key={idx}><span className="break-all">{ref}</span></li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-end gap-3">
                  <Button variant="outline" onClick={() => { setSelected(null); setResult(null); }}>Đóng</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {done && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg text-center p-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-5">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 mb-2">Hoàn thành!</h3>
              <p className="text-gray-700 mb-5">Bạn đã trả lời {score.correct} đúng, {score.wrong} sai.</p>
              <Button onClick={() => window.location.reload()} className="bg-gradient-to-r from-red-600 to-orange-600 text-white">Chơi lại</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


