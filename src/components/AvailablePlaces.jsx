import { useState, useEffect } from "react";
import Places from "./Places.jsx";
import ErrorPage from "./ErrorPage.jsx";

export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching, setIsFetching] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [errorState, setErrorState] = useState(null);

  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);

      try {
        const response = await fetch("http://localhost:5050/paces");

        if (!response.ok) {
          throw new Error(`Error fetching places: ${response.statusText}`);
        }

        const responseData = await response.json();
        setAvailablePlaces(responseData.places);
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
