import React, { useState, useEffect } from "react";
import Footer from "../Components/Footer";
import SettingsFilt from "../Components/SettingsFilt";
import { read_cookie } from "sfcookies";
import axios from "axios";
const KinoControl = (props) => {
  const [role, setRole] = useState("a");
  const [message, setMessage] = useState(undefined);
  const [createdNewsImg, setCreatedImg] = useState(null);
  useEffect(() => {
    setRole(read_cookie("role"));
    if (read_cookie("token").length !== 0) {
      if ( read_cookie("role") === "admin" || read_cookie("role") === "kinoman") {
      }else{
        props.history.push("/");
      }
    } else {
      props.history.push(`/Login/?next=${window.location.pathname}`);
    }
  }, [props]);
  const createImg = (e) => {
    let input = e.target
    input.className="disabled"
    let fd = new FormData();
    fd.append("image", e.target.files[0]);
    axios({
      method: "post",
      url: process.env.REACT_APP_IMAGE_URL+"/photo",
      data: fd,
    })
      .then((res) => {
        // console.log(res);
        setCreatedImg(res.data);
        input.className=""
      })
      .catch((err) => {
        console.log(err);
        input.className=""
      });
  };
  const createFilm = (e) => {
    e.preventDefault();
    var form = e.target;
    form.querySelector("button").disabled = true;
    axios({
      url: process.env.REACT_APP_SERV_URL,
      method: "post",
      data: {
        query: `
            mutation addAfisha($title: String!, $text: String, $photo: String, $age: String, $genre: String, $country: String, $duration: String){
            addAfisha(data:{title: $title, text: $text, photo: $photo, age: $age, genre: $genre, country: $country, duration: $duration  }){
                title
            }
            }
                        `,
        variables: {
          title: form.elements.title.value,
          text: form.elements.text.value,
          photo:
              process.env.REACT_APP_IMAGE_URL+"/static/" +
            createdNewsImg,
          age: form.elements.age.value,
          genre: form.elements.genre.value,
          country: form.elements.country.value,
          duration: form.elements.duration.value,
        },
      },
      headers: {
        authorization: read_cookie("token").replace("jwt", ""),
      },
    }).then(
      (data) => {
        if (data.data.data.addAfisha) {
          setMessage("Фильм успешно добавлен!");
          form.reset();
          form.querySelector("button").disabled = false;
        } else {
          // console.log(data);
          setMessage(data.data.errors[0].message);
          form.querySelector("button").disabled = false;
        }
      },
      (error) => {
        setMessage(error.message);
      }
    );
  };
  const deleteFilm = (e) => {
    e.preventDefault();
    var form = e.target;
    form.querySelector("button").disabled = true;
    axios({
      url: process.env.REACT_APP_SERV_URL,
      method: "post",
      data: {
        query: `
                mutation deleleAfisha($id: String){
                    deleleAfisha(where:{ _id: $id }){
                        _id
                    }
                  }
                `,
        variables: {
          id: form.elements.id.value,
        },
      },
      headers: {
        authorization: read_cookie("token").replace("jwt", ""),
      },
    }).then((result) => {
      if (result.data.data.deleleAfisha) {
        alert("Фильм удален.");
      } else {
        alert("Фильм не найден.");
      }
      form.querySelector("button").disabled = false;
      form.reset();
    });
  };
  window.scroll(0, 0);
  document.querySelector("body").classList.remove("active");
  return (
    <>
      <div className="catalogWrapper">
        <div className="catalogSides">
          <SettingsFilt role={role} />
          <div className="catologContent">
            <div className="infoAmus settings">
              <h3>Управление Афишей</h3>
              <div className="adminform">
                <h4>Добавить фильм</h4>
                <form onSubmit={createFilm} className="settingsForm">
                  <div className="formcontent">
                    <div className="labels">
                      <label>
                        <p>Название</p>
                        <input name="title" required />
                      </label>
                      <label>
                        <p>Изображение</p>
                        <input
                          type="file"
                          onChange={createImg}
                          name="photo"
                          accept="image/jpeg,image/png"
                        />
                      </label>
                      <label>
                        <p>Текст</p>
                        <textarea name="text" required></textarea>
                      </label>
                      <label>
                        <p>Минимальный возраст</p>
                        <input type="number" name="age" required />
                      </label>
                      <label>
                        <p>Жанр</p>
                        <input name="genre" required />
                      </label>
                      <label>
                        <p>Страна</p>
                        <input name="country" required />
                      </label>
                      <label>
                        <p>Продолжительность</p>
                        <input name="duration" required />
                      </label>
                    </div>
                    {message !== undefined ? (
                      <div className="message">{message}</div>
                    ) : (
                      ""
                    )}
                    <button type="submit">Сохранить</button>
                  </div>
                </form>
              </div>
              <div className="adminform">
                <h4>Удалить фильм</h4>
                <form onSubmit={deleteFilm} className="settingsForm">
                  <div className="formcontent">
                    <div className="labels">
                      <label>
                        <p>id фильма</p>
                        <div>
                          <input name="id" required />
                          <button type="submit">Сохранить</button>
                        </div>
                      </label>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default KinoControl;
