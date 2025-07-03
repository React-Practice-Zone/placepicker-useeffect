import { useRef, useState, useEffect } from "react";

import logoImg from "./assets/logo.png";
import Places from "./components/Places";
import Modal from "./components/Modal";
import DeleteConfirmation from "./components/DeleteConfirmation";
import { AVAILABLE_PLACES } from "./data.util";
import { sortPlacesByDistance } from "./utils/location-calculation.util";

function App() {
  const modalRef = useRef();
  const selectedPlaceRef = useRef();
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [pickedPlaces, setPickedPlaces] = useState([]);

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
    modalRef.current.open();
    selectedPlaceRef.current = id;
  }

  function stopRemovePlace() {
    modalRef.current.close();
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

  function removePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlaceRef.current)
    );
    modalRef.current.close();
  }

  return (
    <>
      <Modal ref={modalRef}>
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
