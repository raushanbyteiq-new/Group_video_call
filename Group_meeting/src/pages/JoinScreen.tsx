import { useState } from "react";
import { Video, Mic, ArrowRight } from "lucide-react";

export const JoinScreen = ({ onJoin }: { onJoin: (token: string) => void }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // POINT THIS TO YOUR NGROK URL IF TESTING WITH FRIENDS
      const res = await fetch(
        "https://cortez-dineric-superurgently.ngrok-free.dev/getToken",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomName: room, participantName: name }),
        }
      );
      const data = await res.json();
      onJoin(data.token);
    } catch (err) {
      alert("Failed to join server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-neutral-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center gap-3 text-blue-500 mb-4">
            <Video size={40} /> <Mic size={40} />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            AI Video Chat
          </h1>
          <p className="text-neutral-400">
            Real-time translation & Smart Layouts
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-neutral-900 p-8 rounded-2xl border border-neutral-800"
        >
          <div>
            <label className="text-neutral-400 text-xs uppercase font-semibold">
              Your Name
            </label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-neutral-950 text-white border border-neutral-800 rounded-lg p-3 mt-1 focus:ring-2 ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="text-neutral-400 text-xs uppercase font-semibold">
              Room Name (Create or Join)
            </label>
            <input
              required
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="w-full bg-neutral-950 text-white border border-neutral-800 rounded-lg p-3 mt-1 focus:ring-2 ring-blue-500 outline-none"
            />
          </div>
          <button
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
          >
            {isLoading ? (
              "Connecting..."
            ) : (
              <>
                Join Meeting <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
