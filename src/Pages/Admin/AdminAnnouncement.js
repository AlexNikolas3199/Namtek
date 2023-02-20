import React, { Component } from "react";
import Footer from "../../Components/Footer";
import SettingsFilt from "../../Components/SettingsFilt";
import { read_cookie } from "sfcookies";
import axios from "axios";
export default class AdminAnnouncement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      role: "",
      message: undefined,
      createdNewsImg: null,
    };
  }

  async componentDidMount() {
    if (read_cookie("token").length !== 0) {
      await this.setState({
        role: read_cookie("role"),
      });
      if (this.state.role === "admin" || this.state.role === "editorNews") {
      } else {
        this.props.history.push("/");
      }
    } else {
      this.props.history.push(`/login/?next=${window.location.pathname}`);
    }
  }

  createImg = (e) => {
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
        this.setState({
          createdNewsImg: res.data,
        });
        input.className=""
      })
      .catch((err) => {
        console.log(err);
        input.className=""
      });
  };

  createAnnouncement = (e) => {
    e.preventDefault();
    var form = e.target;
    form.querySelector("button").disabled = true;
    axios({
      url: process.env.REACT_APP_SERV_URL,
      method: "post",
      data: {
        query: `
                        mutation addAnnouncement($title: String!, $text: String!, $photo: String, $startDate: String, $time: String){
                        addAnnouncement(data:{title: $title, text: $text, photo: $photo, startDate: $startDate, time: $time}){
                            title
                        }
                        }
                        `,
        variables: {
          title: form.elements.title.value,
          text: form.elements.text.value,
          photo:
              process.env.REACT_APP_IMAGE_URL+"/static/" +
            this.state.createdNewsImg,
          startDate: form.elements.date.value,
          time: form.elements.time.value,
        },
      },
      headers: {
        authorization: read_cookie("token").replace("jwt", ""),
      },
    }).then(
      (data) => {
        if (data.data.data.addAnnouncement) {
          // console.log(data);
          this.setState({
            message: "Анонс успешно создан!",
          });
          form.reset();
          form.querySelector("button").disabled = false;
        } else {
          // console.log(data);
          this.setState({
            message: data.msg,
          });
          form.querySelector("button").disabled = false;
        }
      },
      (error) => {
        this.setState({
          message: error.message,
        });
        form.querySelector("button").disabled = false;
      }
    );
  };

  deleteAnnouncement = (e) => {
    e.preventDefault();
    var form = e.target;
    form.querySelector("button").disabled = true;
    axios({
      url: process.env.REACT_APP_SERV_URL,
      method: "post",
      data: {
        query: `
                mutation deleteAnnouncement($id: String!){
                    deleteAnnouncement(where:{ _id: $id }){
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
      // console.log(result.data);
      if (result.data.data.deleteAnnouncement) {
        alert("Анонс удален.");
      } else {
        alert("Анонс не найден.");
      }
      form.querySelector("button").disabled = false;
      form.reset();
    });
  };

  render() {
    window.scroll(0, 0);
    document.querySelector("body").classList.remove("active");
    return (
      <>
        <div className="catalogWrapper">
          <div className="catalogSides">
            <SettingsFilt role={this.state.role} />
            <div className="catologContent">
              <div className="infoAmus settings">
                <h3>Управление новостями</h3>
                <div className="adminform">
                  <h4>Создать анонс</h4>
                  <form
                    onSubmit={this.createAnnouncement}
                    className="settingsForm"
                  >
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
                            onChange={this.createImg}
                            name="photo"
                            accept="image/jpeg,image/png"
                          />
                        </label>
                        <label>
                          <p>Текст</p>
                          <textarea name="text" required></textarea>
                        </label>
                        <label>
                          <p>Дата события</p>
                          <input name="date" type="date" required />
                        </label>
                        <label>
                          <p>Время события</p>
                          <input name="time" type="time" required />
                        </label>
                      </div>
                      {this.state.message !== undefined ? (
                        <div className="message">{this.state.message}</div>
                      ) : (
                        ""
                      )}
                      <button type="submit">Сохранить</button>
                    </div>
                  </form>
                </div>
                <div className="adminform">
                  <h4>Удалить анонс</h4>
                  <form
                    onSubmit={this.deleteAnnouncement}
                    className="settingsForm"
                  >
                    <div className="formcontent">
                      <div className="labels">
                        <label>
                          <p>id анонса</p>
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
  }
}
