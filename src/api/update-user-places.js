export async function updateUserPlaces(places) {
  const response = await fetch("http://localhost:5050/user-places", {
    method: "PUT",
    body: JSON.stringify({ places }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(`Error updating user places: ${response.statusText}`);
  }

  return responseData.message;
}
