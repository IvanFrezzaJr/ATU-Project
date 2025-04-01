interface User {
    name: string;
    profilePic: string;
  }


const apiUrl = import.meta.env.VITE_API_URL + "/auth/";


export const login = async (email: string, password: string): Promise<User> => {
  const response = await fetch(`${apiUrl}login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) throw new Error('Error logging in');
  return await response.json();
};

export const logout = async () => {
  const response = await fetch(`${apiUrl}logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.ok) throw new Error('Erro logout');
};

export const getCurrentUser = async () => {
  const response = await fetch(`${apiUrl}user`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.ok) throw new Error('Error getting user');
  return await response.json();
};


export const registerUser = async (name: string, email: string, password: string): Promise<User> => {
  const response = await fetch(`${apiUrl}register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
  });

  if (!response.ok) throw new Error('Error registering user');
  return await response.json();
};
