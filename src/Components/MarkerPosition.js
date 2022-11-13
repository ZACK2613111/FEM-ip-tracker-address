import React, {useEffect} from "react";
import {Marker, Popup, useMap} from "react-leaflet";
import icon from "../icon";

const MarkerPosition = ({address}) => {
  const map = useMap();
  const position = [address.location.lat, address.location.lng];
  useEffect(() => {
    map.flyTo(position, 13, {
      animate: true,
    });
  }, [map, position]);

  return (
    <Marker position={position} icon={icon}>
      <Popup>
        ZAKARIA <br />
      </Popup>
    </Marker>
  );
};

export default MarkerPosition;
