import { useState } from "react";
import { Battery, Wifi, Signal, Phone as PhoneIcon, Camera, Image, FileText, Settings, Chrome, Youtube, Instagram, MessageCircle, Mic, X, MapPin, Lock, PhoneMissed, PhoneIncoming, PhoneOutgoing } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Screen = "lock" | "home" | "messages" | "conversation" | "gallery" | "notes" | "phone" | "recorder";
type ConversationId = "unknown" | "meenakshi";

export default function Phone() {
  const [screen, setScreen] = useState<Screen>("lock");
  const [prevScreen, setPrevScreen] = useState<Screen>("lock");
  const [password, setPassword] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [activeConversation, setActiveConversation] = useState<ConversationId | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const correctPassword = "0712";

  const transitionTo = (newScreen: Screen) => {
    setIsTransitioning(true);
    setPrevScreen(screen);
    setTimeout(() => {
      setScreen(newScreen);
      setTimeout(() => setIsTransitioning(false), 100);
    }, 200);
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      transitionTo("home");
      setPassword("");
      setAttempts(0);
    } else {
      setAttempts(prev => prev + 1);
      setPassword("");
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
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      {/* Phone Frame */}
      <div className="relative w-full max-w-[400px] h-[800px] bg-samsung-bg rounded-[48px] shadow-phone overflow-hidden border-8 border-gray-900">
        {/* Punch Hole Camera */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-3 h-3 bg-black rounded-full z-50 border border-gray-800" />
        
        {/* Status Bar */}
        <div className="absolute top-0 left-0 right-0 h-12 px-6 flex items-center justify-between text-white z-40">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-light">
              {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Signal className="w-4 h-4" />
            <Wifi className="w-4 h-4" />
            <Battery className="w-4 h-4" />
            <span className="text-xs">47%</span>
          </div>
        </div>

        {/* Screen Content */}
        <div className="absolute inset-0 pt-12">
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
        <div className="absolute inset-0 pointer-events-none rounded-[40px]" style={{
          background: 'radial-gradient(ellipse at top, rgba(30, 136, 229, 0.1) 0%, transparent 50%)',
        }} />
      </div>
    </div>
  );
}

function LockScreen({ password, setPassword, handleUnlock, attempts }: {
  password: string;
  setPassword: (p: string) => void;
  handleUnlock: (e: React.FormEvent) => void;
  attempts: number;
}) {
  const now = new Date();
  
  return (
    <div className="h-full flex flex-col items-center justify-between py-20 px-6 bg-gradient-to-b from-samsung-bg via-samsung-surface to-samsung-bg">
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Clock */}
        <div className="text-center mb-8">
          <div className="text-8xl font-extralight text-white mb-2" data-testid="lock-time">
            {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
          </div>
          <div className="text-lg text-gray-400" data-testid="lock-date">
            {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Notifications Stack */}
        <div className="space-y-3">
          <div className="bg-samsung-surface/80 backdrop-blur-md rounded-2xl px-6 py-4 border border-gray-800" data-testid="notification-messages">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-samsung-green flex items-center justify-center shadow-lg">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-white font-medium" data-testid="notification-title">Messages</div>
                <div className="text-sm text-gray-400" data-testid="notification-preview">2 new messages</div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-gray-500 text-sm flex items-center justify-center gap-2" data-testid="swipe-indicator">
              <div className="w-6 h-1 bg-gray-700 rounded-full" />
              <span>Swipe up to unlock</span>
            </div>
          </div>
        </div>
      </div>

      {/* PIN Keypad */}
      <div className="w-full space-y-6">
        {/* PIN Display */}
        <div className="flex justify-center gap-3 mb-8">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 transition-all ${
                i < password.length ? 'bg-white border-white' : 'border-gray-600'
              }`}
            />
          ))}
        </div>

        {attempts > 0 && (
          <div className="text-red-400 text-sm text-center mb-4" data-testid="text-error">
            Incorrect PIN. {attempts >= 3 ? "Hint: Try 0712" : `${attempts} attempt(s)`}
          </div>
        )}

        {/* Number Pad */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              data-testid={`key-${num}`}
              onClick={() => {
                if (password.length < 4) {
                  const newPassword = password + num;
                  setPassword(newPassword);
                  if (newPassword.length === 4) {
                    setTimeout(() => {
                      const e = { preventDefault: () => {} } as React.FormEvent;
                      handleUnlock(e);
                    }, 100);
                  }
                }
              }}
              className="h-16 rounded-2xl bg-samsung-surface/40 backdrop-blur-md border border-gray-700 text-white text-2xl font-light active-elevate-2 transition-transform active:scale-95"
            >
              {num}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div />
          <button
            data-testid="key-0"
            onClick={() => {
              if (password.length < 4) {
                const newPassword = password + '0';
                setPassword(newPassword);
                if (newPassword.length === 4) {
                  setTimeout(() => {
                    const e = { preventDefault: () => {} } as React.FormEvent;
                    handleUnlock(e);
                  }, 100);
                }
              }
            }}
            className="h-16 rounded-2xl bg-samsung-surface/40 backdrop-blur-md border border-gray-700 text-white text-2xl font-light active-elevate-2 transition-transform active:scale-95"
          >
            0
          </button>
          <button
            data-testid="key-delete"
            onClick={() => setPassword(password.slice(0, -1))}
            className="h-16 rounded-2xl bg-samsung-surface/40 backdrop-blur-md border border-gray-700 text-white text-xl active-elevate-2 transition-transform active:scale-95"
          >
            ⌫
          </button>
        </div>

        <div className="text-center mt-6 text-sm text-gray-500">
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
    { name: "Phone", icon: PhoneIcon, color: "bg-blue-500", onClick: openPhone, testId: "app-phone" },
    { name: "Messages", icon: MessageCircle, color: "bg-samsung-green", onClick: openMessages, testId: "app-messages" },
    { name: "Camera", icon: Camera, color: "bg-gray-600", onClick: () => {}, testId: "app-camera" },
    { name: "Gallery", icon: Image, color: "bg-purple-500", onClick: openGallery, testId: "app-gallery" },
    { name: "Notes", icon: FileText, color: "bg-yellow-600", onClick: openNotes, testId: "app-notes" },
    { name: "Chrome", icon: Chrome, color: "bg-red-500", onClick: () => {}, testId: "app-chrome" },
    { name: "YouTube", icon: Youtube, color: "bg-red-600", onClick: () => {}, testId: "app-youtube" },
    { name: "Instagram", icon: Instagram, color: "bg-pink-500", onClick: () => {}, testId: "app-instagram" },
    { name: "WhatsApp", icon: MessageCircle, color: "bg-green-600", onClick: () => {}, testId: "app-whatsapp" },
    { name: "Settings", icon: Settings, color: "bg-gray-700", onClick: () => {}, testId: "app-settings" },
    { name: "Recorder", icon: Mic, color: "bg-orange-500", onClick: openRecorder, testId: "app-recorder" },
  ];

  return (
    <div className="h-full bg-samsung-bg px-6 py-8 overflow-y-auto">
      {/* Widget Area */}
      <div className="mb-8 space-y-4">
        {/* Clock Widget */}
        <div className="bg-samsung-surface rounded-3xl p-6 border border-gray-800 shadow-lg" data-testid="widget-clock">
          <div className="text-6xl font-extralight text-white mb-2" data-testid="home-time">
            {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
          </div>
          <div className="text-gray-400" data-testid="home-date">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Battery & Weather Widget */}
        <div className="bg-samsung-surface rounded-3xl p-4 border border-gray-800 shadow-lg" data-testid="widget-info">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-900/30 flex items-center justify-center">
                <Battery className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Battery</div>
                <div className="text-lg text-white font-medium" data-testid="battery-level">47%</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center">
                <Wifi className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-sm text-gray-400">WiFi</div>
                <div className="text-sm text-white font-medium" data-testid="wifi-status">Connected</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* App Grid */}
      <div className="grid grid-cols-4 gap-6 mb-24">
        {apps.map((app) => {
          const Icon = app.icon;
          return (
            <button
              key={app.name}
              data-testid={app.testId}
              onClick={app.onClick}
              className="flex flex-col items-center gap-2 active-elevate-2 transition-transform active:scale-95"
            >
              <div className={`w-14 h-14 ${app.color} rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                <Icon className="w-7 h-7 text-white relative z-10" />
              </div>
              <span className="text-xs text-white text-center leading-tight" data-testid={`${app.testId}-label`}>{app.name}</span>
            </button>
          );
        })}
      </div>

      {/* Dock */}
      <div className="fixed bottom-6 left-6 right-6 bg-samsung-surface/90 backdrop-blur-xl rounded-3xl p-4 border border-gray-800 shadow-2xl">
        <div className="flex justify-around">
          <button data-testid="dock-phone" onClick={openPhone} className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg active-elevate-2 transition-transform active:scale-95">
            <PhoneIcon className="w-6 h-6 text-white" />
          </button>
          <button data-testid="dock-messages" onClick={openMessages} className="w-12 h-12 bg-samsung-green rounded-2xl flex items-center justify-center shadow-lg active-elevate-2 transition-transform active:scale-95">
            <MessageCircle className="w-6 h-6 text-white" />
          </button>
          <button data-testid="dock-camera" className="w-12 h-12 bg-gray-600 rounded-2xl flex items-center justify-center shadow-lg active-elevate-2 transition-transform active:scale-95">
            <Camera className="w-6 h-6 text-white" />
          </button>
          <button data-testid="dock-chrome" className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center shadow-lg active-elevate-2 transition-transform active:scale-95">
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
  const conversations = [
    {
      id: "unknown" as const,
      name: "Unknown Number",
      preview: "I KNOW YOUR SECRET...",
      time: "10:47 PM",
      unread: true,
    },
    {
      id: "meenakshi" as const,
      name: "Meenakshi",
      preview: "SORRY I SHOULDN'T HAVE...",
      time: "8:23 PM",
      unread: true,
    },
  ];

  return (
    <div className="h-full bg-samsung-bg flex flex-col">
      {/* Header */}
      <div className="bg-samsung-surface border-b border-gray-800 px-4 py-4 flex items-center gap-4">
        <button 
          data-testid="button-back"
          onClick={goBack}
          className="text-samsung-blue text-2xl hover-elevate p-2 rounded-lg"
        >
          ←
        </button>
        <h1 className="text-xl font-medium text-white">Messages</h1>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conv) => (
          <button
            key={conv.id}
            data-testid={`conversation-${conv.id}`}
            onClick={() => openConversation(conv.id)}
            className="w-full px-4 py-4 border-b border-gray-800 hover-elevate flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-white text-xl">
              {conv.name[0]}
            </div>
            <div className="flex-1 text-left">
              <div className="flex justify-between items-start mb-1">
                <div className="font-medium text-white">{conv.name}</div>
                <div className="text-xs text-gray-400">{conv.time}</div>
              </div>
              <div className="text-sm text-gray-400 truncate" data-testid={`${conv.id}-preview`}>{conv.preview}</div>
            </div>
            {conv.unread && (
              <div className="w-2 h-2 rounded-full bg-samsung-blue" />
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
  const conversations = {
    unknown: {
      name: "Unknown Number",
      messages: [
        { 
          text: "I KNOW YOUR SECRET AND I WON'T LET YOU GO", 
          sent: true, 
          time: "10:47 PM",
          id: "msg-unknown-1"
        },
      ],
    },
    meenakshi: {
      name: "Meenakshi",
      messages: [
        { 
          text: "SORRY I SHOULDN'T HAVE HACKED YOUR PHONE", 
          sent: false, 
          time: "8:23 PM",
          id: "msg-meenakshi-1"
        },
      ],
    },
  };

  const conversation = conversations[conversationId];

  return (
    <div className="h-full bg-samsung-bg flex flex-col">
      {/* Header */}
      <div className="bg-samsung-surface border-b border-gray-800 px-4 py-4 flex items-center gap-4">
        <button 
          data-testid="button-back-conversation"
          onClick={goBack}
          className="text-samsung-blue text-2xl hover-elevate p-2 rounded-lg"
        >
          ←
        </button>
        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white">
          {conversation.name[0]}
        </div>
        <h1 className="text-lg font-medium text-white">{conversation.name}</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.messages.map((msg) => (
          <div
            key={msg.id}
            data-testid={msg.id}
            className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[75%] rounded-3xl px-4 py-3 shadow-message ${
              msg.sent 
                ? 'bg-samsung-blue text-white rounded-br-md' 
                : 'bg-[#2d2d2d] text-white rounded-bl-md'
            }`}>
              <div className="text-base">{msg.text}</div>
              <div className={`text-xs mt-1 ${msg.sent ? 'text-blue-100' : 'text-gray-400'}`}>
                {msg.time}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input (Non-functional) */}
      <div className="bg-samsung-surface border-t border-gray-800 px-4 py-3">
        <div className="bg-samsung-bg rounded-full px-4 py-3 text-gray-500 border border-gray-700">
          Message (disabled)
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
    <div className="h-full bg-samsung-bg flex flex-col">
      <div className="bg-samsung-surface border-b border-gray-800 px-4 py-4 flex items-center gap-4">
        <button 
          data-testid="button-back-gallery"
          onClick={goBack}
          className="text-samsung-blue text-2xl hover-elevate p-2 rounded-lg"
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
                className={`aspect-square ${photo.color} rounded-2xl flex flex-col items-center justify-center p-4 border border-gray-700 shadow-lg relative overflow-hidden`}
              >
                <IconComponent className="w-16 h-16 text-white/30 mb-3" />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-3">
                  <div className="text-sm text-white font-medium" data-testid={`${photo.id}-title`}>{photo.title}</div>
                  <div className="text-xs text-gray-300" data-testid={`${photo.id}-subtitle`}>{photo.subtitle}</div>
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
      date: "Nov 20"
    },
    { 
      id: "note-2", 
      title: "Meeting at 11 PM", 
      content: "Unknown caller wants to meet. Should I go? This feels dangerous.",
      date: "Nov 21"
    },
  ];

  return (
    <div className="h-full bg-samsung-bg flex flex-col">
      <div className="bg-samsung-surface border-b border-gray-800 px-4 py-4 flex items-center gap-4">
        <button 
          data-testid="button-back-notes"
          onClick={goBack}
          className="text-samsung-blue text-2xl hover-elevate p-2 rounded-lg"
        >
          ←
        </button>
        <h1 className="text-xl font-medium text-white">Notes</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {notes.map((note) => (
          <div
            key={note.id}
            data-testid={note.id}
            className="bg-samsung-surface rounded-2xl p-4 border border-gray-800 shadow-lg"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-white font-medium" data-testid={`${note.id}-title`}>{note.title}</h3>
              <span className="text-xs text-gray-400" data-testid={`${note.id}-date`}>{note.date}</span>
            </div>
            <p className="text-sm text-gray-300" data-testid={`${note.id}-content`}>{note.content}</p>
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
      name: "Unknown Number", 
      type: "missed", 
      time: "10:52 PM",
      duration: "Not answered",
      icon: PhoneMissed
    },
    { 
      id: "call-2", 
      name: "Meenakshi", 
      type: "incoming", 
      time: "8:15 PM",
      duration: "3:42",
      icon: PhoneIncoming
    },
    { 
      id: "call-3", 
      name: "Unknown Number", 
      type: "outgoing", 
      time: "7:30 PM",
      duration: "1:15",
      icon: PhoneOutgoing
    },
  ];

  return (
    <div className="h-full bg-samsung-bg flex flex-col">
      <div className="bg-samsung-surface border-b border-gray-800 px-4 py-4 flex items-center gap-4">
        <button 
          data-testid="button-back-phone"
          onClick={goBack}
          className="text-samsung-blue text-2xl hover-elevate p-2 rounded-lg"
        >
          ←
        </button>
        <h1 className="text-xl font-medium text-white">Recent Calls</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {calls.map((call) => {
          const CallIcon = call.icon;
          return (
            <div
              key={call.id}
              data-testid={call.id}
              className="px-4 py-4 border-b border-gray-800 flex items-center gap-4 hover-elevate"
            >
              <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                <CallIcon className={`w-5 h-5 ${call.type === 'missed' ? 'text-red-400' : 'text-samsung-blue'}`} />
              </div>
              <div className="flex-1">
                <div className="text-white font-medium" data-testid={`${call.id}-name`}>{call.name}</div>
                <div className="text-sm text-gray-400" data-testid={`${call.id}-duration`}>{call.duration}</div>
              </div>
              <div className="text-xs text-gray-400" data-testid={`${call.id}-time`}>{call.time}</div>
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
      date: "Nov 20, 11:15 PM",
      corrupted: true
    },
  ];

  return (
    <div className="h-full bg-samsung-bg flex flex-col">
      <div className="bg-samsung-surface border-b border-gray-800 px-4 py-4 flex items-center gap-4">
        <button 
          data-testid="button-back-recorder"
          onClick={goBack}
          className="text-samsung-blue text-2xl hover-elevate p-2 rounded-lg"
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
            className={`bg-samsung-surface rounded-2xl p-4 border ${rec.corrupted ? 'border-red-900' : 'border-gray-800'} shadow-lg`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full ${rec.corrupted ? 'bg-red-900' : 'bg-orange-600'} flex items-center justify-center`}>
                <Mic className="w-6 h-6 text-white" />
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
