class Api {
  url = "";

  constructor(url) {
    this.url = url;
  }

  create(data) {
    const JSONData = JSON.stringify(data);

    const request = new Request(this.url, {
      method: "POST",
      body: JSONData,
      headers: {
        "content-type": "application/json",
      },
    });

    return fetch(request)
      .then((result) => result.json())
      .then((data) => data)
      .catch((err) => console.log(err));
  }

  getAll() {
    return fetch(this.url)
      .then((result) => result.json())
      .then((data) => data)
      .catch((err) => console.log(err));
  }

  remove(id) {
    return fetch(`${this.url}/${id}`, {
      method: "DELETE",
    })
      .then((result) => result)
      .catch((err) => console.log(err));
  }

  patch(id, completed) {
    const JSONData = JSON.stringify(completed);
    //console.log(completed);
    const request = new Request(`${this.url}/${id}`, {
      method: "PATCH",
      body: JSONData,
      headers: {
        "content-type": "application/json",
      },
    });

    return fetch(request)
      .then((result) => result.json())
      .then((data) => data)
      .catch((err) => console.log(err));
  }

  update(id, completed) {
    const JSONData = JSON.stringify(completed);
    return fetch(`${this.url}/${id}`, {
      method: "PATCH",
      body: JSONData,
      headers: {
        "content-type": "application/json",
      },
    });
  }
}
