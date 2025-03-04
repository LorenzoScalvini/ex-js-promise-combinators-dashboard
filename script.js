async function getDashboardData(query) {
  const baseUrl = 'https://boolean-spec-frontend.vercel.app/freetestapi';

  const destPromise = fetch(`${baseUrl}/destinations?search=${query}`).then(
    (res) => res.json()
  );
  const weatherPromise = fetch('https://www.meteofittizio.it').then((res) =>
    res.json()
  );
  const airportPromise = fetch(`${baseUrl}/airports?search=${query}`).then(
    (res) => res.json()
  );

  const [destRes, weatherRes, airportRes] = await Promise.allSettled([
    destPromise,
    weatherPromise,
    airportPromise,
  ]);

  const getDataOrNull = (res, label) => {
    if (res.status === 'fulfilled') {
      return res.value[0] || {};
    } else {
      console.error(`Errore nella richiesta ${label}:`, res.reason);
      return null;
    }
  };

  const cityData = getDataOrNull(destRes, 'destinazione');
  const weatherData = getDataOrNull(weatherRes, 'meteo');
  const airportData = getDataOrNull(airportRes, 'aeroporto');

  const result = {
    city: cityData?.name || 'Sconosciuto',
    country: cityData?.country || 'Sconosciuto',
    temperature: weatherData?.temperature || 'N/D',
    weather: weatherData?.weather_description || 'N/D',
    airport: airportData?.name || 'Sconosciuto',
  };

  console.log(`${result.city} si trova in ${result.country}.`);
  console.log(
    `Oggi ci sono ${result.temperature} gradi e il meteo è ${result.weather}.`
  );
  console.log(`L'aeroporto principale è ${result.airport}.`);
}

// Test con una città
getDashboardData('london');
