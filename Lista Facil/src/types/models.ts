export type Task = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  dueDateTime: string | null;
  createdAt: string;
  categoryId: number | null;
  notificationId: string | null;
};

export type Category = {
  id: number;
  name: string;
};

export type TaskStatusFilter = 'all' | 'pending' | 'completed';
