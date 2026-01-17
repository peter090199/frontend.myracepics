
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

export const environment = {
  production: true,
  apiUrl: 'https://backend.myracepics.com/public/api/', 
  //apiUrl: 'https://exploredition.com/public/api/',
}; 

export const echo = new Echo({
    broadcaster: 'pusher',
    key: 'e0cd7653f3ae9bbbd459', // Replace with actual Pusher key
    cluster: 'ap1', // Ensure this matches your Pusher dashboard settings
    forceTLS: true,
    enabledTransports: ['ws', 'wss'], // Allows WebSockets
    auth: {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
    },
    client: Pusher, // Ensure Laravel Echo uses the correct Pusher client
});


const firebaseConfig = {
  apiKey: "AIzaSyBM05Q4VufV84DW70N7QSQFYJPDiIo5ki8",
  authDomain: "racepics-storage.firebaseapp.com",
  projectId: "racepics-storage",
  storageBucket: "racepics-storage.firebasestorage.app",
  messagingSenderId: "679405043618",
  appId: "1:679405043618:web:7bfab3d27aee02aaaabcfb"
};