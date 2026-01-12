import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Home, User, Map as MapIcon, Calendar, MessageCircle, Trophy } from 'lucide-react';
import { cn } from "@/lib/utils";
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

const levelColors = {
  beginner: '#FCF1C3',
  intermediate: '#FC0D0F',
  advanced: '#FF1B4C',
  elite: '#C0C0C0'
};

const navItems = [
  { name: 'Home', icon: Home, path: 'Home' },
  { name: 'Daily', icon: Calendar, path: 'DailyTasks' },
  { name: 'Community', icon: MessageCircle, path: 'Community' },
  { name: 'Leaderboard', icon: Trophy, path: 'Leaderboard' },
  { name: 'Map', icon: MapIcon, path: 'Map' },
  { name: 'Profile', icon: User, path: 'Profile' }
];

export default function Layout({ children, currentPageName }) {
  const hideNav = currentPageName === 'Assessment' || currentPageName === 'Map' || currentPageName === 'Community';

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
    retry: false
  });

  const { data: profile } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: async () => {
      const profiles = await base44.entities.UserProfile.filter({ user_id: user.email });
      return profiles[0] || null;
    },
    enabled: !!user?.email,
    retry: false
  });

  const currentLevel = profile?.level || 'beginner';
  const levelColor = levelColors[currentLevel];

  return (
    <div className="min-h-screen bg-black">
      <style>{`
        :root {
          --background: 0 0% 0%;
          --foreground: 0 0% 100%;
          --card: 0 0% 10%;
          --card-foreground: 0 0% 100%;
          --popover: 0 0% 10%;
          --popover-foreground: 0 0% 100%;
          --primary: 84 81% 58%;
          --primary-foreground: 0 0% 0%;
          --secondary: 0 0% 15%;
          --secondary-foreground: 0 0% 100%;
          --muted: 0 0% 15%;
          --muted-foreground: 0 0% 60%;
          --accent: 0 0% 15%;
          --accent-foreground: 0 0% 100%;
          --destructive: 0 84% 60%;
          --destructive-foreground: 0 0% 100%;
          --border: 0 0% 20%;
          --input: 0 0% 15%;
          --ring: 84 81% 58%;
        }
        
        * {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
      `}</style>
      
      {children}

      {/* Bottom Navigation */}
      {!hideNav && (
        <nav className="fixed bottom-4 left-0 right-0 safe-area-pb z-50">
          <div className="max-w-2xl mx-auto px-6">
            <div className="bg-zinc-900/95 backdrop-blur-lg rounded-full border border-zinc-800 shadow-2xl p-2">
              <div className="flex items-center justify-around">
                {navItems.map((item) => {
                  const isActive = currentPageName === item.path;
                  
                  return (
                    <Link
                      key={item.name}
                      to={createPageUrl(item.path)}
                      className={cn(
                        "flex items-center justify-center w-14 h-14 rounded-full transition-all duration-200",
                        isActive 
                          ? "" 
                          : "bg-transparent hover:bg-zinc-800"
                      )}
                      style={isActive ? { backgroundColor: levelColor } : {}}
                    >
                      <item.icon className={cn(
                        "w-6 h-6",
                        isActive ? "text-black" : "text-zinc-400"
                      )} />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}