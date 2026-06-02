'use client';

import { useAuth } from '@/hooks/useAuth';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { User, Mail, Globe, Calendar, LogOut, Moon, Sun, Monitor } from 'lucide-react';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!user) return null;

  const themeOptions = [
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-semibold">Settings</h1>

      {/* Theme Selector */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Moon className="h-4 w-4 text-islamic-emerald" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {themeOptions.map(({ value, label, icon: Icon }) => (
              <Button
                key={value}
                variant={mounted && theme === value ? 'default' : 'outline'}
                className={`h-auto py-3 flex flex-col items-center gap-1.5 ${
                  mounted && theme === value ? 'bg-primary text-primary-foreground' : ''
                }`}
                onClick={() => setTheme(value)}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Profile Card */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/30">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-2xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-2 text-muted-foreground text-xs">
                <User className="h-3.5 w-3.5" /> Name
              </Label>
              <p className="font-medium text-sm">{user.name}</p>
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-2 text-muted-foreground text-xs">
                <Mail className="h-3.5 w-3.5" /> Email
              </Label>
              <p className="font-medium text-sm">{user.email}</p>
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-2 text-muted-foreground text-xs">
                <User className="h-3.5 w-3.5" /> Gender
              </Label>
              <p className="font-medium text-sm">{user.gender || 'Not set'}</p>
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-2 text-muted-foreground text-xs">
                <Globe className="h-3.5 w-3.5" /> Timezone
              </Label>
              <p className="font-medium text-sm">{user.timezone}</p>
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-2 text-muted-foreground text-xs">
                <Calendar className="h-3.5 w-3.5" /> Member since
              </Label>
              <p className="font-medium text-sm">
                {format(new Date(user.createdAt), 'MMMM d, yyyy')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        variant="outline"
        className="w-full h-12 text-muted-foreground hover:text-destructive hover:border-destructive/30"
        onClick={() => logout()}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
}