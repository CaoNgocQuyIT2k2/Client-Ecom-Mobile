// components/NotificationInitializer.tsx
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { fetchNotifications } from '@/redux/slices/notificationSlice';

export default function NotificationInitializer() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  return null;
}
