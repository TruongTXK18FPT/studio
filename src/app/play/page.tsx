"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  GamepadIcon,
  QrCode,
  Users, 
  Target,
  Crown,
  Shield,
  Star,
  Trophy,
  Heart,
  Swords,
  Clock,
  Zap,
  ArrowRight,
  Info
} from "lucide-react";
import Link from "next/link";

export default function JoinGamePage() {
  const [roomCode, setRoomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const joinRoom = async () => {
    if (!roomCode.trim()) {
      setError("Vui lòng nhập mã phòng");
      return;
    }
    
    const code = roomCode.trim().toUpperCase();
    setLoading(true);
    
    // Simple validation - just redirect to play page
    // The actual room validation will happen on the play page
    setTimeout(() => {
      router.push(`/play/${code}`);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      joinRoom();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-teal-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl shadow-lg mb-4">
              <GamepadIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Battle Royale Quiz
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tham gia trận chiến tri thức về lịch sử Việt Nam cùng bạn bè
            </p>
          </div>

          {/* Join Form */}
          <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <QrCode className="w-6 h-6 text-emerald-600" />
                Tham gia game
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <label className="text-lg font-medium text-gray-700">Nhập mã phòng</label>
                  <p className="text-sm text-gray-600">Mã phòng do host cung cấp (ví dụ: ABC123)</p>
                </div>
                
                <div className="flex gap-3">
                  <Input
                    placeholder="Mã phòng (ABC123)"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    onKeyPress={handleKeyPress}
                    className="text-lg text-center font-mono tracking-wider"
                    maxLength={10}
                  />
                  <Button 
                    onClick={joinRoom} 
                    disabled={!roomCode.trim() || loading}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 px-8"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Đang vào...
                      </>
                    ) : (
                      <>
                        Tham gia
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Game Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="w-5 h-5 text-blue-600" />
                  Battle Royale Mode
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div className="bg-white/70 rounded p-2">
                    <div className="font-bold text-blue-700">6</div>
                    <div className="text-gray-600">Teams</div>
                  </div>
                  <div className="bg-white/70 rounded p-2">
                    <div className="font-bold text-red-700">200</div>
                    <div className="text-gray-600">HP</div>
                  </div>
                  <div className="bg-white/70 rounded p-2">
                    <div className="font-bold text-orange-700">20s</div>
                    <div className="text-gray-600">Time</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  6 đội tranh tài, trả lời đúng để tấn công đối thủ. Đội cuối cùng sống sót sẽ chiến thắng!
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Crown className="w-5 h-5 text-purple-600" />
                  Game Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span>Tấn công 10% HP khi trả lời đúng</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span>Buff hồi 5% HP cho đội</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="w-4 h-4 text-blue-500" />
                    <span>Điểm bonus khi trả lời nhanh</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Trophy className="w-4 h-4 text-green-500" />
                    <span>Hiệu ứng pháo hoa khi thắng</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Game Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-indigo-600" />
                Hướng dẫn chơi chi tiết
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Cách tham gia:</h4>
                  <ol className="space-y-2 text-sm text-gray-600">
                    <li className="flex gap-2">
                      <span className="bg-emerald-100 text-emerald-800 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                      Nhận mã phòng từ host hoặc quét QR code
                    </li>
                    <li className="flex gap-2">
                      <span className="bg-emerald-100 text-emerald-800 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                      Nhập tên và chọn đội (6 đội khác nhau)
                    </li>
                    <li className="flex gap-2">
                      <span className="bg-emerald-100 text-emerald-800 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                      Chờ host bắt đầu game và chuẩn bị chiến đấu
                    </li>
                  </ol>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Luật chơi:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <Swords className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Trả lời đúng để tấn công đội khác 10% HP</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>Tối đa 30% sát thương mỗi lượt cho 1 đội</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Heart className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Đội có thể được hồi máu 5% từ câu trả lời đặc biệt</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span>20 giây để suy nghĩ, trả lời nhanh có điểm bonus</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="text-center space-y-4">
            <p className="text-gray-600">Bạn là host?</p>
            <Button asChild variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
              <Link href="/host">
                <Crown className="w-4 h-4 mr-2" />
                Tạo & Quản lý phòng game
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}