"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { ConfigForm } from "@/components/game/ConfigForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  PlayCircle, 
  Settings, 
  Users, 
  Wifi, 
  WifiOff, 
  QrCode,
  Copy,
  ExternalLink,
  Target,
  Zap,
  Crown,
  Shield,
  Activity,
  Clock,
  CheckCircle
} from "lucide-react";
import Link from "next/link";

export default function HostPage() {
  const [messages, setMessages] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const [roomCode, setRoomCode] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");

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
            setGameStarted(true);
          }
        } catch (e) {
          // Handle non-JSON messages
        }
      };
      
      ws.onopen = () => {
        setIsConnected(true);
        ws.send(JSON.stringify({ type: 'HOST_JOINED', payload: {} }));
      };
      
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
  }, []);

  const last = useMemo(() => messages[messages.length - 1], [messages]);

  // Generate QR code URL when room code is set
  useEffect(() => {
    if (roomCode && typeof window !== 'undefined') {
      const joinUrl = `${window.location.origin}/play/${roomCode}`;
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(joinUrl)}`;
      setQrCodeUrl(qrUrl);
    }
  }, [roomCode]);

  const startGame = async () => {
    if (!roomCode) {
      setError("Vui lòng nhập mã phòng");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch('/api/host/start', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ roomCode }) 
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Không thể bắt đầu game');
      }
      
      setGameStarted(true);
    } catch (e: any) {
      setError(e.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
  };

  const copyJoinUrl = () => {
    const joinUrl = `${window.location.origin}/play/${roomCode}`;
    navigator.clipboard.writeText(joinUrl);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl shadow-lg mb-4">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Battle Royale Host Panel
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tạo phòng chơi, quản lý game và theo dõi người chơi trong thời gian thực
          </p>
        </div>

        {/* Connection Status */}
        <Card className="max-w-md mx-auto">
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-3">
              {isConnected ? (
                <>
                  <Wifi className="w-5 h-5 text-green-600" />
                  <Badge className="bg-green-100 text-green-800">Đã kết nối WebSocket</Badge>
                </>
              ) : (
                <>
                  <WifiOff className="w-5 h-5 text-red-600" />
                  <Badge variant="destructive">Mất kết nối WebSocket</Badge>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Game Control Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Room Setup */}
            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-purple-600" />
                  Thiết lập phòng chơi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Mã phòng</label>
                  <div className="flex gap-2">
                    <Input
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value)}
                      placeholder="Nhập mã phòng (ví dụ: ABC123)"
                      className="flex-1"
                    />
                    {roomCode && (
                      <Button variant="outline" size="sm" onClick={copyRoomCode}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-3">
                  <Button 
                    onClick={startGame} 
                    disabled={!roomCode || loading || !isConnected}
                    className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Đang bắt đầu...
                      </>
                    ) : gameStarted ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Game đang chạy
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Bắt đầu game
                      </>
                    )}
                  </Button>

                  {roomCode && (
                    <Button variant="outline" onClick={copyJoinUrl}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Copy link join
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Game Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Cấu hình game
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ConfigForm onCreate={() => { /* no-op for now */ }} />
              </CardContent>
            </Card>

            {/* Real-time Messages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-orange-600" />
                  Hoạt động real-time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-950 rounded-lg p-4 text-green-400 font-mono text-sm max-h-60 overflow-y-auto">
                  <div className="mb-2 text-gray-400">WebSocket Messages:</div>
                  <div className="whitespace-pre-wrap break-words">
                    {last || "(Chờ tin nhắn...)"}
                  </div>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => wsRef.current?.send(JSON.stringify({ type: 'PING', payload: { at: Date.now() } }))}
                    disabled={!isConnected}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Test Connection
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* QR Code & Player Info */}
          <div className="space-y-6">
            {/* QR Code Join */}
            {roomCode && (
              <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <QrCode className="w-5 h-5 text-green-600" />
                    QR Code Join Game
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  {qrCodeUrl && (
                    <div className="bg-white p-4 rounded-lg shadow-inner inline-block">
                      <img 
                        src={qrCodeUrl} 
                        alt="QR Code để join game" 
                        className="w-48 h-48 mx-auto"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <div className="text-lg font-bold text-gray-900">
                      Mã phòng: <span className="bg-black text-white px-3 py-1 rounded font-mono">{roomCode}</span>
                    </div>
                    
                    <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      <Link href={`/play/${roomCode}`} target="_blank">
                        <Users className="w-4 h-4 mr-2" />
                        Mở trang người chơi
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Game Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-600" />
                  Trạng thái game
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">0</div>
                    <div className="text-sm text-gray-600">Người chơi</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">6</div>
                    <div className="text-sm text-gray-600">Teams</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Game Status</span>
                    <Badge className={gameStarted ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                      {gameStarted ? "Đang chạy" : "Chờ bắt đầu"}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Connection</span>
                    <Badge className={isConnected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {isConnected ? "Kết nối tốt" : "Mất kết nối"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-700">Hành động nhanh</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/admin/dashboard">
                    <Crown className="w-4 h-4 mr-2" />
                    Admin Dashboard
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/quiz">
                    <Target className="w-4 h-4 mr-2" />
                    Quiz Questions
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}


