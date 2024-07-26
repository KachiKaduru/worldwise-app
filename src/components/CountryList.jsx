import styles from "./CountryList.module.css";

import CountryItem from "./CountryItem";
import Message from "./Message";
import Spinner from "./Spinner";

const messageText = "Add your first city by clicking on the map!";

export default function CountryList({ cities, isLoading }) {
  if (isLoading) return <Spinner />;

  if (!cities.length) return <Message message={messageText} />;

  const countries = cities.reduce((arr, city) => {
    if (!arr.map((el) => el.country).includes(city.country))
      return [...arr, { country: city.country, emoji: city.emoji }];
    else return arr;
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.id} />
      ))}
    </ul>
  );
}
