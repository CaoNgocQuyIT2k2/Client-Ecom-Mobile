// src/redux/actions/notificationActions.ts
export const markAsRead = (id: string) => {
    return {
      type: 'MARK_AS_READ',
      payload: id,
    };
  };

  // src/redux/actions/notificationActions.ts
export const setNotifications = (list: any[]) => ({
  type: 'SET_NOTIFICATIONS',
  payload: list,
});
