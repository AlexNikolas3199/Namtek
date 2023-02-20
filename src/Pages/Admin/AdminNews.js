import React, { Component } from "react";
import Footer from "../../Components/Footer";
import SettingsFilt from "../../Components/SettingsFilt";
import { read_cookie } from "sfcookies";
import axios from "axios";
export default class AdminNews extends Component {
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
      this.props.history.push(`/Login/?next=${window.location.pathname}`);
    }
  }

  createImg = (e) => {
    let input = e.target;
    let images = [];
    for (let item of e.target.files) {
      input.className = "disabled";
      let fd = new FormData();
      fd.append("image", item);
      axios({
        method: "post",
        url: process.env.REACT_APP_IMAGE_URL + "/photo",
        data: fd,
      })
        .then((res) => {
          console.log(res)
          images.push(res.data);
          this.setState({
            createdNewsImg: images,
          });
          input.className = "";
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  createNews = (e) => {
    e.preventDefault();
    var form = e.target;
    form.querySelector("button").disabled = true;
      axios({
        url: process.env.REACT_APP_SERV_URL,
        method: "post",
        data: {
          query: `
                        mutation addNews($title: String!, $text: String!, $photo: String){
                        addNews(data:{title: $title, text: $text, photo: $photo}){
                            title
                        }
                        }
                        `,
          variables: {
            title: form.elements.title.value,
            text: form.elements.text.value,
            photo:
              process.env.REACT_APP_IMAGE_URL +
              "/static/" +
              this.state.createdNewsImg,
          },
        },
        headers: {
          authorization: read_cookie("token").replace("jwt", ""),
        },
      }).then(
        (data) => {
          if (data.data.data.addNews) {
            //   console.log(data)
            this.setState({
              message: "Новость успешно создана!",
            });
            form.reset();
            form.querySelector("button").disabled = false;
          } else {
            //   console.log(data)
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
        }
      );
  };

  deleteNews = (e) => {
    e.preventDefault();
    var form = e.target;
    form.querySelector("button").disabled = true;
    axios({
      url: process.env.REACT_APP_SERV_URL,
      method: "post",
      data: {
        query: `
                mutation deleteNews($id: String!){
                    deleteNews(where:{ _id: $id }){
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
      //   console.log(result.data);
      if (result.data.data.deleteNews) {
        alert("Новость удалена.");
      } else {
        alert("Новость не найдена.");
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
                  <h4>Создать новость</h4>
                  <form onSubmit={this.createNews} className="settingsForm">
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
                            multiple
                            onChange={this.createImg}
                            name="photo"
                            accept="image/jpeg,image/png"
                          />
                        </label>
                        <label>
                          <p>Текст</p>
                          <div>
                            Чтобы разделить на абзацы используйте ENTER.
                          </div>
                          <textarea name="text" required></textarea>
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
                  <h4>Удалить новость</h4>
                  <form onSubmit={this.deleteNews} className="settingsForm">
                    <div className="formcontent">
                      <div className="labels">
                        <label>
                          <p>id новости</p>
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
