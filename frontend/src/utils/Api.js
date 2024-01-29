
class Api {
  constructor({ url, headers }) {
    this._url = url;
    this._headers = headers;
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
        authorization: `Bearer ${token}`
      }
    });
  }

  //Загрузка информации о пользователе с сервера
  getInfoUser() {
    const token = localStorage.getItem('jwt');
    return this._sendRequest(`${this._url}/users/me`, {
      method: "GET",
      headers:{
        authorization: `Bearer ${token}`
      }
    });
  }

  //Редактирование профиля
  editProfile(data) {
    const token = localStorage.getItem('jwt');
    return this._sendRequest(`${this._url}/users/me`, {
      method: "PATCH",
      headers:{
        authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: data.name,
        about: data.about,
      }),
    });
  }

  //Редактирование аватара
  newAvatar(avatar) {
    const token = localStorage.getItem('jwt');
    return this._sendRequest(`${this._url}/users/me/avatar`, {
      method: "PATCH",
      headers:{
        authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        avatar: avatar.avatar
      }),
    });
  }

  //Добавление новой карточки
  apiAddNewCard(newCard) {
    const token = localStorage.getItem('jwt');
    return this._sendRequest(`${this._url}/cards`, {
      method: "POST",
      headers:{
        authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: newCard.name,
        link:newCard.link,
      }),
    });
  }

  // удаление карточки
  deleteCard(cardId) {
    const token = localStorage.getItem('jwt');
    return this._sendRequest(`${this._url}/cards/${cardId}`, {
      method: "DELETE",
      headers:{
        authorization: `Bearer ${token}`
      },
    });
  }


// добавить убрать лайк
  changeLikeCardStatus(cardId, isLiked) {
    const token = localStorage.getItem('jwt');
    return this._sendRequest(`${this._url}/cards/${cardId}/likes`, {
      method: isLiked ? 'DELETE' : 'PUT',
      headers:{
        authorization: `Bearer ${token}`
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