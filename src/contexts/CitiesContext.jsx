import { createContext, useContext, useEffect, useReducer } from "react";
import { useAuth } from "./FakeAuthContext";
import { createSupabaseCity, getSupabaseCities, getSupabaseCity } from "../helpers/apiSupabase";

const BASE_URL = import.meta.env.VITE_API_URL;

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };

    case "cities/loaded":
      return { ...state, cities: action.payload, isLoading: false };

    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };

    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };

    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
      };

    case "rejected":
      return { ...state, isLoading: false, error: action.payload };

    default:
      throw new Error("Unknown action");
  }
}

function CitiesProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { cities, isLoading, currentCity, error } = state;
  const { user } = useAuth();

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "loading" });

      try {
        const userCities = await getSupabaseCities(user.id);
        dispatch({ type: "cities/loaded", payload: userCities });
      } catch {
        dispatch({ type: "rejected", payload: "Problem occured loading the cities" });
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    if (Number(id) === currentCity.id) return;

    dispatch({ type: "loading" });

    try {
      const city = await getSupabaseCity(id);
      dispatch({ type: "city/loaded", payload: city });
    } catch {
      dispatch({ type: "rejected", payload: "Problem occured loading the city" });
    }
  }

  async function createCity(newCity) {
    dispatch({ type: "loading" });

    try {
      const city = await createSupabaseCity(newCity);
      // For testing
      await new Promise((res) => setTimeout(res, 2000));
      dispatch({ type: "city/created", payload: city });
    } catch {
      dispatch({ type: "rejected", payload: "Problem occured creating the city" });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });

    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "city/deleted", payload: id });
    } catch {
      dispatch({ type: "rejected", payload: "Problem occured deleting the city" });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);

  if (context === undefined) throw new Error("CitiesContext was used outside the CitiesProvider");

  return context;
}

export { CitiesProvider, useCities };
