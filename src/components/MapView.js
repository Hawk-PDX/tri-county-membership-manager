'use client';

import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

export default function MapView() {
  // Tri-County Gun Club location
  const clubLocation = { lat: 45.35002140, lng: -122.80738990 }; // 13050 S.W. Tonquin Road, Sherwood, OR

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400">
        <p>Map configuration required</p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div className="w-full h-64 rounded-lg overflow-hidden">
        <Map
          defaultCenter={clubLocation}
          defaultZoom={15}
          mapId="tri-county-gun-club-map"
          gestureHandling="greedy"
          disableDefaultUI={false}
        >
          <Marker position={clubLocation} title="Tri-County Gun Club" />
        </Map>
      </div>
    </APIProvider>
  );
}
