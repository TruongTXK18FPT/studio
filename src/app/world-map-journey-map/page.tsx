"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Globe, CheckCircle, XCircle, Trophy } from "lucide-react";

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

type CountryCoords = Record<string, { lat: number; lng: number }>; // by name

// Minimal centroids for demo; extend as needed
const centroids: CountryCoords = {
  Vietnam: { lat: 16.0471, lng: 108.2068 },
  France: { lat: 48.8566, lng: 2.3522 },
  "United Kingdom": { lat: 51.5074, lng: -0.1278 },
  "United States": { lat: 38.9072, lng: -77.0369 },
  Algeria: { lat: 36.7538, lng: 3.0588 },
  Tunisia: { lat: 36.8065, lng: 10.1815 },
  Belgium: { lat: 50.8503, lng: 4.3517 },
  Italy: { lat: 41.9028, lng: 12.4964 },
  Germany: { lat: 52.52, lng: 13.405 },
  Russia: { lat: 55.7558, lng: 37.6173 },
  China: { lat: 39.9042, lng: 116.4074 },
  Thailand: { lat: 13.7563, lng: 100.5018 },
  India: { lat: 28.6139, lng: 77.209 },
  Singapore: { lat: 1.3521, lng: 103.8198 },
  "Hong Kong": { lat: 22.3193, lng: 114.1694 },
  Burma: { lat: 16.8409, lng: 96.1735 },
  Malaysia: { lat: 3.139, lng: 101.6869 },
  Indonesia: { lat: -6.2088, lng: 106.8456 },
  Philippines: { lat: 14.5995, lng: 120.9842 },
  Laos: { lat: 17.9757, lng: 102.6331 },
  Cambodia: { lat: 11.5564, lng: 104.9282 },
  Switzerland: { lat: 46.2044, lng: 6.1432 },
  Austria: { lat: 48.2082, lng: 16.3738 },
  Poland: { lat: 52.2297, lng: 21.0122 },
  Morocco: { lat: 33.5731, lng: -7.5898 },
  Spain: { lat: 40.4168, lng: -3.7038 },
  Netherlands: { lat: 52.3676, lng: 4.9041 },
  Denmark: { lat: 55.6761, lng: 12.5683 },
  Sweden: { lat: 59.3293, lng: 18.0686 },
  Norway: { lat: 59.9139, lng: 10.7522 }
};

