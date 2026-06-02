'use client';

import { useState } from 'react';
import { Pencil, X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { streaksService } from '@/services/streaks.service';

interface MilestoneRewardInputProps {
  milestoneId: string;
  currentReward: string | null;
}

export function MilestoneRewardInput({ milestoneId, currentReward }: MilestoneRewardInputProps) {
  const [editing, setEditing] = useState(false);
  const [reward, setReward] = useState(currentReward || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!reward.trim()) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      await streaksService.setMilestoneReward(milestoneId, reward.trim());
      setEditing(false);
    } catch {
      // Silently fail
    } finally {
      setSaving(false);
    }
  };

  if (!editing) {
    return (
      <Button
        variant="ghost"
        size="icon-sm"
        className="shrink-0 text-muted-foreground hover:text-primary"
        onClick={() => setEditing(true)}
      >
        <Pencil className="h-3.5 w-3.5" />
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-1.5 shrink-0" onKeyDown={(e) => e.stopPropagation()}>
      <Input
        value={reward}
        onChange={(e) => setReward(e.target.value)}
        placeholder="Your reward..."
        className="h-8 w-28 text-xs"
        autoFocus
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSave();
          if (e.key === 'Escape') setEditing(false);
        }}
      />
      <Button
        variant="ghost"
        size="icon-sm"
        className="text-primary"
        onClick={handleSave}
        disabled={saving}
      >
        <Save className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        className="text-muted-foreground"
        onClick={() => setEditing(false)}
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}