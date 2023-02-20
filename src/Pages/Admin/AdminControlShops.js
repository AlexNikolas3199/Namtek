import React, { Component } from "react";
import Footer from "../../Components/Footer";
import SettingsFilt from "../../Components/SettingsFilt";
import { read_cookie } from "sfcookies";
import axios from "axios";
export default class AdminControlShops extends Component {
  constructor(props) {
    super(props);
    this.state = {
      role: "",
    };
  }

  async componentDidMount() {
    if (read_cookie("token").length !== 0) {
      await this.setState({
        role: read_cookie("role"),
      });
      if (this.state.role !== "admin") {
        this.props.history.push("/");
      }
    } else {
      this.props.history.push(`/login/?next=${window.location.pathname}`);
    }
  }

  deleteProduct = (e) => {
    e.preventDefault();
    let form = e.target;
    form.querySelector("button").disabled = true;
    var answer = window.confirm("Вы уверены что хотите удалить товар?");
    if (answer) {
      axios({
        url: process.env.REACT_APP_SERV_URL,
        method: "post",
        data: {
          query: `
                      mutation deleteProductAdmin($productId: String!,$shopId: String!){
                        deleteProductAdmin(productWhere: {productId:$productId}, shopWhere:{_id: $shopId}){_id}
                        }
                      `,
          variables: {
            shopId: form.elements.shop.value,
            productId: form.elements.product.value,
          },
        },
        headers: {
          authorization: read_cookie("token").replace("jwt", ""),
        },
      }).then((result) => {
        // console.log(result.data);
        if (result.data.data.deleteProductAdmin) {
          alert("Товар удален.");
        } else {
          alert("Товар не найден.");
        }
        form.querySelector("button").disabled = false;
        form.reset();
      });
    }
  };

  blockShop = (e) => {
    e.preventDefault();
    let form = e.target;
    form.querySelector("button").disabled = true;
    var answer = window.confirm("Вы уверены что хотите заблокировать магазин?");
    if (answer) {
      axios({
        url: process.env.REACT_APP_SERV_URL,
        method: "post",
        data: {
          query: `
              mutation updateShopAdmin($id: String!){
                updateShopAdmin(where: {_id: $id}, data: {block : true})
                }
                      `,
          variables: {
            id: form.elements.shop.value,
          },
        },
        headers: {
          authorization: read_cookie("token").replace("jwt", ""),
        },
      }).then((result) => {
        // console.log(result.data);
        if (result.data.data.updateShopAdmin) {
          alert("Магазин заблокирован.");
          form.reset();
        } else {
          alert("Магазин не найден.");
        }
        form.querySelector("button").disabled = false;
      });
    }
  };

  unblockShop = (e) => {
    e.preventDefault();
    let form = e.target;
    form.querySelector("button").disabled = true;
    var answer = window.confirm(
      "Вы уверены что хотите разблокировать магазин?"
    );
    if (answer) {
      axios({
        url: process.env.REACT_APP_SERV_URL,
        method: "post",
        data: {
          query: `
              mutation updateShopAdmin($id: String!){
                updateShopAdmin(where: {_id: $id}, data: {block : false})
                }
                    `,
          variables: {
            id: form.elements.shop.value,
          },
        },
        headers: {
          authorization: read_cookie("token").replace("jwt", ""),
        },
      }).then((result) => {
        // console.log(result.data);
        if (result.data.data.updateShopAdmin) {
          alert("Магазин разблокирован.");
          form.reset();
        } else {
          alert("Магазин не найден.");
        }
        form.querySelector("button").disabled = false;
      });
    }
  };
  deleteShop = (e) => {
    e.preventDefault();
    let form = e.target;
    form.querySelector("button").disabled = true;
    var answer = window.confirm(
      "Вы уверены что хотите удалить магазин? Информация о магазине и все товары будут потеряны."
    );
    if (answer) {
      axios({
        url: process.env.REACT_APP_SERV_URL,
        method: "post",
        data: {
          query: `
                        mutation deleteShopAdmin($id: String!){
                          deleteShopAdmin(where: {_id: $id}){_id}
                          }
                        `,
          variables: {
            id: form.elements.shop.value,
          },
        },
        headers: {
          authorization: read_cookie("token").replace("jwt", ""),
        },
      }).then((result) => {
        // console.log(result.data);
        if (result.data.data.deleteShopAdmin) {
          alert("Магазин удален.");
        } else {
          alert("Магазин не найден.");
        }
        form.querySelector("button").disabled = false;
        form.reset();
      });
    }
  };

  render() {
    window.scroll(0, 0);
    document.querySelector("body").classList.remove("active");
    const { role } = this.state;
    return (
      <>
        <div className="catalogWrapper">
          <div className="catalogSides">
            <SettingsFilt role={role} />
            <div className="catologContent">
              <div className="infoAmus settings">
                <h3>Контроль магазинов</h3>
                <div className="adminform">
                  <h4>Удалить товар</h4>
                  <form onSubmit={this.deleteProduct} className="settingsForm">
                    <div className="formcontent">
                      <div className="labels">
                        <label>
                          <p>id магазина</p>
                          <input name="shop" required />
                        </label>
                        <label>
                          <p>id товара</p>
                          <input name="product" required />
                        </label>
                      </div>
                      <button type="submit">Сохранить</button>
                    </div>
                  </form>
                </div>
                <div className="adminform">
                  <h4>Заблокировать магазин</h4>
                  <form onSubmit={this.blockShop} className="settingsForm">
                    <div className="formcontent">
                      <div className="labels">
                        <label>
                          <p>id магазина</p>
                          <div>
                            <input name="shop" required />
                            <button type="submit">Сохранить</button>
                          </div>
                        </label>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="adminform">
                  <h4>Снять блокирование магазина</h4>
                  <form onSubmit={this.unblockShop} className="settingsForm">
                    <div className="formcontent">
                      <div className="labels">
                        <label>
                          <p>id магазина</p>
                          <div>
                            <input name="shop" required />
                            <button type="submit">Сохранить</button>
                          </div>
                        </label>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="adminform">
                  <h4>Удалить магазин</h4>
                  <form onSubmit={this.deleteShop} className="settingsForm">
                    <div className="formcontent">
                      <div className="labels">
                        <label>
                          <p>id магазина</p>
                          <div>
                            <input name="shop" required />
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
