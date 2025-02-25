import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import React, { useEffect } from 'react'
import { Alert } from '@mui/material';

export const Map = ({currentLocation}) => {

  
  return (
    <MapContainer center={currentLocation} zoom={11} style={{ height: "100vh", width: "100%" }}>
      {/* Capa de OpenStreetMap */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* Marcador en Bogotá (puedes cambiar las coordenadas) */}
      <Marker position={currentLocation}>
        <Popup>
          ¡Hola! Estoy en Barranca.
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export default Map
