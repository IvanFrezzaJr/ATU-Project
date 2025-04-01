interface UserLogin {
    name: string;
    profilePic: string;
  }

  interface UserUpdate {
    name?: string;
    email?: string;
    profilePic?: string;
  }
 


const apiUrl = import.meta.env.VITE_API_URL + "/auth/";


export const login = async (email: string, password: string): Promise<UserLogin> => {
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


export const registerUser = async (name: string, email: string, password: string): Promise<UserUpdate> => {
  const response = await fetch(`${apiUrl}register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
  });

  if (!response.ok) throw new Error('Error registering user');
  return await response.json();
};


export const updateUser = async (userId: string, updates: Partial<UserUpdate>): Promise<UserUpdate> => {
  const response = await fetch(`${apiUrl}user/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
  });

  if (!response.ok) throw new Error('Error updating user');
  return await response.json();
};