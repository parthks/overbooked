// import {useEffect, useState, useCallback} from 'react'
// import debounce from "lodash.debounce";

import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
// import 'leaflet/dist/leaflet.css'




function ModifyMap({coordinates}) {
  const map = useMap()

  if (coordinates && coordinates.length) {
    map.flyTo([coordinates[0],coordinates[1]], 14)
  } 

  // const verify = useCallback(
  //   debounce(async (finalPincode) => {
  //     console.log('go for map', finalPincode);
  //     if (!finalPincode || finalPincode.toString().length < 4) { return }

  //     const res = await fetch(API+finalPincode)
  //     const data = await res.json()

  //     if (data && data.length) {
  //       map.flyTo([data[0].lat,data[0].lon], 14)
  //     }
  //     console.log(data.lat, data.lon, data[0])

  //   }, 500),
  //   []
  // );

  // useEffect(() => {
  //   verify(pincode)
  // }, [pincode])
  
  
  return null
}



const Map = ({coordinates}) => {

  return (
    <MapContainer center={[0, 0]} zoom={0} scrollWheelZoom={false} style={{height: 250, width: "100%"}}>
      <ModifyMap coordinates={coordinates} />
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* <Marker position={[51.505, -0.09]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker> */}
    </MapContainer>
  )
}

export default Map