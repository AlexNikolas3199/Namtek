import React, { useState, useEffect } from "react";
import Footer from "../../Components/Footer";
import SettingsFilt from "../../Components/SettingsFilt";
import { read_cookie } from "sfcookies";
import axios from "axios";

const AdminServices = (props) => {
  const [createdNewsImg, setСreatedNewsImg] = useState([]);
  useEffect(() => {
    if (read_cookie("token").length !== 0) {
      if (read_cookie("role") !== "admin") {
        props.history.push("/");
      }
    } else {
      props.history.push(`/Login/?next=${window.location.pathname}`);
    }
  }, [props]);
  const createServices = (e) => {
    e.preventDefault();
    var form = e.target;
    form.querySelector("button").disabled = true;
    axios({
      url: process.env.REACT_APP_SERV_URL,
      method: "post",
      data: {
        query: `
                        mutation postOther($title: String!, $description: String!, $logo: String, $address: String, $type: String, $number: String, $workTime: String){
                        postOther(data:{title: $title, description: $description, logo: $logo, address: $address, type: $type, number: $number, workTime: $workTime}){
                            title
                        }
                        }
                        `,
        variables: {
          title: form.elements.title.value,
          description: form.elements.description.value,
          logo: process.env.REACT_APP_IMAGE_URL + "/static/" + createdNewsImg,
          address: form.elements.address.value,
          type: form.elements.type.value,
          number: form.elements.number.value,
          workTime: form.elements.workTime.value,
        },
      },
      headers: {
        authorization: read_cookie("token").replace("jwt", ""),
      },
    }).then(
      (data) => {
        if (data.data.data.postOther) {
          // console.log(data);
          alert("Услуга добавлена!");
          form.reset();
          form.querySelector("button").disabled = false;
        } else {
          // console.log(data);
          alert("Услуга не добавлена!");
          form.querySelector("button").disabled = false;
        }
      },
      (error) => {
        alert(error.message);
        form.querySelector("button").disabled = false;
      }
    );
  };
  const createImg = (e) => {
    let input = e.target;
    input.className = "disabled";
    let fd = new FormData();
    fd.append("image", e.target.files[0]);
    axios({
      method: "post",
      url: process.env.REACT_APP_IMAGE_URL + "/photo",
      data: fd,
    })
      .then((res) => {
        // console.log(res.data);
        setСreatedNewsImg(res.data);
        input.className = "";
      })
      .catch((err) => {
        // console.log(err);
      });
  };
  window.scroll(0, 0);
  document.querySelector("body").classList.remove("active");
  return (
    <>
      <div className="catalogWrapper">
        <div className="catalogSides">
          <SettingsFilt role={read_cookie("role")} />
          <div className="catologContent">
            <div className="infoAmus settings">
              <h3>Развлечения, Услуги...</h3>
              <div className="adminform">
                <h4>Создать услугу</h4>
                <form onSubmit={createServices} className="settingsForm">
                  <div className="formcontent">
                    <div className="labels">
                      <label>
                        <p>Тип</p>
                        <select name="type" required>
                          <option value={"Services"}>Услуги</option>
                          <option value={"Entertainment"}>Развлечения</option>
                          <option value={"Health"}>Здоровье</option>
                          <option value={"Catering"}>Кафе, рестораны</option>
                        </select>
                      </label>
                      <label>
                        <p>Заголовок</p>
                        <input name="title" required />
                      </label>
                      <label>
                        <p>Изображение</p>
                        <input
                          type="file"
                          onChange={createImg}
                          required
                          name="photo"
                          accept="image/jpeg,image/png"
                        />
                      </label>
                      <label>
                        <p>Текст</p>
                        <div>
                          Чтобы разделять на абзацы, нажимайте на enter.
                          Достаточно одного раза на абзац.
                        </div>
                        <textarea name="description" required></textarea>
                      </label>
                      <label>
                        <p>Рабочее время</p>
                        <input
                          name="workTime"
                          placeholder="Пн-Пт 9:00-21:00"
                          required
                        />
                      </label>
                      <label>
                        <p>Адрес</p>
                        <input
                          name="address"
                          placeholder="Пушкина, 37"
                          required
                        />
                      </label>
                      <label>
                        <p>Номер телефона</p>
                        <input
                          pattern="[+][7][0-9]{10}"
                          type="tel"
                          placeholder="+79142889727"
                          required
                          name="number"
                        />
                      </label>
                    </div>
                    <button type="submit">Сохранить</button>
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
export default AdminServices;
