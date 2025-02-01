import { createContext, useContext, useReducer } from "react";
import { createNewUser } from "../helpers/apiSupabase";

const AuthContext = createContext();

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  isAuthenticated: localStorage.getItem("isAuthenticated") || false,
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { ...state, user: action.payload, isAuthenticated: true };

    case "logout":
      return { ...state, user: null, isAuthenticated: false };

    default:
      throw new Error("Unknown action");
  }
}

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user, isAuthenticated } = state;

  async function login(name, email) {
    await createNewUser(name, email);
    dispatch({ type: "login", payload: JSON.parse(localStorage.getItem("user")) });
  }

  function logout() {
    localStorage.clear("user", "isAuthenticated");
    dispatch({ type: "logout" });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) throw new Error("AuthContext was usd outside of AuthProvider");

  return context;
}

export { AuthProvider, useAuth };
