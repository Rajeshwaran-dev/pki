import { useState } from 'react';
import { message } from 'antd';

const useLiveLocation = () => {
  const [fetchingLiveLocation, setFetchingLiveLocation] = useState(false);

  const fetchLiveLocation = (formInstance, fieldName) => {
    if (!navigator.geolocation) {
      message.error('Geolocation is not supported by your browser');
      return;
    }
    setFetchingLiveLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data && data.display_name) {
            formInstance.setFieldsValue({ [fieldName]: data.display_name });
            message.success('Live location fetched successfully');
          } else {
            message.error('Could not determine address from location');
          }
        } catch (error) {
          console.error("Reverse geocoding error:", error);
          message.error('Failed to fetch address details');
        } finally {
          setFetchingLiveLocation(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        message.error('Failed to get your location. Please allow location access.');
        setFetchingLiveLocation(false);
      }
    );
  };

  return { fetchingLiveLocation, fetchLiveLocation };
};

export default useLiveLocation;
