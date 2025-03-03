async function getDashboardData(query) {
  const baseUrl = 'https://boolean-spec-frontend.vercel.app/freetestapi';

  try {
    const [destRes, weatherRes, airportRes] = await Promise.all([
      fetch(`${baseUrl}/destinations?search=${query}`).then((res) =>
        res.json()
      ),
      fetch(`${baseUrl}/weathers?search=${query}`).then((res) => res.json()),
      fetch(`${baseUrl}/airports?search=${query}`).then((res) => res.json()),
    ]);

    const cityData = destRes[0] || {};
    const weatherData = weatherRes[0] || {};
    const airportData = airportRes[0] || {};

    const result = {
      city: cityData.name || 'Sconosciuto',
      country: cityData.country || 'Sconosciuto',
      temperature: weatherData.temperature || 'N/D',
      weather: weatherData.weather_description || 'N/D',
      airport: airportData.name || 'Sconosciuto',
    };

    console.log(`${result.city} si trova in ${result.country}.`);
    console.log(
      `Oggi ci sono ${result.temperature} gradi e il meteo è ${result.weather}.`
    );
    console.log(`L'aeroporto principale è ${result.airport}.`);
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
  }
}

getDashboardData('london');
