import React, { useState, useEffect } from "react";

function GoogleMapLocator({ latitude, longitude }) {
  useEffect(() => {
    const ifameData = document.getElementById("iframeId");
    const lat = latitude;
    const lon = longitude;
    ifameData.src = `https://maps.google.com/maps?q=${lat},${lon}&hl=es;&output=embed`;
  });
  return (
    <div>
      <iframe id="iframeId" height="200px" width="70%"></iframe>
    </div>
  );
}

export default GoogleMapLocator;
