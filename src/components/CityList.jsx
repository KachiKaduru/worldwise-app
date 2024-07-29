import styles from "./CityList.module.css";
import { useCities } from "../contexts/CitiesContext";

import CityItem from "./CityItem";
import Message from "./Message";
import Spinner from "./Spinner";

const messageText = "Add your first city by clicking on the map!";

export default function CityList() {
  const { cities, isLoading } = useCities();
  if (isLoading) return <Spinner />;

  if (!cities.length) return <Message message={messageText} />;

  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem city={city} key={city.id} />
      ))}
    </ul>
  );
}
