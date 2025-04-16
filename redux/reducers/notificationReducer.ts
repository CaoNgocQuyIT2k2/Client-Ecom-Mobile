// src/redux/reducers/notificationReducer.ts
const initialState = {
  notifications: [],
  unreadCount: 0,
};

export const notificationReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload,
        unreadCount: action.payload.filter((n: any) => !n.isRead).length,
      };
    case 'MARK_AS_READ':
      const updated = state.notifications.map((noti: any) =>
        noti._id === action.payload ? { ...noti, isRead: true } : noti
      );
      return {
        ...state,
        notifications: updated,
        unreadCount: updated.filter((n: any) => !n.isRead).length,
      };
    default:
      return state;
  }
};
