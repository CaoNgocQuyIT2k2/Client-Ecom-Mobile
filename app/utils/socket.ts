// src/utils/socket.ts
import io from 'socket.io-client';

// URL của backend chứa server Socket.IO
const SOCKET_URL = 'http://10.0.2.2:5000';// Cập nhật với URL của backend của bạn

let socket: any;

export const connectSocket = (idUser: number) => {
  socket = io(SOCKET_URL, {
    transports: ['websocket'], // 👈 Giúp tránh CORS với polling
  });

  socket.on('connect', () => {
    console.log('✅ Connected to Socket.IO server');
    socket.emit('join', idUser); // 👈 EMIT join sau khi kết nối
  });

  socket.on('disconnect', () => {
    console.log('❌ Disconnected from Socket.IO server');
  });
};


export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

export { socket };