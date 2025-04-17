import React from 'react';
import siteConfig from '../config/site';

const ContactMap = () => {
  const { lat, lng } = siteConfig.footer.contact.address.coordinates;
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${siteConfig.contact.map.apiKey}&q=${lat},${lng}&zoom=${siteConfig.contact.map.zoom}`;

  return (
    <div className="w-full h-[300px] rounded-lg overflow-hidden shadow-lg">
      <iframe
        title="Dernek Lokasyonu"
        width="100%"
        height="100%"
        frameBorder="0"
        src={mapUrl}
        allowFullScreen
      />
    </div>
  );
};

export default ContactMap;