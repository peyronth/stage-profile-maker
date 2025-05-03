export async function getLocation (lat: number, lon: number): Promise<string> {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  const address = data.address;
  
  return address.city ?? address.town ?? address.village ?? address.municipality ?? address.hamlet ?? address.suburb ?? address.borough ?? address.county ?? address.state_district ?? address.neighbourhood ?? address.state ?? address.country ?? address.country_code ?? '';
}