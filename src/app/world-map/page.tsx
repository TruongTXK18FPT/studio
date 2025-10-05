"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  MapPin, 
  CheckCircle, 
  XCircle, 
  Trophy,
  Globe,
  Sparkles,
  Star,
  Award,
  Info,
  Plus,
  Minus,
  RotateCcw,
  Volume2,
  VolumeX,
  Music
} from "lucide-react";

// Mapping tên quốc gia sang ID trong SVG (SVG đầy đủ từ thư viện)
const countryToSvgId: Record<string, string> = {
  "Vietnam": "VN",
  "France": "FR",
  "United Kingdom": "GB", 
  "United States": "US",
  "Algeria": "DZ",
  "Tunisia": "TN",
  "Belgium": "BE",
  "Italy": "IT",
  "Germany": "DE",
  "Russia": "RU",
  "China": "CN",
  "Thailand": "TH",
  "India": "IN",
  "Singapore": "SG",
  "Hong Kong": "HK",
  "Burma": "MM",
  "Malaysia": "MY",
  "Indonesia": "ID",
  "Philippines": "PH",
  "Laos": "LA",
  "Cambodia": "KH",
  "Switzerland": "CH",
  "Austria": "AT",
  "Poland": "PL",
  "Morocco": "MA",
  "Spain": "ES",
  "Netherlands": "NL",
  "Denmark": "DK",
  "Sweden": "SE",
  "Norway": "NO"
};

