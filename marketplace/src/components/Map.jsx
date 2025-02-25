import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import React, { useState, useEffect } from 'react';
import { Alert } from '@mui/material';
import L from 'leaflet'; // Importa L de leaflet

export const Map = ({ currentLocation }) => {
  // Estado para almacenar la ubicación del usuario
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Verifica si la geolocalización está disponible
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Establece la ubicación del usuario si la geolocalización es exitosa
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          // Maneja el error si la geolocalización falla
          console.error('Error de geolocalización:', error);
        }
      );
    } else {
      console.error('La geolocalización no es compatible en este navegador');
    }
  }, []);

  // Crea un icono personalizado para el marcador
  const customIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/128/18680/18680955.png', // Puedes usar la URL de cualquier icono de marcador
    iconSize: [35, 35], // Tamaño del icono
    iconAnchor: [1, 1], // Ancla del icono para posicionarlo correctamente
    popupAnchor: [0, -41], // Posición del pop-up
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png', // Sombra del marcador
    shadowSize: [0, 0], // Tamaño de la sombra
  });
  const customIcon1 = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/128/18669/18669005.png', // Puedes usar la URL de cualquier icono de marcador
    iconSize: [28, 28], // Tamaño del icono
    iconAnchor: [0, 0], // Ancla del icono para posicionarlo correctamente
    popupAnchor: [0, -41], // Posición del pop-up
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png', // Sombra del marcador
    shadowSize: [0, 0], // Tamaño de la sombra
  });

  return (
    <MapContainer center={currentLocation} zoom={11} style={{ height: '100vh', width: '100%' }}>
      {/* Capa de OpenStreetMap */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* Marcador en Barranca con color personalizado */}
      <Marker position={currentLocation} icon={customIcon}>
        <Popup>
          ¡Hola! Estoy en Barranca.
        </Popup>
      </Marker>

      {/* Marcador de la ubicación del usuario con icono personalizado */}
      {userLocation && (
        <Marker position={userLocation} icon={customIcon1}>
          <Popup>
            ¡Hola! Esta es tu ubicación actual.
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default Map;
