import { useState, useEffect } from "react";
import { Battery, Wifi, Signal, Phone as PhoneIcon, Camera, Image, FileText, Settings, Chrome, Youtube, Instagram, MessageCircle, Mic, X, MapPin, Lock, PhoneMissed, PhoneIncoming, PhoneOutgoing, Heart, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Screen = "lock" | "home" | "messages" | "conversation" | "gallery" | "notes" | "phone" | "recorder";
type ConversationId = "unknown" | "meenakshi" | "rithika" | "random1" | "random2" | "random3";

export default function Phone() {
  const [screen, setScreen] = useState<Screen>("lock");
  const [prevScreen, setPrevScreen] = useState<Screen>("lock");
  const [password, setPassword] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [activeConversation, setActiveConversation] = useState<ConversationId | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const correctPassword = "0712";

  const transitionTo = (newScreen: Screen) => {
    setIsTransitioning(true);
    setPrevScreen(screen);
    setTimeout(() => {
      setScreen(newScreen);
      setTimeout(() => setIsTransitioning(false), 100);
    }, 200);
  };

  // Lockout timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLocked && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isLocked) {
      setIsLocked(false);
      setAttempts(0);
    }
    return () => clearInterval(timer);
  }, [isLocked, timeLeft]);

  const handleUnlock = (e: React.FormEvent, pinToCheck?: string) => {
    e.preventDefault();
    if (isLocked) return;

    const checkPassword = pinToCheck || password;
    if (checkPassword === correctPassword) {
      transitionTo("home");
      setPassword("");
      setAttempts(0);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setPassword("");

      if (newAttempts >= 5) {
        setIsLocked(true);
        setTimeLeft(300); // 5 minutes in seconds
      }
    }
  };

  const openMessages = () => transitionTo("messages");
  const openGallery = () => transitionTo("gallery");
  const openNotes = () => transitionTo("notes");
  const openPhone = () => transitionTo("phone");
  const openRecorder = () => transitionTo("recorder");

  const openConversation = (id: ConversationId) => {
    setActiveConversation(id);
    transitionTo("conversation");
  };

  const goBack = () => {
    if (screen === "conversation") {
      transitionTo("messages");
      setActiveConversation(null);
    } else {
      transitionTo("home");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 p-4">
      {/* Phone Frame */}
      <div className="relative w-full max-w-[400px] h-[800px] bg-black rounded-[48px] shadow-2xl border-[8px] border-gray-900 ring-4 ring-pink-500/30">

        {/* Hardware Buttons */}
        {/* Volume Up */}
        <div className="absolute -left-[12px] top-24 w-[4px] h-12 bg-gray-800 rounded-l-md shadow-sm" />
        {/* Volume Down */}
        <div className="absolute -left-[12px] top-40 w-[4px] h-12 bg-gray-800 rounded-l-md shadow-sm" />
        {/* Power Button */}
        <div
          className="absolute -right-[12px] top-32 w-[4px] h-16 bg-gray-800 rounded-r-md shadow-sm cursor-pointer active:scale-95 transition-transform"
          onClick={() => setScreen("lock")}
        />

        {/* Dynamic Island */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[120px] h-[35px] bg-black rounded-full z-50 flex items-center justify-center transition-all duration-300 hover:w-[140px] hover:h-[40px] cursor-pointer group">
          <div className="w-full h-full relative flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
            <div className="w-8 h-1 bg-gray-800 rounded-full" />
          </div>
        </div>

        {/* Status Bar */}
        <div className="absolute top-0 left-0 right-0 h-14 px-7 flex items-start justify-between text-white z-40 pt-4">
          <div className="flex items-center gap-1.5 text-xs font-medium">
            <span>
              {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Screen Content */}
        <div className="absolute inset-0 rounded-[40px] overflow-hidden">
          <div
            className="h-full transition-all duration-300 ease-out"
            style={{
              opacity: isTransitioning ? 0 : 1,
              transform: isTransitioning ? 'scale(0.93)' : 'scale(1)',
            }}
          >
            {screen === "lock" && (
              <LockScreen
                password={password}
                setPassword={setPassword}
                handleUnlock={handleUnlock}
                attempts={attempts}
                isLocked={isLocked}
                timeLeft={timeLeft}
              />
            )}

            {screen === "home" && (
              <HomeScreen
                openMessages={openMessages}
                openGallery={openGallery}
                openNotes={openNotes}
                openPhone={openPhone}
                openRecorder={openRecorder}
              />
            )}

            {screen === "messages" && (
              <MessagesScreen
                openConversation={openConversation}
                goBack={goBack}
              />
            )}

            {screen === "conversation" && activeConversation && (
              <ConversationScreen
                conversationId={activeConversation}
                goBack={goBack}
              />
            )}

            {screen === "gallery" && <GalleryScreen goBack={goBack} />}
            {screen === "notes" && <NotesScreen goBack={goBack} />}
            {screen === "phone" && <PhoneAppScreen goBack={goBack} />}
            {screen === "recorder" && <RecorderScreen goBack={goBack} />}
          </div>
        </div>

        {/* Edge Glow Effect */}
        <div className="absolute inset-0 pointer-events-none rounded-[40px] ring-1 ring-white/10" style={{
          background: 'radial-gradient(ellipse at top, rgba(236, 72, 153, 0.1) 0%, transparent 60%)',
        }} />
      </div>
    </div>
  );
}

function LockScreen({ password, setPassword, handleUnlock, attempts, isLocked, timeLeft }: {
  password: string;
  setPassword: (p: string) => void;
  handleUnlock: (e: React.FormEvent, pinToCheck?: string) => void;
  attempts: number;
  isLocked: boolean;
  timeLeft: number;
}) {
  const now = new Date();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col items-center justify-between py-20 px-6 bg-[url('/lockscreen_capybara.png')] bg-cover bg-center relative">
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[0px]" />

      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        {/* Clock */}
        <div className="text-center mb-8">
          <div className="text-7xl font-thin text-white mb-1 tracking-wider" data-testid="lock-time">
            {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
          </div>
          <div className="text-lg text-white/90 font-light" data-testid="lock-date">
            {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Notifications Stack */}
        <div className="space-y-3 w-full max-w-[300px]">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl px-4 py-3 border border-white/20 shadow-lg" data-testid="notification-messages">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-green-400 to-green-600 flex items-center justify-center shadow-lg">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-white text-sm font-medium" data-testid="notification-title">Messages</div>
                <div className="text-xs text-white/70" data-testid="notification-preview">5 new messages</div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <div className="text-white/60 text-xs flex flex-col items-center gap-2 animate-pulse" data-testid="swipe-indicator">
              <div className="w-8 h-1 bg-white/40 rounded-full" />
              <span>Swipe up to unlock</span>
            </div>
          </div>
        </div>
      </div>

      {/* PIN Keypad */}
      <div className="w-full space-y-6 relative z-10">
        {/* PIN Display */}
        <div className="flex justify-center gap-4 mb-6">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full border transition-all duration-300 ${i < password.length ? 'bg-white border-white scale-110' : 'border-white/50 bg-transparent'
                }`}
            />
          ))}
        </div>

        {isLocked ? (
          <div className="text-red-300 text-sm text-center mb-4 font-medium bg-red-900/60 py-2 px-4 rounded-xl mx-auto w-fit backdrop-blur-md border border-red-500/30">
            <div>Phone Locked</div>
            <div className="text-xl font-bold mt-1">{formatTime(timeLeft)}</div>
          </div>
        ) : attempts > 0 && (
          <div className="text-red-300 text-sm text-center mb-4 font-medium bg-red-900/40 py-1 px-3 rounded-full mx-auto w-fit backdrop-blur-md" data-testid="text-error">
            Incorrect PIN. {attempts} failed attempt(s)
          </div>
        )}

        {/* Number Pad */}
        <div className={`grid grid-cols-3 gap-x-6 gap-y-4 px-4 transition-opacity duration-300 ${isLocked ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              data-testid={`key-${num}`}
              onClick={() => {
                if (password.length < 4 && !isLocked) {
                  const newPassword = password + num;
                  setPassword(newPassword);
                  if (newPassword.length === 4) {
                    setTimeout(() => {
                      const e = { preventDefault: () => { } } as React.FormEvent;
                      handleUnlock(e, newPassword);
                    }, 100);
                  }
                }
              }}
              className="h-16 w-16 mx-auto rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-2xl font-light active:bg-white/30 transition-all active:scale-95 flex items-center justify-center"
              disabled={isLocked}
            >
              {num}
            </button>
          ))}
        </div>

        <div className={`grid grid-cols-3 gap-x-6 gap-y-4 px-4 transition-opacity duration-300 ${isLocked ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          <div />
          <button
            data-testid="key-0"
            onClick={() => {
              if (password.length < 4 && !isLocked) {
                const newPassword = password + '0';
                setPassword(newPassword);
                if (newPassword.length === 4) {
                  setTimeout(() => {
                    const e = { preventDefault: () => { } } as React.FormEvent;
                    handleUnlock(e, newPassword);
                  }, 100);
                }
              }
            }}
            className="h-16 w-16 mx-auto rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-2xl font-light active:bg-white/30 transition-all active:scale-95 flex items-center justify-center"
            disabled={isLocked}
          >
            0
          </button>
          <button
            data-testid="key-delete"
            onClick={() => setPassword(password.slice(0, -1))}
            className="h-16 w-16 mx-auto rounded-full flex items-center justify-center text-white text-xl active:scale-95 transition-transform"
            disabled={isLocked}
          >
            ⌫
          </button>
        </div>

        <div className="text-center mt-4 text-xs text-white font-medium tracking-widest uppercase drop-shadow-md">
          Akriti's Phone
        </div>
      </div>
    </div>
  );
}

function HomeScreen({ openMessages, openGallery, openNotes, openPhone, openRecorder }: {
  openMessages: () => void;
  openGallery: () => void;
  openNotes: () => void;
  openPhone: () => void;
  openRecorder: () => void;
}) {
  const apps = [
    { name: "Phone", icon: PhoneIcon, color: "bg-gradient-to-br from-green-400 to-green-600", onClick: openPhone, testId: "app-phone" },
    { name: "Messages", icon: MessageCircle, color: "bg-gradient-to-br from-blue-400 to-blue-600", onClick: openMessages, testId: "app-messages" },
    { name: "Camera", icon: Camera, color: "bg-gradient-to-br from-gray-700 to-gray-900", onClick: () => { }, testId: "app-camera" },
    { name: "Gallery", icon: Image, color: "bg-gradient-to-br from-pink-400 to-rose-600", onClick: openGallery, testId: "app-gallery" },
    { name: "Notes", icon: FileText, color: "bg-gradient-to-br from-yellow-400 to-orange-500", onClick: openNotes, testId: "app-notes" },
    { name: "Chrome", icon: Chrome, color: "bg-gradient-to-br from-blue-500 to-teal-500", onClick: () => { }, testId: "app-chrome" },
    { name: "YouTube", icon: Youtube, color: "bg-gradient-to-br from-red-500 to-red-700", onClick: () => { }, testId: "app-youtube" },
    { name: "Instagram", icon: Instagram, color: "bg-gradient-to-br from-purple-500 to-pink-500", onClick: () => { }, testId: "app-instagram" },
    { name: "WhatsApp", icon: MessageCircle, color: "bg-gradient-to-br from-green-500 to-emerald-600", onClick: () => { }, testId: "app-whatsapp" },
    { name: "Settings", icon: Settings, color: "bg-gradient-to-br from-gray-600 to-gray-800", onClick: () => { }, testId: "app-settings" },
    { name: "Recorder", icon: Mic, color: "bg-gradient-to-br from-orange-400 to-red-500", onClick: openRecorder, testId: "app-recorder" },
  ];

  return (
    <div className="h-full bg-[url('/wallpaper.png')] bg-cover bg-center px-6 pt-20 pb-8 overflow-y-auto">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] pointer-events-none" />

      <div className="relative z-10">
        {/* Widget Area */}
        <div className="mb-8 space-y-4">
          {/* Clock Widget */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-lg" data-testid="widget-clock">
            <div className="text-5xl font-light text-white mb-1" data-testid="home-time">
              {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
            </div>
            <div className="text-white/80 text-sm font-medium" data-testid="home-date">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
          </div>

          {/* Battery & Weather Widget */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 border border-white/20 shadow-lg" data-testid="widget-info">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Battery className="w-5 h-5 text-green-300" />
                </div>
                <div>
                  <div className="text-xs text-white/60">Battery</div>
                  <div className="text-lg text-white font-medium" data-testid="battery-level">84%</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Wifi className="w-5 h-5 text-blue-300" />
                </div>
                <div>
                  <div className="text-xs text-white/60">WiFi</div>
                  <div className="text-sm text-white font-medium" data-testid="wifi-status">Connected</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* App Grid */}
        <div className="grid grid-cols-4 gap-x-4 gap-y-6 mb-24">
          {apps.map((app) => {
            const Icon = app.icon;
            return (
              <button
                key={app.name}
                data-testid={app.testId}
                onClick={app.onClick}
                className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
              >
                <div className={`w-[3.25rem] h-[3.25rem] ${app.color} rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden group`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50" />
                  <Icon className="w-6 h-6 text-white relative z-10 drop-shadow-md" />
                </div>
                <span className="text-[10px] text-white font-medium text-center leading-tight drop-shadow-md" data-testid={`${app.testId}-label`}>{app.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dock */}
      <div className="fixed bottom-6 left-4 right-4 bg-white/10 backdrop-blur-2xl rounded-[2rem] p-3 border border-white/10 shadow-2xl z-20">
        <div className="flex justify-around items-center">
          <button data-testid="dock-phone" onClick={openPhone} className="w-12 h-12 bg-gradient-to-b from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-transform">
            <PhoneIcon className="w-6 h-6 text-white" />
          </button>
          <button data-testid="dock-messages" onClick={openMessages} className="w-12 h-12 bg-gradient-to-b from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-transform">
            <MessageCircle className="w-6 h-6 text-white" />
          </button>
          <button data-testid="dock-camera" className="w-12 h-12 bg-gradient-to-b from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-transform">
            <Camera className="w-6 h-6 text-white" />
          </button>
          <button data-testid="dock-chrome" className="w-12 h-12 bg-gradient-to-b from-red-400 to-red-600 rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-transform">
            <Chrome className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

function MessagesScreen({ openConversation, goBack }: {
  openConversation: (id: ConversationId) => void;
  goBack: () => void;
}) {
  interface MessagePreview {
    id: ConversationId;
    name: string;
    preview: string;
    time: string;
    unread: boolean;
    color: string;
    avatar?: string;
  }

  const conversations: MessagePreview[] = [
    {
      id: "unknown" as const,
      name: "9876543232",
      preview: "I KNOW UR SECRET AND I WONT LET YOU...",
      time: "10:00 AM",
      unread: true,
      color: "bg-gray-600"
    },
    {
      id: "meenakshi" as const,
      name: "MEENAKSHI",
      preview: "i should not have hacked your phone...",
      time: "8:23 PM",
      unread: true,
      color: "bg-pink-600",
      avatar: "/meenakshi.jpg"
    },
    {
      id: "rithika" as const,
      name: "RITHIKA",
      preview: "you are really outspoken and you have...",
      time: "10:00 AM",
      unread: true,
      color: "bg-purple-600"
    },
    {
      id: "random1" as const,
      name: "Priya",
      preview: "You looked so pretty today! 💖",
      time: "Yesterday",
      unread: false,
      color: "bg-indigo-500"
    },
    {
      id: "random2" as const,
      name: "Mom ❤️",
      preview: "Come home early sweetie",
      time: "Yesterday",
      unread: false,
      color: "bg-rose-500"
    },
    {
      id: "random3" as const,
      name: "Class Group",
      preview: "Notes for tomorrow's lecture?",
      time: "2 days ago",
      unread: false,
      color: "bg-blue-500"
    }
  ];

  return (
    <div className="h-full bg-white flex flex-col pt-14">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-4 shadow-sm z-10">
        <button
          data-testid="button-back"
          onClick={goBack}
          className="text-gray-800 text-2xl hover:bg-gray-100 p-2 rounded-full transition-colors"
        >
          ←
        </button>
        <h1 className="text-xl font-bold text-gray-800">Messages</h1>
        <div className="ml-auto">
          <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-pink-500" />
          </div>
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {conversations.map((conv) => (
          <button
            key={conv.id}
            data-testid={`conversation-${conv.id}`}
            onClick={() => openConversation(conv.id)}
            className={`w-full px-5 py-4 border-b border-gray-100 flex items-center gap-4 hover:bg-white transition-colors ${conv.unread ? 'bg-white' : 'bg-transparent'}`}
          >
            <div className={`w-12 h-12 rounded-full ${conv.color} flex items-center justify-center text-white text-lg font-medium shadow-sm overflow-hidden shrink-0`}>
              {conv.avatar ? (
                <img src={conv.avatar} alt={conv.name} className="w-full h-full object-cover" />
              ) : (
                conv.name[0]
              )}
            </div>
            <div className="flex-1 text-left">
              <div className="flex justify-between items-center mb-1">
                <div className={`font-semibold ${conv.unread ? 'text-gray-900' : 'text-gray-700'}`}>{conv.name}</div>
                <div className={`text-xs whitespace-nowrap ml-2 ${conv.unread ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>{conv.time}</div>
              </div>
              <div className={`text-sm truncate ${conv.unread ? 'text-gray-800 font-medium' : 'text-gray-500'}`} data-testid={`${conv.id}-preview`}>{conv.preview}</div>
            </div>
            {conv.unread && (
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function ConversationScreen({ conversationId, goBack }: {
  conversationId: ConversationId;
  goBack: () => void;
}) {
  interface ConversationData {
    name: string;
    color: string;
    avatar?: string;
    messages: {
      text: string;
      sent: boolean;
      time: string;
      id: string;
    }[];
  }

  const conversations: Record<ConversationId, ConversationData> = {
    unknown: {
      name: "9876543232",
      color: "bg-gray-600",
      messages: [
        {
          text: "I KNOW UR SECRET AND I WONT LET YOU AND SHIVAAY GET AWAY WITH THIS!\nI WILL EXPOSE YOU",
          sent: true,
          time: "10:00 AM",
          id: "msg-unknown-1"
        },
      ],
    },
    meenakshi: {
      name: "MEENAKSHI",
      color: "bg-pink-600",
      avatar: "/meenakshi.jpg",
      messages: [
        {
          text: "i should not have hacked your phone...i was jealous of you.\nyou handle academics so well and my marks are just degrading...I only wanted to know your strategy and routine..nothing else...i m very sorry for what i did...",
          sent: false,
          time: "8:23 PM",
          id: "msg-meenakshi-1"
        },
      ],
    },
    rithika: {
      name: "RITHIKA",
      color: "bg-purple-600",
      messages: [
        {
          text: "where should i meet you",
          sent: false,
          time: "Yesterday, 9:45 PM",
          id: "msg-rithika-1"
        },
        {
          text: "i will see you in college and give you the evidence",
          sent: true,
          time: "Yesterday, 10:30 PM",
          id: "msg-rithika-2"
        },
        {
          text: "you are really outspoken and you have the fire the reveal the truth and so you should join the journalist club...just lmk when will you be free!",
          sent: false,
          time: "10:00 AM",
          id: "msg-rithika-3"
        }
      ]
    },
    random1: {
      name: "Priya",
      color: "bg-indigo-500",
      messages: [
        {
          text: "You looked so pretty today! 💖 That dress really suits you.",
          sent: false,
          time: "Yesterday, 2:15 PM",
          id: "msg-random1-1"
        },
        {
          text: "Aww thank you!! 🥰",
          sent: true,
          time: "Yesterday, 2:20 PM",
          id: "msg-random1-2"
        }
      ]
    },
    random2: {
      name: "Mom ❤️",
      color: "bg-rose-500",
      messages: [
        {
          text: "Come home early sweetie, made your favorite dinner",
          sent: false,
          time: "Yesterday, 6:00 PM",
          id: "msg-random2-1"
        }
      ]
    },
    random3: {
      name: "Class Group",
      color: "bg-blue-500",
      messages: [
        {
          text: "Notes for tomorrow's lecture?",
          sent: false,
          time: "2 days ago",
          id: "msg-random3-1"
        }
      ]
    }
  };

  const conversation = conversations[conversationId];

  return (
    <div className="h-full bg-[#f0f2f5] flex flex-col pt-14">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 shadow-sm z-10">
        <button
          data-testid="button-back-conversation"
          onClick={goBack}
          className="text-blue-500 text-2xl hover:bg-gray-50 p-1 rounded-full transition-colors"
        >
          ←
        </button>
        <div className={`w-9 h-9 rounded-full ${conversation.color} flex items-center justify-center text-white text-sm font-medium overflow-hidden shrink-0`}>
          {conversation.avatar ? (
            <img src={conversation.avatar} alt={conversation.name} className="w-full h-full object-cover" />
          ) : (
            conversation.name[0]
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-base font-semibold text-gray-900 leading-tight">{conversation.name}</h1>
          <div className="text-xs text-gray-500">Mobile</div>
        </div>
        <PhoneIcon className="w-5 h-5 text-blue-500" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat opacity-90">
        {conversation.messages.map((msg) => (
          <div
            key={msg.id}
            data-testid={msg.id}
            className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] rounded-2xl px-4 py-2 shadow-sm ${msg.sent
              ? 'bg-blue-500 text-white rounded-br-none'
              : 'bg-white text-gray-800 rounded-bl-none'
              }`}>
              <div className="text-[15px] leading-snug">{msg.text}</div>
              <div className={`text-[10px] mt-1 text-right ${msg.sent ? 'text-blue-100' : 'text-gray-400'}`}>
                {msg.time}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input (Non-functional) */}
      <div className="bg-white border-t border-gray-200 px-3 py-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
          <Camera className="w-5 h-5" />
        </div>
        <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-gray-400 text-sm border border-transparent">
          Message...
        </div>
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-sm">
          <Mic className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}

function GalleryScreen({ goBack }: { goBack: () => void }) {
  const photos = [
    { id: "photo-1", title: "Deleted Photo", subtitle: "Recovery Failed", color: "bg-gradient-to-br from-red-950 to-red-900", icon: "X" },
    { id: "photo-2", title: "Unknown Location", subtitle: "Nov 21, 10:45 PM", color: "bg-gradient-to-br from-gray-800 to-gray-900", icon: "MapPin" },
    { id: "photo-3", title: "Screenshot", subtitle: "Encrypted Message", color: "bg-gradient-to-br from-blue-950 to-blue-900", icon: "Lock" },
  ];

  return (
    <div className="h-full bg-black flex flex-col pt-14">
      <div className="bg-black/50 backdrop-blur-md border-b border-white/10 px-4 py-4 flex items-center gap-4 z-10">
        <button
          data-testid="button-back-gallery"
          onClick={goBack}
          className="text-white text-2xl hover:bg-white/10 p-2 rounded-lg transition-colors"
        >
          ←
        </button>
        <h1 className="text-xl font-medium text-white">Gallery</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-4">
          {photos.map((photo) => {
            const IconComponent = photo.icon === "X" ? X : photo.icon === "MapPin" ? MapPin : Lock;
            return (
              <div
                key={photo.id}
                data-testid={photo.id}
                className={`aspect-square ${photo.color} rounded-2xl flex flex-col items-center justify-center p-4 border border-white/10 shadow-lg relative overflow-hidden group`}
              >
                <IconComponent className="w-12 h-12 text-white/50 mb-3 group-hover:scale-110 transition-transform" />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-3">
                  <div className="text-sm text-white font-medium truncate" data-testid={`${photo.id}-title`}>{photo.title}</div>
                  <div className="text-[10px] text-gray-300" data-testid={`${photo.id}-subtitle`}>{photo.subtitle}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function NotesScreen({ goBack }: { goBack: () => void }) {
  const notes = [
    {
      id: "note-1",
      title: "I can't trust anyone anymore",
      content: "Someone knows what I did. They're watching me. I need to be careful.",
      date: "Nov 20",
      color: "bg-yellow-100"
    },
    {
      id: "note-2",
      title: "Meeting at 11 PM",
      content: "Unknown caller wants to meet. Should I go? This feels dangerous.",
      date: "Nov 21",
      color: "bg-pink-100"
    },
    {
      id: "note-3",
      title: "Parcel the evidence to Rithika",
      content: "Nov 24th, 10:30 PM - Need to send the evidence package to Rithika",
      date: "Nov 24",
      color: "bg-blue-100"
    },
  ];

  return (
    <div className="h-full bg-white flex flex-col pt-14">
      <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-4 shadow-sm z-10">
        <button
          data-testid="button-back-notes"
          onClick={goBack}
          className="text-gray-800 text-2xl hover:bg-gray-100 p-2 rounded-lg transition-colors"
        >
          ←
        </button>
        <h1 className="text-xl font-bold text-gray-800">Notes</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {notes.map((note) => (
          <div
            key={note.id}
            data-testid={note.id}
            className={`${note.color} rounded-2xl p-5 border border-transparent shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-gray-900 font-bold text-lg" data-testid={`${note.id}-title`}>{note.title}</h3>
              <span className="text-xs text-gray-500 font-medium" data-testid={`${note.id}-date`}>{note.date}</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed" data-testid={`${note.id}-content`}>{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhoneAppScreen({ goBack }: { goBack: () => void }) {
  const calls = [
    {
      id: "call-1",
      name: "9876543232",
      type: "missed",
      time: "10:52 PM",
      duration: "Not answered",
      icon: PhoneMissed
    },
    {
      id: "call-2",
      name: "MEENAKSHI",
      type: "incoming",
      time: "8:15 PM",
      duration: "3:42",
      icon: PhoneIncoming
    },
    {
      id: "call-3",
      name: "RITHIKA",
      type: "outgoing",
      time: "7:30 PM",
      duration: "1:15",
      icon: PhoneOutgoing
    },
  ];

  return (
    <div className="h-full bg-white flex flex-col pt-14">
      <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-4 shadow-sm z-10">
        <button
          data-testid="button-back-phone"
          onClick={goBack}
          className="text-gray-800 text-2xl hover:bg-gray-100 p-2 rounded-lg transition-colors"
        >
          ←
        </button>
        <h1 className="text-xl font-bold text-gray-800">Recents</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {calls.map((call) => {
          const CallIcon = call.icon;
          return (
            <div
              key={call.id}
              data-testid={call.id}
              className="px-5 py-4 border-b border-gray-100 flex items-center gap-4 hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <CallIcon className={`w-5 h-5 ${call.type === 'missed' ? 'text-red-500' : 'text-green-600'}`} />
              </div>
              <div className="flex-1">
                <div className={`font-semibold ${call.type === 'missed' ? 'text-red-500' : 'text-gray-900'}`} data-testid={`${call.id}-name`}>{call.name}</div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <span>{call.type === 'missed' ? 'Missed call' : call.type === 'incoming' ? 'Incoming call' : 'Outgoing call'}</span>
                  <span>•</span>
                  <span data-testid={`${call.id}-duration`}>{call.duration}</span>
                </div>
              </div>
              <div className="text-xs text-gray-400 font-medium" data-testid={`${call.id}-time`}>{call.time}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RecorderScreen({ goBack }: { goBack: () => void }) {
  const recordings = [
    {
      id: "recording-1",
      title: "Conversation with Unknown",
      duration: "2:34",
      date: "Nov 21, 10:50 PM"
    },
    {
      id: "recording-2",
      title: "Deleted Recording",
      duration: "Unknown",
      date: "Nov 24, 12:05 PM",
      corrupted: true
    },
  ];

  return (
    <div className="h-full bg-black flex flex-col pt-14">
      <div className="bg-black/50 backdrop-blur-md border-b border-white/10 px-4 py-4 flex items-center gap-4 z-10">
        <button
          data-testid="button-back-recorder"
          onClick={goBack}
          className="text-white text-2xl hover:bg-white/10 p-2 rounded-lg transition-colors"
        >
          ←
        </button>
        <h1 className="text-xl font-medium text-white">Voice Recorder</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {recordings.map((rec) => (
          <div
            key={rec.id}
            data-testid={rec.id}
            className={`bg-white/5 rounded-2xl p-4 border ${rec.corrupted ? 'border-red-900/50' : 'border-white/10'} shadow-lg`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full ${rec.corrupted ? 'bg-red-900/20' : 'bg-red-500/20'} flex items-center justify-center`}>
                <Mic className={`w-6 h-6 ${rec.corrupted ? 'text-red-500' : 'text-red-500'}`} />
              </div>
              <div className="flex-1">
                <h3 className={`${rec.corrupted ? 'text-red-400' : 'text-white'} font-medium mb-1`} data-testid={`${rec.id}-title`}>
                  {rec.title}
                </h3>
                <div className="text-xs text-gray-400" data-testid={`${rec.id}-date`}>{rec.date}</div>
              </div>
              <div className="text-sm text-gray-300" data-testid={`${rec.id}-duration`}>{rec.duration}</div>
            </div>
            {rec.corrupted && (
              <div className="mt-3 text-xs text-red-400 bg-red-950/30 rounded-lg px-3 py-2 flex items-center gap-2">
                <X className="w-4 h-4" />
                <span>File corrupted - Unable to play</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
