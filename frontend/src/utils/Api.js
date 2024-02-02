
class Api {
  constructor({ url }) {
    this._url = url;
  }

  _sendRequest(url, options) {
    return fetch(url, options)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Что-то пошло не так...");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Все карточки
  getAllCards() {
    const token = localStorage.getItem('jwt');
    return this._sendRequest(`${this._url}/cards`, {
      method: "GET",
      //headers: this._headers,
      headers:{
        Authorization: `Bearer ${token}`
      }
    });
  }

  //Загрузка информации о пользователе с сервера
  getInfoUser() {
    const token = localStorage.getItem('jwt');
    return this._sendRequest(`${this._url}/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  //Редактирование профиля
  editProfile({name, about}) {
    const token = localStorage.getItem('jwt');
    return this._sendRequest(`${this._url}/users/me`, {
      method: "PATCH",
      headers:{
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        about: about,
      }),
    });
  }

  //Редактирование аватара
  newAvatar(avatar) {
    const token = localStorage.getItem('jwt');
    console.log('JSON.stringify(avatar)', JSON.stringify(avatar))
    return this._sendRequest(`${this._url}/users/me/avatar`, {
      method: "PATCH",
      headers:{
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(avatar)
    });
  }

  //Добавление новой карточки
  apiAddNewCard({name, link}) {
    const token = localStorage.getItem('jwt');
    return this._sendRequest(`${this._url}/cards`, {
      method: "POST",
      headers:{
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        link: link,
      }),
    });
  }

  // удаление карточки
  deleteCard(cardId) {
    const token = localStorage.getItem('jwt');
    return this._sendRequest(`${this._url}/cards/${cardId}`, {
      method: "DELETE",
      headers:{
        Authorization: `Bearer ${token}`
      },
    });
  }


// добавить убрать лайк
  changeLikeCardStatus(cardId, isLiked) {
    const token = localStorage.getItem('jwt');
    return this._sendRequest(`${this._url}/cards/${cardId}/likes`, {
      method: isLiked ? 'DELETE' : 'PUT',
      headers:{
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
  }
}

 const api = new Api({
  url: "https://api.ryzhep.nomoredomainsmonster.ru",
// headers: {
//   authorization: "9e1ba490-d05f-4831-95ed-e11f8659a9e1",
//    "Content-Type": "application/json",'
 // }
});

export default api;