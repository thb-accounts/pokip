import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, query, where } from 'firebase/firestore';
import { useFirebaseAuth } from './useFirebaseAuth';

interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  difficulty: 'easy' | 'medium' | 'hard';
  is_active: boolean;
  created_at: string;
  completed?: boolean;
}

export const useTasks = () => {
  const { user } = useFirebaseAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTasks();
    } else {
      setTasks([]);
      setLoading(false);
    }
  }, [user]);

  const fetchTasks = async () => {
    if (!user) return;

    try {
      // Get all active tasks
      const tasksQuery = query(collection(db, 'tasks'), where('is_active', '==', true));
      const tasksSnapshot = await getDocs(tasksQuery);
      const allTasks = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Task[];

      // Get user's completed tasks
      const completionsQuery = query(collection(db, 'user_task_completions'), where('user_id', '==', user.uid));
      const completionsSnapshot = await getDocs(completionsQuery);
      const completedTaskIds = new Set(completionsSnapshot.docs.map(doc => doc.data().task_id));

      const tasksWithCompletion = allTasks.map(task => ({
        ...task,
        difficulty: task.difficulty as 'easy' | 'medium' | 'hard',
        completed: completedTaskIds.has(task.id),
      }));

      setTasks(tasksWithCompletion);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (taskId: string) => {
    if (!user) return;

    try {
      const completionId = `${user.uid}_${taskId}`;
      const docRef = doc(db, 'user_task_completions', completionId);
      await setDoc(docRef, {
        user_id: user.uid,
        task_id: taskId,
        completed_at: new Date().toISOString(),
      });

      // Update local state
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, completed: true } : task
      ));

      return true;
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  };

  return {
    tasks,
    loading,
    completeTask,
    refetch: fetchTasks,
  };
};