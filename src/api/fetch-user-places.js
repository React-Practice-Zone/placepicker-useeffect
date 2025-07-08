export async function fetchUserPlaces() {
  const response = await fetch("http://localhost:5050/user-places");
  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(`Error fetching user places: ${response.statusText}`);
  }

  return responseData.places;
}
