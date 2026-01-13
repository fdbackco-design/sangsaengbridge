'use client'

import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { useMemo } from 'react'

interface FactoryLocation {
  id: string
  title: string
  latitude: number
  longitude: number
  address?: string | null
}

interface MapSectionProps {
  locations: FactoryLocation[]
}

const mapContainerStyle = {
  width: '100%',
  height: '400px',
}

const defaultCenter = {
  lat: 37.5665,
  lng: 126.9780,
}

export default function MapSection({ locations }: MapSectionProps) {
  const center = useMemo(() => {
    if (locations.length === 0) return defaultCenter
    
    const avgLat = locations.reduce((sum, loc) => sum + Number(loc.latitude), 0) / locations.length
    const avgLng = locations.reduce((sum, loc) => sum + Number(loc.longitude), 0) / locations.length
    
    return { lat: avgLat, lng: avgLng }
  }, [locations])

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-card flex items-center justify-center">
        <p className="text-gray-500">구글 맵 API 키가 설정되지 않았습니다.</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
        150여개 제조 공장 파트너십 보유
      </h2>
      <div className="bg-white rounded-card shadow-card overflow-hidden">
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={locations.length > 0 ? 7 : 6}
          >
            {locations.map((location) => (
              <Marker
                key={location.id}
                position={{
                  lat: Number(location.latitude),
                  lng: Number(location.longitude),
                }}
                title={location.title}
              />
            ))}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  )
}
