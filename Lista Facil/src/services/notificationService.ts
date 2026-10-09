import { Platform } from 'react-native';

/**
 * Notifications are intentionally loaded lazily.
 * This project only uses local scheduled notifications. We never request
 * Expo push tokens, register a device for remote push, or add a push-token listener.
 * Lazy loading also keeps Expo Go from evaluating push-related APIs at app startup.
 */
async function getNotifications() {
  return import('expo-notifications');
}

async function ensureNotificationHandler() {
  const Notifications = await getNotifications();
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
  return Notifications;
}

export async function configureNotifications() {
  if (Platform.OS !== 'android') return;

  const Notifications = await getNotifications();
  await Notifications.setNotificationChannelAsync('task-reminders', {
    name: 'Lembretes de tarefas',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
  });
}

export async function requestNotificationPermission(): Promise<boolean> {
  const Notifications = await getNotifications();
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

export async function cancelTaskNotification(notificationId: string | null) {
  if (!notificationId) return;

  try {
    const Notifications = await getNotifications();
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch {
    // A notificação pode já ter sido removida pelo sistema.
  }
}

export async function scheduleTaskNotification(title: string, dueDateTime: string) {
  const date = new Date(dueDateTime);
  if (Number.isNaN(date.getTime()) || date.getTime() <= Date.now()) return null;

  const permitted = await requestNotificationPermission();
  if (!permitted) return null;

  const Notifications = await ensureNotificationHandler();

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('task-reminders', {
      name: 'Lembretes de tarefas',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Lembrete de tarefa',
      body: `Não esqueça: ${title}`,
      data: { type: 'task-reminder', title },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date,
      ...(Platform.OS === 'android' ? { channelId: 'task-reminders' } : {}),
    },
  });
}
