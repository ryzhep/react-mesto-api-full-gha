
export const BASE_URL = "http://localhost:3000";

const getResponse = (res) =>{
  return res.ok ? res.json(): Promise.reject (`Ошибка ${res.status}`);
  }

export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password }),
  })
  .then(getResponse)
};

export const login = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: {
     Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password }),
  })
  .then(getResponse)
  .then(data => {
    const token = data.token;
    localStorage.setItem('jwt', token);
    return data;
  });
  
};

export const checkToken = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
  })
  .then(getResponse)
};
