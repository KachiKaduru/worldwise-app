import supabase from "../../supabase";

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
