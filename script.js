async function getDashboardData(query) {
  const baseUrl = 'https://boolean-spec-frontend.vercel.app/freetestapi';

  const destinationsUrl = `${baseUrl}/destinations?search=${query}`;
  const weatherUrl = `${baseUrl}/weathers?search=${query}`;
  const airportsUrl = `${baseUrl}/airports?search=${query}`;

  try {
    const results = await Promise.allSettled([
      fetch(destinationsUrl).then((res) => res.json()),
      fetch(weatherUrl).then((res) => res.json()),
      fetch(airportsUrl).then((res) => res.json()),
    ]);

    const destinationData =
      results[0].status === 'fulfilled' && results[0].value.length > 0
        ? results[0].value[0]
        : null;
    const weatherData =
      results[1].status === 'fulfilled' && results[1].value.length > 0
        ? results[1].value[0]
        : null;
    const airportData =
      results[2].status === 'fulfilled' && results[2].value.length > 0
        ? results[2].value[0]
        : null;

    const dashboardData = {
      city: destinationData ? destinationData.name : null,
      country: destinationData ? destinationData.country : null,
      temperature: weatherData ? weatherData.temperature : null,
      weather: weatherData ? weatherData.weather_description : null,
      airport: airportData ? airportData.name : null,
    };

    console.log('Dati della dashboard:', dashboardData);

    let message = '';
    if (dashboardData.city && dashboardData.country) {
      message += `${dashboardData.city} si trova in ${dashboardData.country}.\n`;
    }
    if (dashboardData.temperature !== null && dashboardData.weather) {
      message += `Oggi ci sono ${dashboardData.temperature} gradi e il tempo è ${dashboardData.weather}.\n`;
    }
    if (dashboardData.airport) {
      message += `L'aeroporto principale è ${dashboardData.airport}.\n`;
    }
    console.log(message);

    return dashboardData;
  } catch (error) {
    console.error('Errore nel recupero dei dati:', error);
    return null;
  }
}

getDashboardData('london').catch(console.error);

getDashboardData('vienna').catch(console.error);

const oldFetch = fetch;
fetch = (url) =>
  url.includes('weathers')
    ? Promise.reject("Errore nell'API meteo")
    : oldFetch(url);
getDashboardData('paris').catch(console.error);
fetch = oldFetch;