export default function JourneyRealMapPage() {
  const [countries, setCountries] = useState<JourneyCountry[]>([]);
  const countriesRef = useRef<JourneyCountry[]>([]);
  const [selected, setSelected] = useState<JourneyCountry | null>(null);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [chosenOption, setChosenOption] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, "correct" | "wrong">>({});
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [done, setDone] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<any>(null);
  const markerRefs = useRef<Record<string, any>>({});
  const geoLayerRef = useRef<any>(null);
  const sovereigntyLayerRef = useRef<any>(null);
  const flagMarkersRef = useRef<any[]>([]);
  const microLayersRef = useRef<Record<string, any>>({});

  // Map GeoJSON country names to dataset names
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z]+/g, "");
  const geoNameToDatasetName = (name: string): string => {
    const map: Record<string, string> = {
      "unitedstatesofamerica": "unitedstates",
      "russianfederation": "russia",
      "laopeoplesdemocraticrepublic": "laos",
      "myanmar": "burma",
      "unitedkingdom": "unitedkingdom",
      "cotedivoire": "ivorycoast",
      "vietnam": "vietnam",
      "hongkong": "hongkong"
    };
    const key = normalize(name);
    return map[key] || key;
  };

  useEffect(() => {
    fetch("/data/journey-countries.json")
      .then((r) => r.json())
      .then((d: JourneyCountry[]) => setCountries(d))
      .catch((e) => console.error("Load journey data failed", e));
  }, []);

  useEffect(() => {
    countriesRef.current = countries;
  }, [countries]);

  const totalAnswered = useMemo(() => Object.keys(answers).length, [answers]);
  const progress = useMemo(() => (countries.length ? Math.round((totalAnswered / countries.length) * 100) : 0), [countries.length, totalAnswered]);

  // Load Leaflet via CDN and init map once
  useEffect(() => {
    if (!mapRef.current || leafletRef.current) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => {
      // @ts-ignore
      const L = window.L as any;
      const map = L.map(mapRef.current!, {
        worldCopyJump: false,
        maxBounds: L.latLngBounds([[-85, -180], [85, 180]]),
        maxBoundsViscosity: 1.0,
        minZoom: 2,
        zoomControl: true
      }).setView([20, 0], 2);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        noWrap: true
      }).addTo(map);
      leafletRef.current = { L, map };

      // Sovereignty overlay: Vietnam flags over Hoàng Sa & Trường Sa
      const overlay = L.layerGroup().addTo(map);
      sovereigntyLayerRef.current = overlay;
      // Ensure tooltips/popups render above flag overlays
      const ttPane = map.getPane('tooltipPane');
      const ppPane = map.getPane('popupPane');
      if (ttPane) ttPane.style.zIndex = '900';
      if (ppPane) ppPane.style.zIndex = '901';
      // Create panes: image pane on top (non-interactive), and click pane under it (interactive)
      if (!map.getPane('vn-flag-pane')) {
        const flagPane = map.createPane('vn-flag-pane');
        flagPane.style.zIndex = '700';
        flagPane.style.pointerEvents = 'auto';
      }
      if (!map.getPane('vn-flag-click')) {
        const clickPane = map.createPane('vn-flag-click');
        clickPane.style.zIndex = '690';
        clickPane.style.pointerEvents = 'auto';
      }
      if (!map.getPane('micro-country-pane')) {
        const microPane = map.createPane('micro-country-pane');
        microPane.style.zIndex = '800';
        microPane.style.pointerEvents = 'auto';
      }
      // Flag icon factory (scales with zoom)
      const makeFlagIcon = (widthPx: number) => {
        const heightPx = Math.round((widthPx * 2) / 3); // 3:2 ratio
        const flagSvg = encodeURIComponent(
          `<svg xmlns='http://www.w3.org/2000/svg' width='${widthPx}' height='${heightPx}' viewBox='0 0 3 2'>
             <rect width='3' height='2' fill='#da251d'/>
             <polygon points='1.5,0.3 1.7,0.9 2.3,0.9 1.8,1.2 2.0,1.8 1.5,1.45 1.0,1.8 1.2,1.2 0.7,0.9 1.3,0.9' fill='#ffcd00'/>
           </svg>`
        );
        return L.icon({
          iconUrl: `data:image/svg+xml;utf8,${flagSvg}`,
          iconSize: [widthPx, heightPx],
          iconAnchor: [Math.round(widthPx / 2), Math.round(heightPx / 2)]
        });
      };
      const getIconSizeForZoom = (z: number) => {
        // Scale linearly with zoom; clamp to reasonable sizes
        return Math.max(14, Math.min(40, 6 + z * 3));
      };
      const addFlag = (lat: number, lng: number, label: string) => {
        const icon = makeFlagIcon(getIconSizeForZoom(map.getZoom()));
        const m = L.marker([lat, lng], { icon, zIndexOffset: 1000 })
          .bindTooltip(`🇻🇳 ${label}`, { permanent: false, direction: "top" })
          .addTo(overlay);
        flagMarkersRef.current.push(m);
        return m;
      };
      // Bỏ các cờ nhỏ trên từng điểm; chỉ giữ overlay cờ phủ vùng
      // Helper: generate VN flag data URL for imageOverlay (3:2 ratio)
      const makeFlagDataUrl = (width = 600, height = 400) => {
        const svg = `
          <svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 3 2'>
            <rect width='3' height='2' fill='#da251d'/>
            <polygon points='1.5,0.3 1.7,0.9 2.3,0.9 1.8,1.2 2.0,1.8 1.5,1.45 1.0,1.8 1.2,1.2 0.7,0.9 1.3,0.9' fill='#ffcd00'/>
          </svg>`;
        return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
      };

      // Paracel (Hoàng Sa) region flag overlay (~15.5–17.3 N, 111.0–113.0 E)
      const paracelBounds = L.latLngBounds([15.5, 111.0], [17.3, 113.0]);
      L.imageOverlay(makeFlagDataUrl(), paracelBounds, { opacity: 1.0, pane: 'vn-flag-pane', interactive: true })
        .bindTooltip('Việt Nam – Quần đảo Hoàng Sa', { sticky: true })
        .on('click', () => {
          const vn = (countries || []).find(c => normalize(c.name) === 'vietnam');
          if (vn) { setSelected(vn); setResult(null); }
        })
        .addTo(overlay)
        .bringToFront();

      // Spratly region flag overlay (~6.5–12.0 N, 111.0–117.333 E)
      const spratlyBounds = L.latLngBounds([6.5, 111.0], [12.0, 117.333]);
      L.imageOverlay(makeFlagDataUrl(), spratlyBounds, { opacity: 1.0, pane: 'vn-flag-pane', interactive: true })
        .bindTooltip('Việt Nam – Quần đảo Trường Sa', { sticky: true })
        .on('click', () => {
          const vn = (countries || []).find(c => normalize(c.name) === 'vietnam');
          if (vn) { setSelected(vn); setResult(null); }
        })
        .addTo(overlay)
        .bringToFront();

      // Update icon sizes on zoom
      const updateFlagSizes = () => {
        const size = getIconSizeForZoom(map.getZoom());
        const icon = makeFlagIcon(size);
        flagMarkersRef.current.forEach((m) => m.setIcon(icon));
      };
      map.on("zoomend", updateFlagSizes);
      updateFlagSizes();
      // Load world countries GeoJSON (lightweight)
      fetch("https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json")
        .then((r) => r.json())
        .then((geo) => {
          let hasSingapore = false;
          const layer = L.geoJSON(geo, {
            style: (feature: any) => {
              const fname = feature?.properties?.name || "";
              const datasetKey = geoNameToDatasetName(fname);
              const targetKeys = new Set(
                (countries || []).map((c) => normalize(c.name))
              );
              const ans = answers[datasetKey];
              const isTarget = targetKeys.has(datasetKey);
              const fillColor = isTarget ? (ans === "correct" ? "#10b981" : ans === "wrong" ? "#ef4444" : "#ffd700") : "#e5e7eb";
              return {
                color: isTarget ? "#ff6b00" : "#ffffff",
                weight: isTarget ? 1 : 0.5,
                fillColor,
                fillOpacity: isTarget ? 0.6 : 0.3
              };
            },
            onEachFeature: (feature: any, layerInst: any) => {
              const fname = feature?.properties?.name || "";
              const datasetKey = geoNameToDatasetName(fname);
              if (datasetKey === 'singapore') {
                hasSingapore = true;
              }
              const target = (countries || []).find((c) => normalize(c.name) === datasetKey);
          if (target) {
                layerInst.on("click", () => {
                  const key = normalize(target.name);
                  if (!answers[key]) {
                    setSelected(target);
                    setResult(null);
                setChosenOption(null);
                  }
                });
                layerInst.bindTooltip(`${target.flag} ${target.name}`, { sticky: true });
              } else {
                layerInst.bindTooltip(fname, { sticky: true });
              }
            }
          }).addTo(map);
          geoLayerRef.current = layer;

          // Helper to add a clickable micro polygon overlay for tiny territories
          const addMicroOverlay = (key: string, label: string, bounds: any) => {
            const ans = answers[key];
            const fillColor = ans === 'correct' ? '#10b981' : ans === 'wrong' ? '#ef4444' : '#ffd700';
            const rect = L.rectangle(bounds, { pane: 'micro-country-pane', color: '#ff6b00', weight: 1, fillColor, fillOpacity: 0.6, className: 'micro-country' })
              .bindTooltip(label, { sticky: true })
              .on('click', () => {
                const target = (countriesRef.current || []).find((c) => normalize(c.name) === key);
                if (target && !answers[key]) { setSelected(target); setResult(null); }
              })
              .addTo(map)
              .bringToFront();
            microLayersRef.current[key] = rect;
          };

          // Add micro overlay for Singapore if missing/tiny
          if (!hasSingapore) {
            addMicroOverlay('singapore', 'Singapore', L.latLngBounds([1.130, 103.60], [1.470, 104.10]));
          }
          // Also ensure Hong Kong has a tappable area (small polygon)
          addMicroOverlay('hongkong', 'Hong Kong', L.latLngBounds([22.145, 113.80], [22.60, 114.40]));
        })
        .catch((e) => console.error("Load countries geojson failed", e));
    };
    document.body.appendChild(script);
  }, []);

  // Remove centroid markers; interactions happen directly on country polygons
  useEffect(() => {
    if (!leafletRef.current || countries.length === 0) return;
    const { L, map } = leafletRef.current as { L: any; map: any };
    // Optionally fit world view initially
    map.setView([20, 0], 2);
  }, [countries]);

  // Refresh polygon styles when answers or countries change
  useEffect(() => {
    const lf = leafletRef.current as { L: any; map: any } | null;
    const layer = geoLayerRef.current;
    if (!lf || !layer) return;
    try {
      layer.setStyle((feature: any) => {
        const fname = feature?.properties?.name || "";
        const datasetKey = geoNameToDatasetName(fname);
        const targetKeys = new Set((countries || []).map((c) => normalize(c.name)));
        const ans = answers[datasetKey];
        const isTarget = targetKeys.has(datasetKey);
        const fillColor = isTarget ? (ans === "correct" ? "#10b981" : ans === "wrong" ? "#ef4444" : "#ffd700") : "#e5e7eb";
        return {
          color: isTarget ? "#ff6b00" : "#ffffff",
          weight: isTarget ? 1 : 0.5,
          fillColor,
          fillOpacity: isTarget ? 0.6 : 0.3
        };
      });

      // Rebind click handlers with up-to-date countries mapping
      layer.eachLayer((ly: any) => {
        const fname = ly?.feature?.properties?.name || "";
        const datasetKey = geoNameToDatasetName(fname);
        const target = (countries || []).find((c) => normalize(c.name) === datasetKey);
        ly.off("click");
        if (target) {
          ly.on("click", () => {
            const key = normalize(target.name);
            if (!answers[key]) {
              setSelected(target);
              setResult(null);
            }
          });
        }
      });

      // Update micro-layers coloring (Singapore, Hong Kong)
      const updateMicro = (key: string) => {
        const layer = microLayersRef.current[key];
        if (layer) {
          const ans = answers[key];
          const fillColor = ans === 'correct' ? '#10b981' : ans === 'wrong' ? '#ef4444' : '#ffd700';
          layer.setStyle({ fillColor });
        }
      };
      updateMicro('singapore');
      updateMicro('hongkong');
    } catch {}
  }, [answers, countries]);

  const handleAnswer = (opt: string) => {
    if (!selected) return;
    const isCorrect = opt === selected.correctAnswer;
    const key = selected.name.toLowerCase().replace(/\s+/g, "");
    setAnswers((prev) => ({ ...prev, [key]: isCorrect ? "correct" : "wrong" }));
    setResult(isCorrect ? "correct" : "wrong");
    setChosenOption(opt);
    if (isCorrect) setScore((s) => ({ ...s, correct: s.correct + 1 }));
    else setScore((s) => ({ ...s, wrong: s.wrong + 1 }));

    // Focus map on the answered country's polygon
    const { map } = (leafletRef.current || {}) as { L: any; map: any };
    const layerGroup = geoLayerRef.current;
    if (map && layerGroup) {
      try {
        let targetBounds: any = null;
        layerGroup.eachLayer((ly: any) => {
          const fname = ly?.feature?.properties?.name || "";
          const datasetKey = geoNameToDatasetName(fname);
          if (datasetKey === key && ly.getBounds) {
            targetBounds = ly.getBounds();
          }
        });
        if (targetBounds) {
          map.fitBounds(targetBounds.pad(0.2));
        }
      } catch {}
    }

    const answeredCount = Object.keys(answers).length + 1;
    if (answeredCount === countries.length) setTimeout(() => setDone(true), 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 rounded-3xl shadow-2xl mb-6">
            <Globe className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-2">
            Bản đồ thật: Giải mã Hành Trình (1911–1941)
          </h1>
          <p className="text-gray-300">Bản đồ OSM tương tác với các điểm đến trong hành trình của Bác Hồ.</p>
          <div className="flex justify-center gap-3 mt-4">
            <Badge className="bg-gradient-to-r from-red-600 to-orange-600 text-white">Thử nghiệm bản đồ thật</Badge>
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
            </div>
          </CardContent>
        </Card>

        <Card className="w-full mx-auto border-2 border-purple-300 bg-white/95 backdrop-blur-sm shadow-2xl overflow-hidden">
          <CardContent className="p-0">
            <div ref={mapRef} style={{ height: "80vh", minHeight: "700px", width: "100%" }} />
          </CardContent>
        </Card>

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
                          : result === "wrong" && chosenOption === opt
                          ? "bg-red-500 text-white"
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
                      {result === "correct" ? (
                        <p className="font-semibold mb-2">Chính xác!</p>
                      ) : (
                        <div className="font-semibold mb-2">
                          <div>Bạn chọn: <span className="text-red-600">{chosenOption}</span></div>
                          <div>Đáp án đúng: <span className="underline">{selected.correctAnswer}</span></div>
                        </div>
                      )}
                      <p className="text-sm leading-relaxed text-gray-800">{selected.detail}</p>
                      {selected.references?.length ? (
                        <ul className="list-disc pl-5 mt-2 text-sm text-blue-700">
                          {selected.references.map((ref, idx) => (
                            <li key={idx}><a className="underline" href={ref} target="_blank" rel="noopener noreferrer">Tham khảo {idx + 1}</a></li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-end gap-3">
                  <Button variant="outline" onClick={() => { setSelected(null); setResult(null); setChosenOption(null); }}>Đóng</Button>
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


