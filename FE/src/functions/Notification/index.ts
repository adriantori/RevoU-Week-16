import { notification } from 'antd';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationConfig {
    message: string;
    description: string;
    duration?: number;
  }

const notificationTypes: { [key in NotificationType]: (config: NotificationConfig) => void } = {
  success: notification.success,
  error: notification.error,
  info: notification.info,
  warning: notification.warning,
};

const showNotification = (type: NotificationType, message: string, description: string) => {
  const notificationMethod = notificationTypes[type] || notification.open;

  notificationMethod({
    message,
    description,
    duration: 2,
  });
};

export default showNotification;
