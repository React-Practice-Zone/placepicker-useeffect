export async function fetchAvailablePlaces() {
  const response = await fetch("http://localhost:5050/places");
  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(`Error fetching places: ${response.statusText}`);
  }

  return responseData.places;
}
