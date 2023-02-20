import React, { Component } from "react";
import Footer from "../Components/Footer";
import SettingsFilt from "../Components/SettingsFilt";
import { read_cookie } from "sfcookies";
import axios from "axios";
import InfoAmusItem from "../Components/InfoAmusItem";
export default class TraderShops extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      role: "",
      message: undefined,
      createdNewsImg: [],
      myShops: [],
    };
  }
  async componentDidMount() {
    if (read_cookie("token").length !== 0) {
      await this.setState({
        role: read_cookie("role"),
      });
      if (this.state.role !== "trader") {
        this.props.history.push("/");
      }
    } else {
      this.props.history.push(`/Login/?next=${window.location.pathname}`);
    }
    await axios({
      url: process.env.REACT_APP_SERV_URL,
      method: "post",
      data: {
        query: `
        query{
            getShop{
              _id
              name
              description
              logo
              block
              categories{
                _id
                name
              }
            }
          }
            `,
      },
      headers: {
        authorization: read_cookie("token").replace("jwt", ""),
      },
    }).then((result) => {
      // console.log(result);
      if (result.data.data.getShop === null) {
        this.setState({
          myShops: [],
          isLoaded: true,
        });
      } else {
        this.setState({
          myShops: result.data.data.getShop,
          isLoaded: true,
        });
      }
      // console.log(this.state.myShops);
    });
  }

  createImg = (e) => {
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
        // console.log(res);
        this.setState({
          createdNewsImg: res.data,
        });
        input.className = "";
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  createShop = (e) => {
    e.preventDefault();
    var form = e.target;
    form.querySelector("button").disabled = true;
    axios({
      url: process.env.REACT_APP_SERV_URL,
      method: "POST",
      data: {
        query: `
                mutation postShop($name: String, $description: String, $logo: String, $user: String){
                postShop(data:{name: $name,description: $description, logo: $logo, user: $user}){
                    _id
                }
                }
                `,
        variables: {
          name: form.elements.title.value,
          description: form.elements.text.value,
          logo:
            process.env.REACT_APP_IMAGE_URL +
            "/static/" +
            this.state.createdNewsImg,
          user: read_cookie("userId"),
        },
      },
      headers: {
        authorization: read_cookie("token").replace("jwt", ""),
      },
    }).then(
      (result) => {
        // console.log(result.data);
        alert("Магазин создан!");
        form.reset();
        document.location.reload();
      },
      (error) => {
        alert(error);
        form.querySelector("button").disabled = false;
      }
    );
  };

  editShop = (e) => {
    e.preventDefault();
    var form = e.target;
    form.querySelector("button").disabled = true;
    let photo =
      process.env.REACT_APP_IMAGE_URL + "/static/" + this.state.createdNewsImg;
    if (this.state.createdNewsImg.length === 0) {
      photo = this.state.myShops.logo;
    }
    // console.log(photo);
    axios({
      url: process.env.REACT_APP_SERV_URL,
      method: "post",
      data: {
        query: `
            mutation updateShop($name: String,$description: String, $logo: String){
              updateShop(data: {name : $name, description: $description, logo: $logo})
              }
                  `,
        variables: {
          name: form.elements.title.value,
          description: form.elements.text.value,
          logo: photo,
        },
      },
      headers: {
        authorization: read_cookie("token").replace("jwt", ""),
      },
    }).then((result) => {
      // console.log(result.data);
      if (result.data.data.updateShop) {
        alert("Магазин обновлен.");
        window.location.reload();
      } else {
        alert(result.data.errors[0].message);
      }
      form.querySelector("button").disabled = false;
    });
  };

  createCategory = (e) => {
    // e.preventDefault();
    // let form = e.target;
    // const CATEGORY = gql`
    //   mutation postCategory($name: String, $id: String) {
    //     postCategory(data: { name: $name }, _id: $id)
    //   }
    // `;
    // const [getCategory] = useMutation(CATEGORY, {
    //   onCompleted: (data) => {
    // console.log(data.data);
    //     alert("Категория добавлена!");
    //     document.location.reload();
    //   },
    // });
    // getCategory({
    //   variables: {
    //     name: form.elements.category.value,
    //     id: this.state.myShops._id,
    //   },
    // });
    e.preventDefault();
    let form = e.target;
    form.querySelector("button").disabled = true;
    axios({
      url: process.env.REACT_APP_SERV_URL,
      method: "post",
      data: {
        query: `
                  mutation postCategory($name: String, $id: String){
                    postCategory(data:{name: $name},shopId:$id)
                    }
                  `,
        variables: {
          name: form.elements.category.value,
          id: this.state.myShops._id,
        },
      },
      headers: {
        authorization: read_cookie("token").replace("jwt", ""),
      },
    }).then(
      (result) => {
        // console.log(result.data);
        alert("Категория добавлена!");
        document.location.reload();
      },
      (error) => {
        alert(error);
        form.querySelector("button").disabled = false;
      }
    );
  };

  deleteCategory = (e) => {
    e.preventDefault();
    var answer = window.confirm(
      "Удалить категорию? Лучше поменять категории у товаров удалаемой категории."
    );
    if (answer) {
      let form = e.target;
      form.querySelector("button").disabled = true;
      // console.log(form.elements.category.value);
      // console.log(this.state.myShops._id);
      axios({
        url: process.env.REACT_APP_SERV_URL,
        method: "post",
        data: {
          query: `
                  mutation deleteCategory($categoryId: String!, $shopId: String){
                    deleteCategory(categoryId:$categoryId, shopId:$shopId)
                    }
                  `,
          variables: {
            categoryId: form.elements.category.value,
            shopId: this.state.myShops._id,
          },
        },
        headers: {
          authorization: read_cookie("token").replace("jwt", ""),
        },
      }).then(
        (result) => {
          // console.log(result.data);
          if (result.data.data.deleteCategory) {
            alert("Категория Удалена!");
            document.location.reload();
          } else {
            alert("Категория не найдена!");
          }
          form.reset();
        },
        (error) => {
          alert(error);
          form.querySelector("button").disabled = false;
        }
      );
    }
  };

  render() {
    window.scroll(0, 0);
    document.querySelector("body").classList.remove("active");
    const { isLoaded, myShops, role } = this.state;
    if (!isLoaded) {
      return (
        <div className="catalogWrapper">
          <div className="loader">
            <img src="/images/logoWhite.png" alt="" />
          </div>
        </div>
      );
    } else {
      return (
        <>
          <div className="catalogWrapper">
            <div className="catalogSides">
              <SettingsFilt role={role} />
              <div className="catologContent">
                <div className="infoAmus settings">
                  <h3>Мой магазин</h3>
                  <div className="infoAmus_typed_items">
                    <div className="infoAmus_items">
                      {myShops !== null && myShops.block === true ? (
                        <div className="danger" style={{ marginBottom: 40 }}>
                          Магазин заблокирован. Свяжитесь с админестрацией.
                        </div>
                      ) : (
                        ""
                      )}
                      {myShops !== null && myShops.length !== 0 ? (
                        <InfoAmusItem
                          key={myShops._id}
                          link={`/TraderShops/${myShops._id}`}
                          title={myShops.name}
                          image={myShops.logo}
                          firstText={myShops.description}
                        />
                      ) : (
                        <div>У вас пока нет магазинов.</div>
                      )}
                    </div>
                  </div>
                  {myShops !== null && myShops.length !== 0 ? (
                    <>
                      <div className="adminform">
                        <h4>Редактировать магазин</h4>
                        <form onSubmit={this.editShop} className="settingsForm">
                          <div className="formcontent">
                            <div className="labels">
                              <label>
                                <p>Название</p>
                                <input
                                  defaultValue={myShops.name}
                                  name="title"
                                  required
                                />
                              </label>
                              <label>
                                <p>Логотип</p>
                                <input
                                  type="file"
                                  onChange={this.createImg}
                                  name="photo"
                                  accept="image/jpeg,image/png"
                                />
                              </label>
                              <label>
                                <p>Краткое описание</p>
                                <textarea
                                  defaultValue={myShops.description}
                                  name="text"
                                  required
                                ></textarea>
                              </label>
                            </div>
                            {this.state.message !== undefined ? (
                              <div className="message">
                                {this.state.message}
                              </div>
                            ) : (
                              ""
                            )}
                            <button type="submit">Сохранить</button>
                          </div>
                        </form>
                      </div>
                      <div className="adminform">
                        <h4>Добавить категорию</h4>
                        <form
                          onSubmit={this.createCategory}
                          className="settingsForm"
                        >
                          <div className="formcontent">
                            <div className="labels">
                              <label>
                                <p>Категория</p>
                                <div>
                                  <input name="category" required />
                                  <button type="submit">Сохранить</button>
                                </div>
                              </label>
                            </div>
                          </div>
                        </form>
                      </div>
                      <div className="adminform">
                        <h4>Удалить категорию</h4>
                        <form
                          onSubmit={this.deleteCategory}
                          className="settingsForm"
                        >
                          <div className="formcontent">
                            <div className="labels">
                              <label>
                                <p>Категория</p>
                                <select name="category" required>
                                  {this.state.myShops.categories.map((item) =>
                                    item !== null ? (
                                      <option key={item._id} value={item._id}>
                                        {item.name}
                                      </option>
                                    ) : (
                                      ""
                                    )
                                  )}
                                </select>
                              </label>
                            </div>
                            <button type="submit">Сохранить</button>
                          </div>
                        </form>
                      </div>
                    </>
                  ) : (
                    <div className="adminform">
                      <h3>Создать магазин</h3>
                      <form onSubmit={this.createShop} className="settingsForm">
                        <div className="formcontent">
                          <div className="labels">
                            <label>
                              <p>Название</p>
                              <input name="title" required />
                            </label>
                            <label>
                              <p>Логотип</p>
                              <input
                                type="file"
                                onChange={this.createImg}
                                required
                                name="photo"
                                accept="image/jpeg,image/png"
                              />
                            </label>
                            <label>
                              <p>Краткое описание</p>
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
                  )}
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </>
      );
    }
  }
}
