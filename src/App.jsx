import { useRef, useState, useEffect, useCallback } from "react";

import logoImg from "./assets/logo.png";
import Places from "./components/Places";
import Modal from "./components/Modal";
import DeleteConfirmation from "./components/DeleteConfirmation";
import { AVAILABLE_PLACES } from "./data.util";
import { sortPlacesByDistance } from "./utils/location-calculation.util";

const storedIds = JSON.parse(localStorage.getItem("picked-places")) || [];
const storedPlaces = storedIds.map((id) =>
  AVAILABLE_PLACES.find((place) => place.id === id)
);

function App() {
  const selectedPlaceRef = useRef();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude
      );

      setAvailablePlaces(sortedPlaces);
    });
  }, []);

  function startRemovePlace(id) {
    setModalIsOpen(true);
    selectedPlaceRef.current = id;
  }

  function stopRemovePlace() {
    setModalIsOpen(false);
  }

  function selectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    const storedIds = JSON.parse(localStorage.getItem("picked-places")) || [];

    if (storedIds.indexOf(id) === -1) {
      localStorage.setItem("picked-places", JSON.stringify([id, ...storedIds]));
    }
  }

  const removePlace = useCallback(function removePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlaceRef.current)
    );

    setModalIsOpen(false);

    const storedIds = JSON.parse(localStorage.getItem("picked-places")) || [];
    localStorage.setItem(
      "picked-places",
      JSON.stringify(storedIds.filter((id) => id !== selectPlace.current))
    );
  }, []);

  return (
    <>
      <Modal open={modalIsOpen} onClose={stopRemovePlace}>
        <DeleteConfirmation
          onCancel={stopRemovePlace}
          onConfirm={removePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={"Select the places you would like to visit below."}
          places={pickedPlaces}
          onSelectPlace={startRemovePlace}
        />
        <Places
          title="Available Places"
          fallbackText={"Sorting places by distance..."}
          places={availablePlaces}
          onSelectPlace={selectPlace}
        />
      </main>
    </>
  );
}

export default App;
