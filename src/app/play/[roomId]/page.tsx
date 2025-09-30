"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  GamepadIcon,
  Users, 
  Wifi, 
  WifiOff, 
  UserPlus,
  Crown,
  Shield,
  Target,
  Zap,
  Clock,
  Star,
  Trophy,
  Heart,
  Swords,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

const TEAM_COLORS = {
  A: "bg-red-500 border-red-600 text-white",
  B: "bg-blue-500 border-blue-600 text-white", 
  C: "bg-green-500 border-green-600 text-white",
  D: "bg-yellow-500 border-yellow-600 text-white",
  E: "bg-purple-500 border-purple-600 text-white",
  F: "bg-pink-500 border-pink-600 text-white"
};

const TEAM_NAMES = {
  A: "Red Dragons",
  B: "Blue Sharks", 
  C: "Green Eagles",
  D: "Yellow Lions",
  E: "Purple Wizards",
  F: "Pink Panthers"
};

export default function PlayRoomPage() {
  const params = useParams<{ roomId: string }>();
  const roomId = params?.roomId as string;
  const [name, setName] = useState("");
  const [teamId, setTeamId] = useState("A");
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [gameStatus, setGameStatus] = useState<'waiting' | 'playing' | 'finished'>('waiting');
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const scheme = location.protocol === 'https:' ? 'wss' : 'ws';
      const url = `${scheme}://${location.host}/api/ws`;
      const ws = new WebSocket(url);
      wsRef.current = ws;
      
      ws.onmessage = (ev) => {
        setMessages((m) => [...m, ev.data]);
        try {
          const data = JSON.parse(ev.data);
          if (data.type === 'QUESTION_STARTED') {
            setGameStatus('playing');
          }
        } catch (e) {
          // Handle non-JSON messages
        }
      };
      
      ws.onopen = () => setIsConnected(true);
      
      ws.onerror = () => {
        setMessages((m) => [...m, 'WS_ERROR']);
        setIsConnected(false);
      };
      
      ws.onclose = () => {
        setMessages((m) => [...m, 'WS_CLOSED']);
        setIsConnected(false);
      };
      
      return () => ws.close();
    } catch {
      setMessages((m) => [...m, 'WS_INIT_FAILED']);
      setIsConnected(false);
    }
  }, [roomId]);

  const last = useMemo(() => messages[messages.length - 1], [messages]);

  async function join() {
    if (!name.trim()) {
      setError("Vui lòng nhập tên của bạn");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomCode: roomId, name: name.trim(), teamId }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setJoined(true);
      } else {
        throw new Error(data.error || 'Không thể tham gia phòng');
      }
    } catch (e: any) {
      setError(e.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  }

  const selectedTeamClass = TEAM_COLORS[teamId as keyof typeof TEAM_COLORS];
  const selectedTeamName = TEAM_NAMES[teamId as keyof typeof TEAM_NAMES];

  if (!joined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-teal-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl shadow-lg mb-4">
                <GamepadIcon className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Join Battle Royale
              </h1>
              <div className="space-y-2">
                <p className="text-lg text-gray-600">
                  Phòng: <span className="font-mono font-bold text-gray-900">{roomId}</span>
                </p>
                <div className="flex items-center justify-center gap-2">
                  {isConnected ? (
                    <>
                      <Wifi className="w-4 h-4 text-green-600" />
                      <Badge className="bg-green-100 text-green-800">Đã kết nối</Badge>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-4 h-4 text-red-600" />
                      <Badge variant="destructive">Mất kết nối</Badge>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Join Form */}
            <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-emerald-600" />
                  Thông tin người chơi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Tên của bạn</label>
                  <Input
                    placeholder="Nhập tên hiển thị trong game"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-lg"
                    maxLength={20}
                  />
                  <p className="text-xs text-gray-500">Tối đa 20 ký tự</p>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Chọn đội</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(TEAM_NAMES).map(([id, teamName]) => (
                      <button
                        key={id}
                        onClick={() => setTeamId(id)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          teamId === id 
                            ? TEAM_COLORS[id as keyof typeof TEAM_COLORS] + " scale-105 shadow-lg"
                            : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Shield className="w-5 h-5" />
                          <span className="font-bold">Team {id}</span>
                        </div>
                        <div className="text-sm font-medium">{teamName}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={join} 
                  disabled={!name.trim() || loading || !isConnected}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-lg py-6"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Đang tham gia...
                    </>
                  ) : (
                    <>
                      <GamepadIcon className="w-5 h-5 mr-2" />
                      Tham gia game - {selectedTeamName}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Game Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Hướng dẫn chơi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-start gap-3">
                    <Heart className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">HP System</div>
                      <div className="text-gray-600">Mỗi đội có 200 HP, trả lời đúng để tấn công đội khác</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Thời gian</div>
                      <div className="text-gray-600">20 giây để trả lời mỗi câu hỏi</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Swords className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Battle Royale</div>
                      <div className="text-gray-600">Đội cuối cùng còn sống sót sẽ thắng</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Star className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Điểm thưởng</div>
                      <div className="text-gray-600">Trả lời nhanh để được điểm bonus</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-teal-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Player Status Header */}
          <Card className={`border-2 ${selectedTeamClass.replace('bg-', 'border-').replace('-500', '-600')}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-full ${selectedTeamClass} flex items-center justify-center`}>
                    <Crown className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Chào {name}!</h2>
                    <div className="flex items-center gap-2">
                      <Badge className={selectedTeamClass}>
                        <Shield className="w-3 h-3 mr-1" />
                        {selectedTeamName}
                      </Badge>
                      <Badge className={gameStatus === 'playing' ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {gameStatus === 'playing' ? 'Đang chơi' : 'Chờ bắt đầu'}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-gray-600">Phòng</div>
                  <div className="text-xl font-mono font-bold">{roomId}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Game Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  Trạng thái game
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  {gameStatus === 'waiting' && (
                    <div className="space-y-2">
                      <Clock className="w-12 h-12 text-orange-500 mx-auto animate-pulse" />
                      <p className="text-lg font-medium">Chờ host bắt đầu</p>
                      <p className="text-sm text-gray-600">Chuẩn bị tinh thần chiến đấu!</p>
                    </div>
                  )}
                  
                  {gameStatus === 'playing' && (
                    <div className="space-y-2">
                      <Zap className="w-12 h-12 text-green-500 mx-auto animate-bounce" />
                      <p className="text-lg font-medium text-green-700">Game đang diễn ra!</p>
                      <p className="text-sm text-gray-600">Hãy trả lời thật nhanh!</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-sm">
                  <div className="bg-gray-50 rounded p-2">
                    <div className="font-bold text-lg">6</div>
                    <div className="text-gray-600">Teams</div>
                  </div>
                  <div className="bg-gray-50 rounded p-2">
                    <div className="font-bold text-lg">200</div>
                    <div className="text-gray-600">HP</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Connection Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Wifi className="w-5 h-5 text-blue-600" />
                  Kết nối
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center gap-2">
                  {isConnected ? (
                    <>
                      <CheckCircle className="w-8 h-8 text-green-500" />
                      <div className="text-center">
                        <div className="font-medium text-green-700">Kết nối tốt</div>
                        <div className="text-sm text-gray-600">Real-time đồng bộ</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-8 h-8 text-red-500" />
                      <div className="text-center">
                        <div className="font-medium text-red-700">Mất kết nối</div>
                        <div className="text-sm text-gray-600">Đang thử kết nối lại...</div>
                      </div>
                    </>
                  )}
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => wsRef.current?.send(JSON.stringify({ type: 'PING', payload: { at: Date.now() } }))}
                  disabled={!isConnected}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Test kết nối
                </Button>
              </CardContent>
            </Card>

            {/* Team Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                  Đội của bạn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-3">
                  <div className={`w-20 h-20 rounded-full ${selectedTeamClass} flex items-center justify-center mx-auto`}>
                    <Shield className="w-10 h-10" />
                  </div>
                  <div>
                    <div className="font-bold text-lg">Team {teamId}</div>
                    <div className="text-sm text-gray-600">{selectedTeamName}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-2">
                    <div className="text-xs text-gray-500">HP hiện tại</div>
                    <div className="text-2xl font-bold">200</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Game Messages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                Game Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-950 rounded-lg p-4 text-green-400 font-mono text-sm max-h-48 overflow-y-auto">
                <div className="mb-2 text-gray-400">Live Messages:</div>
                <div className="whitespace-pre-wrap break-words">
                  {last || "(Chờ tin nhắn từ game...)"}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}



