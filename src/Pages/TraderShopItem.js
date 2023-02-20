import React, { Component } from "react";
import Footer from "../Components/Footer";
import SettingsFilt from "../Components/SettingsFilt";
import { read_cookie } from "sfcookies";
import axios from "axios";
export default class TraderShopItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      role: "",
      createdNewsImg: [],
      products: [],
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
                  categories{
                    _id
                    name
                  }
                  products{
                    photo
                    price
                    title
                    _id
                  }
                }
              }
                `,
      },
      headers: {
        authorization: read_cookie("token").replace("jwt", ""),
      },
    }).then(
      (result) => {
        // console.log(result);
        this.setState({
          myShops: result.data.data.getShop,
          products: result.data.data.getShop.products,
          isLoaded: true,
        });
        // console.log(this.state.myShops);
        // console.log(this.state.products);
      },
      (error) => {
        console.log(error.message);
      }
    );
  }

  deleteShop = () => {
    var answer = window.confirm(
      "Вы уверены что хотите удалить магазин? Информация о магазине и все товары будут потеряны."
    );
    if (answer) {
      axios({
        url: process.env.REACT_APP_SERV_URL,
        method: "post",
        data: {
          query: `
                            mutation deleteShop{
                              deleteShop{_id}
                              }
                            `,
        },
        headers: {
          authorization: read_cookie("token").replace("jwt", ""),
        },
      }).then((result) => {
        // console.log(result.data);
        if (result.data.data.deleteShop) {
          alert("Магазин удален.");
          this.props.history.push("/TraderShops");
        } else {
          alert("Магазин не найден.");
        }
      });
    }
  };

  createProduct = (e) => {
    e.preventDefault();
    let form = e.target;
    form.querySelector("button").disabled = true;
    axios({
      url: process.env.REACT_APP_SERV_URL,
      method: "post",
      data: {
        query: `
                  mutation addProduct($title: String, $photo: String, $text: String, $price: String, $category: String){
                    addProduct(data:{title: $title,photo: $photo,text: $text, price:$price, category:$category}){_id}
                    }
                  `,
        variables: {
          title: form.elements.title.value,
          photo:
            process.env.REACT_APP_IMAGE_URL +
            "/static/" +
            this.state.createdNewsImg,
          text: form.elements.text.value,
          price: form.elements.price.value,
          category: form.elements.category.value,
        },
      },
      headers: {
        authorization: read_cookie("token").replace("jwt", ""),
      },
    }).then(
      (result) => {
        // console.log(result.data);
        if (result.data.data.addProduct) {
          alert("Продукт добавлен!");
          document.location.reload();
        } else {
          alert("Продукт не был добавлен!");
        }
      },
      (error) => {
        alert(error);
        form.querySelector("button").disabled = false;
      }
    );
  };

  createImg = (e) => {
    let input = e.target;
    input.className = "disabled";
    for (let item of e.target.files) {
      let fd = new FormData();
      fd.append("image", item);
      axios({
        method: "post",
        url: process.env.REACT_APP_IMAGE_URL + "/photo",
        data: fd,
      })
        .then((res) => {
          // console.log(res);
          this.setState({
            createdNewsImg: [...this.state.createdNewsImg, res.data],
          });
          input.className = "";
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  render() {
    window.scroll(0, 0);
    const { isLoaded, products, role } = this.state;
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
                  <div className="adminform">
                    <h3>Создать товар</h3>
                    <form
                      onSubmit={this.createProduct}
                      className="settingsForm"
                    >
                      <div className="formcontent">
                        <div className="labels">
                          <label>
                            <p>Название</p>
                            <input name="title" required />
                          </label>
                          <label>
                            <p>Изображения</p>
                            <input
                              type="file"
                              onChange={this.createImg}
                              required
                              multiple
                              name="photo"
                              accept="image/jpeg,image/png"
                            />
                          </label>
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
                          <label>
                            <p>Описание</p>
                            <textarea name="text" required></textarea>
                          </label>
                          <label>
                            <p>Цена</p>
                            <input name="price" type="number" required />
                          </label>
                        </div>
                        <button type="submit">Сохранить</button>
                      </div>
                    </form>
                  </div>
                  <div className="infoAmus_typed_items">
                    <h3>Товары</h3>
                    <div className="infoAmus_items shop">
                      {products.length !== 0 ? (
                        products.map((item) => (
                          <div key={item._id} className="infoAmusItem new">
                            <a href={`/TraderShops/myShop/${item._id}`}>
                              <img src={item.photo.split(",")[0]} alt="" />
                            </a>
                            <span>
                              <div>
                                <a href={`/TraderShops/myShop/${item._id}`}>
                                  <h5>{item.title}</h5>
                                  <div className="worktime">
                                    {item.price
                                      .toString()
                                      .replace(
                                        /(\d)(?=(\d{3})+(\D|$))/g,
                                        "$1 "
                                      )}{" "}
                                    ₽
                                  </div>
                                </a>
                              </div>
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="adminform">Здесь пока нет товаров.</div>
                      )}
                    </div>
                  </div>
                  <div className="adminform">
                    <h4 onClick={this.deleteShop} className="danger">
                      Удалить магазин
                    </h4>
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
}