interface Country {
  id: number;
  name: string;
  flag: string;
  year: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export default function WorldMapGame() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selected, setSelected] = useState<Country | null>(null);
  const [answered, setAnswered] = useState<Record<string, boolean>>({});
  const [showPopup, setShowPopup] = useState(false);
  const [showResult, setShowResult] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);
  const [showVictory, setShowVictory] = useState(false);
  const [svgLoaded, setSvgLoaded] = useState(false);
  const svgRef = useRef<HTMLObjectElement>(null);
  
  // Pan and zoom state
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Background music state
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);
  
  // Audio context for sound effects
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContext();
      } catch (e) {
        console.log('Web Audio API not supported');
      }
    }
  }, []);

  // Play sound using audio files
  const playSound = (type: 'correct' | 'wrong') => {
    try {
      const audio = new Audio(`/sounds/${type}.mp3`);
      audio.volume = 0.7;
      audio.play().catch(err => console.log('Could not play sound:', err));
    } catch (error) {
      console.log('Audio not available:', error);
    }
  };

  // Pan and zoom handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.min(Math.max(zoom * delta, 0.5), 3);
    setZoom(newZoom);
  };

  const resetView = () => {
    setPan({ x: 0, y: 0 });
    setZoom(1);
  };

  // Background music handlers
  const toggleMusic = () => {
    if (!backgroundMusicRef.current) {
      backgroundMusicRef.current = new Audio('/sounds/funny-music-319843.mp3');
      backgroundMusicRef.current.loop = true;
      backgroundMusicRef.current.volume = 0.3;
    }

    if (isMusicPlaying) {
      backgroundMusicRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      backgroundMusicRef.current.play().catch(console.error);
      setIsMusicPlaying(true);
    }
  };

  const toggleMute = () => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    fetch("/data/countries.json")
      .then((res) => res.json())
      .then((data) => {
        setCountries(data);
        console.log("Countries loaded:", data.length);
      })
      .catch((err) => console.error("Failed to load countries:", err));
  }, []);

  useEffect(() => {
    const handleSvgLoad = () => {
      console.log("SVG loading...");
      const svgDoc = svgRef.current?.contentDocument;
      if (!svgDoc) {
        console.error("SVG document not found");
        return;
      }

      setSvgLoaded(true);
      console.log("SVG loaded successfully!");

      const paths = svgDoc.querySelectorAll("g[id]");
      console.log("Found", paths.length, "countries in SVG");
      
        let foundCountries = 0;
        
        paths.forEach((countryGroup) => {
          const svgId = countryGroup.id;
          
          // Check if this country is in our list by ID
          const country = countries.find(c => {
            const idMatch = countryToSvgId[c.name] === svgId;
            return idMatch;
          });
          
          // Get all path elements within this country group
          const pathElements = countryGroup.querySelectorAll("path");
          
          pathElements.forEach((pathElement) => {
            const element = pathElement as SVGPathElement;
            
            // Reset all countries to default style first
            element.classList.add("country");
            element.style.cursor = "default";
            element.style.transition = "all 0.3s ease";
            element.style.stroke = "#ffffff";
            element.style.strokeWidth = "0.5";
            element.style.fill = "#e5e7eb"; // Default gray for non-target countries
          
          // Highlight countries that Bac Ho visited
          if (country) {
            foundCountries++;
            console.log("Found target country:", country.name, "with SVG ID:", svgId);
            element.style.cursor = "pointer";
            element.style.stroke = "#ff6b00";
            element.style.strokeWidth = "2";
            
            const normalizedId = country.name.toLowerCase().replace(/\s+/g, "");
            
            // Check if already answered
            if (answered[normalizedId]) {
              element.style.fill = "#10b981"; // Green for correct
            } else {
              element.style.fill = "#ffd700"; // Gold for available
            }
            
            // Add click handler
            element.addEventListener("click", () => handleCountryClick(country.name));
            
            // Hover effect
            element.addEventListener("mouseenter", () => {
              if (!answered[normalizedId]) {
                element.style.fill = "#ffcc00";
                element.style.strokeWidth = "3";
                element.style.filter = "drop-shadow(0 0 10px rgba(255, 215, 0, 0.8))";
              }
            });
            
            element.addEventListener("mouseleave", () => {
              if (!answered[normalizedId]) {
                element.style.fill = "#ffd700";
                element.style.strokeWidth = "2";
                element.style.filter = "none";
              } else if (answered[normalizedId] === true) {
                element.style.fill = "#10b981";
              }
            });
          }
          });
        });
        
        console.log(`Found ${foundCountries} target countries out of ${countries.length} total countries`);
    };

    if (svgRef.current && countries.length > 0) {
      svgRef.current.addEventListener("load", handleSvgLoad);
      // Try to load immediately if already loaded
      if (svgRef.current.contentDocument) {
        handleSvgLoad();
      }
    }

    return () => {
      if (svgRef.current) {
        svgRef.current.removeEventListener("load", handleSvgLoad);
      }
    };
  }, [countries, answered]);

  const handleCountryClick = (id: string) => {
    const normalizedId = id.toLowerCase().replace(/\s+/g, "");
    
    const country = countries.find(
      (c) => c.name.toLowerCase().replace(/\s+/g, "") === normalizedId
    );
    
    if (country && !answered[normalizedId]) {
      setSelected(country);
      setShowPopup(true);
      setShowResult(null);
    }
  };

  const handleAnswer = (option: string) => {
    if (!selected) return;

    const normalizedId = selected.name.toLowerCase().replace(/\s+/g, "");
    const correct = option === selected.correctAnswer;
    
    // Play sound effect
    playSound(correct ? 'correct' : 'wrong');
    
    setShowResult(correct ? "correct" : "wrong");
    
    setTimeout(() => {
      setAnswered((prev) => ({ ...prev, [normalizedId]: correct }));

      if (correct) {
        setScore((prev) => prev + 1);
        
        // Change color on map
        const svgDoc = svgRef.current?.contentDocument;
        if (svgDoc) {
          const svgId = countryToSvgId[selected.name];
          if (svgId) {
            const element = svgDoc.getElementById(svgId);
            if (element && element instanceof SVGPathElement) {
              element.style.fill = "#10b981"; // Green color
              element.style.filter = "none";
            }
          }
        }
        
        // Check victory
        if (Object.keys(answered).length + 1 === countries.length) {
          setTimeout(() => {
            setShowVictory(true);
          }, 1000);
        }
      }

      setTimeout(() => {
        setShowPopup(false);
        setShowResult(null);
      }, 1500);
    }, 1000);
  };

  const completedCount = Object.keys(answered).length;
  const progress = countries.length > 0 ? (completedCount / countries.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>
      {/* Animated background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-red-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-yellow-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-orange-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 rounded-3xl shadow-2xl mb-6 transform hover:scale-105 transition-transform">
            <Globe className="w-12 h-12 text-white animate-spin-slow" />
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4 font-[Poppins] drop-shadow-sm">
            🗺️ Hành Trình Theo Chân Bác Hồ
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Khám phá <span className="font-bold text-purple-400">30 quốc gia</span> mà Bác Hồ từng đi qua trong hành trình vĩ đại tìm đường cứu nước
          </p>
          <div className="flex justify-center gap-3 mt-4">
            <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 text-sm shadow-lg">
              <Star className="w-4 h-4 mr-1 inline" />
              Năm 1911-1945
            </Badge>
            <Badge className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-2 text-sm shadow-lg">
              <Sparkles className="w-4 h-4 mr-1 inline" />
              30 Quốc gia
            </Badge>
          </div>
        </div>

        {/* Progress Card */}
        <Card className="max-w-5xl mx-auto mb-8 border-2 border-purple-300 bg-white/95 backdrop-blur-sm shadow-2xl animate-fadeIn">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
            <CardTitle className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">Tiến độ hành trình</div>
                  <div className="text-sm text-gray-600 font-normal">Hoàn thành tất cả để nhận kỷ niệm chương</div>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-red-600 to-orange-600 text-white text-2xl px-6 py-2 shadow-lg">
                {completedCount}/{countries.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="relative">
                <Progress value={progress} className="h-6 bg-red-100" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-700">{progress.toFixed(0)}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-base">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-red-600" />
                  <span className="font-semibold text-gray-700">Điểm số: <span className="text-red-600">{score}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-gray-700">{completedCount} quốc gia đã khám phá</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

         {/* Map Container - Full Screen */}
         <Card className="w-full mx-auto border-2 border-purple-300 bg-white/95 backdrop-blur-sm shadow-2xl overflow-hidden animate-fadeIn">
           <CardContent className="p-1">
             <div 
               className="relative w-full bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg overflow-hidden" 
               onMouseDown={handleMouseDown}
               onMouseMove={handleMouseMove}
               onMouseUp={handleMouseUp}
               onMouseLeave={handleMouseUp}
               onWheel={handleWheel}
               style={{ 
                 height: "95vh", 
                 minHeight: "900px",
                 cursor: isDragging ? "grabbing" : "grab"
               }}
             >
               <style dangerouslySetInnerHTML={{
                 __html: `
                   /* === FULL WORLD MAP DISPLAY === */
                   object[data$=".svg"],
                   object#world-map,
                   svg#world-map {
                     width: 100% !important;
                     height: 100% !important;
                     max-width: none !important;
                     overflow: visible !important;
                     display: block;
                     transform-origin: center center;
                     min-width: 1500px !important;
                     min-height: 800px !important;
                   }

                   .map-container {
                     width: 100%;
                     height: 100%;
                     overflow: visible;
                     background-color: #eef5f9;
                     position: relative;
                   }

                   .country {
                     transition: all 0.3s ease;
                     cursor: pointer;
                   }
                   .country:hover {
                     filter: drop-shadow(0 0 8px rgba(255, 204, 0, 0.6));
                     transform: scale(1.02);
                   }
                   .country.completed {
                     animation: pulse 2s infinite;
                   }
                   @keyframes pulse {
                     0% { opacity: 1; }
                     50% { opacity: 0.8; }
                     100% { opacity: 1; }
                   }
                 `
               }} />
              {!svgLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10 rounded-lg">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Đang tải bản đồ thế giới...</p>
                  </div>
                </div>
              )}
              
               <object
                 ref={svgRef}
                 data="/world-map-full.svg"
                 type="image/svg+xml"
                 className="w-full h-full rounded-lg"
                 style={{
                   width: '100%',
                   height: '100%',
                   objectFit: 'contain',
                   minWidth: '1500px',
                   minHeight: '800px',
                   transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                   transformOrigin: 'center center',
                   transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                 }}
                 aria-label="Interactive World Map"
               >
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-700 font-medium">Không thể tải bản đồ</p>
                    <p className="text-gray-500 text-sm">Vui lòng kiểm tra file /public/world-map.svg</p>
                  </div>
                </div>
              </object>
              
              {/* Hint box */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur rounded-2xl p-4 shadow-xl border-2 border-purple-200 max-w-xs z-20">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Info className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 mb-1">Hướng dẫn</p>
                    <p className="text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-red-600 inline mr-1" />
                      Click vào quốc gia <span className="font-semibold text-yellow-600">màu vàng</span> để trả lời câu hỏi lịch sử
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      🖱️ Kéo để di chuyển bản đồ<br/>
                      🔍 Cuộn chuột để zoom in/out<br/>
                      🔄 Nút reset để về vị trí ban đầu
                    </p>
                  </div>
                </div>
              </div>
              
              
              {/* Map Controls */}
              <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-20">
                <Button
                  onClick={toggleMusic}
                  size="sm"
                  variant="outline"
                  className="bg-white/90 hover:bg-white shadow-lg"
                  title={isMusicPlaying ? "Tắt nhạc nền" : "Bật nhạc nền"}
                >
                  {isMusicPlaying ? <Music className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </Button>
                <Button
                  onClick={toggleMute}
                  size="sm"
                  variant="outline"
                  className="bg-white/90 hover:bg-white shadow-lg"
                  title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
                <Button
                  onClick={() => setZoom(prev => Math.min(prev * 1.2, 3))}
                  size="sm"
                  variant="outline"
                  className="bg-white/90 hover:bg-white shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => setZoom(prev => Math.max(prev / 1.2, 0.5))}
                  size="sm"
                  variant="outline"
                  className="bg-white/90 hover:bg-white shadow-lg"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Button
                  onClick={resetView}
                  size="sm"
                  variant="outline"
                  className="bg-white/90 hover:bg-white shadow-lg"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Zoom Level Indicator */}
              <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-2 rounded-lg shadow-lg z-20">
                <p className="text-sm font-medium text-gray-700">
                  Zoom: {Math.round(zoom * 100)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <div className="max-w-5xl mx-auto mt-8 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-red-200">
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-8 bg-[#e0e0e0] border-2 border-gray-400 rounded-lg shadow-sm"></div>
              <span className="text-base font-medium text-gray-700">Quốc gia khác</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-8 bg-[#ffd700] border-2 border-[#ff6b00] rounded-lg shadow-sm"></div>
              <span className="text-base font-medium text-gray-700">Bác đã đi qua (chưa trả lời)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-8 bg-[#00FF88] border-2 border-[#00cc66] rounded-lg shadow-sm"></div>
              <span className="text-base font-medium text-gray-700">Đã hoàn thành</span>
            </div>
          </div>
        </div>

        {/* Countries List */}
        <Card className="max-w-7xl mx-auto mt-8 border-2 border-red-300 bg-white/95 backdrop-blur-sm shadow-2xl animate-fadeIn">
          <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-gray-800">30 Quốc gia trong hành trình của Bác Hồ</div>
                <div className="text-sm text-gray-600 font-normal">Click vào quốc gia để xem và trả lời câu hỏi</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {countries.map((country) => {
                const normalizedId = country.name.toLowerCase().replace(/\s+/g, "");
                const isCompleted = answered[normalizedId];
                
                return (
                  <button
                    key={country.id}
                    onClick={() => {
                      if (!isCompleted) {
                        setSelected(country);
                        setShowPopup(true);
                        setShowResult(null);
                      }
                    }}
                    disabled={isCompleted}
                    className={`
                      p-4 rounded-xl border-2 transition-all text-left shadow-md
                      ${isCompleted 
                        ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-400 cursor-default" 
                        : "bg-gradient-to-br from-yellow-50 to-orange-50 border-orange-400 hover:from-orange-100 hover:to-yellow-100 hover:scale-105 hover:shadow-xl cursor-pointer"
                      }
                    `}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-3xl">{country.flag}</span>
                      {isCompleted && <CheckCircle className="w-5 h-5 text-green-600" />}
                    </div>
                    <div className="font-semibold text-sm text-gray-800 mb-1">{country.name}</div>
                    <div className="text-xs text-gray-600 font-medium">📅 {country.year}</div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Question Popup */}
      {showPopup && selected && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl animate-fadeIn">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6 rounded-t-3xl">
              <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <span className="text-5xl">{selected.flag}</span>
                <div>
                  <div>{selected.name}</div>
                  <div className="text-sm font-normal opacity-90">{selected.year}</div>
                </div>
              </h2>
            </div>
            
            <div className="p-8">
              <p className="text-xl font-semibold text-gray-800 mb-6">
                {selected.question}
              </p>
              
              <div className="grid gap-3">
                {selected.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(opt)}
                    disabled={showResult !== null}
                    className={`
                      py-4 px-6 rounded-xl font-medium transition-all text-left
                      ${showResult === null 
                        ? "bg-blue-500 hover:bg-blue-600 text-white hover:scale-[1.02] active:scale-[0.98]" 
                        : showResult === "correct" && opt === selected.correctAnswer
                        ? "bg-green-500 text-white scale-[1.02]"
                        : showResult === "wrong" && opt === selected.correctAnswer
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span>{opt}</span>
                      {showResult !== null && opt === selected.correctAnswer && (
                        <CheckCircle className="w-6 h-6" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {showResult && (
                <div className={`
                  mt-6 p-4 rounded-xl flex items-center gap-3 font-semibold text-lg
                  ${showResult === "correct" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"}
                `}>
                  {showResult === "correct" ? (
                    <>
                      <CheckCircle className="w-6 h-6" />
                      <span>Chính xác! Tuyệt vời! 🎉</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-6 h-6" />
                      <span>Chưa đúng. Hãy thử lại nhé!</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Victory Modal */}
      {showVictory && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg animate-fadeIn text-center p-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6 animate-bounce">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 mb-4">
              Chúc mừng! 🎊
            </h2>
            
            <p className="text-xl text-gray-700 mb-6">
              Bạn đã hoàn thành hành trình theo chân Bác Hồ!
            </p>
            
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 mb-6">
              <div className="text-5xl font-bold text-red-600 mb-2">{score}/{countries.length}</div>
              <div className="text-gray-600">câu trả lời đúng</div>
            </div>
            
            <Button 
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-8 py-6 text-lg rounded-xl"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Chơi lại
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
