import supabase from "../../supabase";

//USERS
export async function getAllUsers() {
  const { data, error } = await supabase.from("worldwise_users").select("*");
  if (error) throw new Error(`error: ${error}`);
  return data;
}

export async function getUser(userId) {
  const { data, error } = await supabase
    .from("worldwise_users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw new Error(`error: ${error}`);
  return data;
}

export async function getUserByEmail(email) {
  const { data, error } = await supabase.from("worldwise_users").select("*").eq("email", email);

  if (error) throw new Error(`error: ${error}`);
  return data[0];
}

export async function createNewUser(name, email) {
  const user = await getUserByEmail(email);

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("isAuthenticated", true);
  } else {
    const { data, error } = await supabase
      .from("worldwise_users")
      .insert([{ name, email }])
      .select();

    if (error) console.error("Error creating user:", error);
    localStorage.setItem("user", JSON.stringify(data[0]));
    localStorage.setItem("isAuthenticated", true);
  }
}

//CITIES DATA
export async function getSupabaseCities(id) {
  const { data, error } = await supabase.from("worldwise_data").select("*").eq("user_id", id);

  if (error) console.error("Error fetching the cities:", error);
  return data;
}

export async function getSupabaseCity(id) {
  const { data, error } = await supabase.from("worldwise_data").select("*").eq("id", id);

  if (error) console.error("Error fetching the city:", error);
  return data[0];
}

export async function createSupabaseCity(cityObject) {
  const { position, ...rest } = cityObject;
  const newCityObject = { ...rest, lat: position.lat, lng: position.lng };

  const { data, error } = await supabase.from("worldwise_data").insert([newCityObject]);

  if (error) console.error("Error creating the cities:", error);
  return data;
}
