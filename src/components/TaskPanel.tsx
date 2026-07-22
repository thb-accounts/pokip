import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Zap } from 'lucide-react';

export interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  difficulty: 'easy' | 'medium' | 'hard';
  completed?: boolean;
}

interface TaskPanelProps {
  tasks: Task[];
  onCompleteTask: (taskId: string) => void;
}

export const TaskPanel = ({ tasks, onCompleteTask }: TaskPanelProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'hard': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-muted';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return <Target className="w-4 h-4" />;
      case 'medium': return <Zap className="w-4 h-4" />;
      case 'hard': return <Trophy className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  return (
    <Card className="bg-gradient-card border-border/20 shadow-card p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-neon-cyan" />
          <h2 className="text-xl font-bold">Daily Tasks</h2>
          <Badge variant="outline" className="border-neon-cyan text-neon-cyan">
            {tasks.filter(t => !t.completed).length} remaining
          </Badge>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div 
              key={task.id}
              className={`p-4 rounded-lg border transition-all duration-300 ${
                task.completed 
                  ? 'bg-muted/30 border-muted opacity-60' 
                  : 'bg-card/50 border-border/40 hover:border-neon-cyan/30'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${task.completed ? 'line-through' : ''}`}>
                      {task.title}
                    </span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getDifficultyColor(task.difficulty)}`}
                    >
                      <span className="flex items-center gap-1">
                        {getDifficultyIcon(task.difficulty)}
                        {task.difficulty}
                      </span>
                    </Badge>
                  </div>
                  <p className={`text-sm text-muted-foreground ${task.completed ? 'line-through' : ''}`}>
                    {task.description}
                  </p>
                  <div className="flex items-center gap-1">
                    <span className="text-neon-cyan font-semibold">+{task.reward}</span>
                    <span className="text-xs text-muted-foreground">tokens</span>
                  </div>
                </div>
                
                {!task.completed && (
                  <Button
                    variant="gaming"
                    size="sm"
                    onClick={() => onCompleteTask(task.id)}
                    className="shrink-0"
                  >
                    Complete
                  </Button>
                )}
                
                {task.completed && (
                  <Badge variant="outline" className="border-green-500 text-green-400 shrink-0">
                    ✓ Done
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};