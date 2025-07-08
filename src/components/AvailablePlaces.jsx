import { useState, useEffect } from "react";

import Places from "./Places.jsx";
import ErrorPage from "./ErrorPage.jsx";
import { sortPlacesByDistance } from "../utils/location-calculation.util.js";
import { fetchAvailablePlaces } from "../api/fetch-available-places.js";

export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching, setIsFetching] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [errorState, setErrorState] = useState(null);

  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);

      try {
        const fetchedPlaces = await fetchAvailablePlaces();

        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
            fetchedPlaces,
            position.coords.latitude,
            position.coords.longitude
          );
          setAvailablePlaces(sortedPlaces);
        });
      } catch (error) {
        console.error("Error fetching places:", error);
        setErrorState(error);
      } finally {
        setIsFetching(false);
      }
    }

    fetchPlaces();
  }, []);

  if (errorState) {
    return (
      <ErrorPage title="An error occurred!" message={errorState.message} />
    );
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Fetching places data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
