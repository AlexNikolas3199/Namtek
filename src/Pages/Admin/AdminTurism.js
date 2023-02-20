import React, { useState, useEffect } from "react";
import Footer from "../../Components/Footer";
import SettingsFilt from "../../Components/SettingsFilt";
import { read_cookie } from "sfcookies";
import axios from "axios";
const AdminTurism = (props) => {
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
  const createTurism = (e) => {
    e.preventDefault();
    var form = e.target;
    form.querySelector("button").disabled = true;
    axios({
      url: process.env.REACT_APP_SERV_URL,
      method: "post",
      data: {
        query: `
            mutation addTourism($title: String, $text: String, $photo: String, $map: String){
            addTourism(data:{title: $title, text: $text, photo: $photo, map: $map})
            }
            `,
        variables: {
          title: form.elements.title.value,
          text: form.elements.text.value,
          photo:process.env.REACT_APP_IMAGE_URL+"/static/" +createdNewsImg,
          map: form.elements.map.value,
        },
      },
      headers: {
        authorization: read_cookie("token").replace("jwt", ""),
      },
    }).then(
      (data) => {
        if (data.data.data.addTourism) {
          // console.log(data);
          alert("Турбаза добавлена!");
          form.reset();
          form.querySelector("button").disabled = false;
        } else {
          // console.log(data);
          alert(data.data.errors[0].message);
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
        // console.log(res.data);
        setСreatedNewsImg(res.data);
        input.className=""
      })
      .catch((err) => {
        console.log(err);
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
              <h3>Управление туризмом</h3>
              <div className="adminform">
                <h4>Добавить турбазу</h4>
                <form onSubmit={createTurism} className="settingsForm">
                  <div className="formcontent">
                    <div className="labels">
                      <label>
                        <p>Заголовок</p>
                        <input name="title" required />
                      </label>
                      <label>
                        <p>Изображение</p>
                        <input
                          type="file"
                          required
                          onChange={createImg}
                          name="photo"
                          accept="image/jpeg,image/png"
                        />
                      </label>
                      <label>
                        <p>Текст</p>
                        <div>Чтобы разделять на абзацы, нажимайте на enter. Достаточно одного раза на абзац.</div>
                        <textarea name="text" required></textarea>
                      </label>
                      <label>
                        <p>Карта iframe</p>
                        <input
                          name="map"
                          placeholder="<iframe..."
                          required
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
export default AdminTurism;
