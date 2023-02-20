import React, { Component } from "react";
import Footer from "../Components/Footer";
import CatalogSearch from "../Components/CatalogSearch";
import BasketItem from "../Components/BasketItem";
import { bake_cookie, read_cookie, delete_cookie } from "sfcookies";
import axios from "axios";
export default class Basket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalPrice: 0,
      quantity: 0,
      basketproducts: [],
      isLoaded: false,
    };
    this.updateUp = this.updateUp.bind(this);
    this.updateDown = this.updateDown.bind(this);
    this.removeItem = this.removeItem.bind(this);
  }
  async componentDidMount() {
    if (read_cookie("product").length !== 0) {
      await axios({
        url: process.env.REACT_APP_SERV_URL,
        method: "post",
        data: {
          query: `
            query getShops($shopId: String){
                getShops(shopId:$shopId){
                    name
                    products{
                        _id
                        title
                        photo
                        price
                    }
                }
              }
                `,
          variables: {
            shopId: read_cookie("product").split(",")[0],
          },
        },
      }).then((result) => {
        // console.log(result);
        if (result.data.data.getShops !== null) {
          let cookie = read_cookie("product").split(",");
          cookie.splice(-1, 1);
          cookie.splice(0, 1);
          let basketproducts = [];
          for (let basketId of cookie) {
            for (let product of result.data.data.getShops[0].products) {
              if (basketId === product._id) {
                basketproducts.push(product);
              }
            }
          }
          this.setState({
            basketproducts,
            isLoaded: true,
            shopName: result.data.data.getShops[0].name,
            shopId: read_cookie("product").split(",")[0],
          });
        } else {
          this.setState({
            isFood: true,
          });
        }
      });
    } else {
      this.setState({
        isLoaded: true,
      });
    }
    if (this.state.isFood) {
      await axios({
        url: process.env.REACT_APP_SERV_URL,
        method: "post",
        data: {
          query: `
          query getFoods($shopId: String){
              getFoods(shopId:$shopId){
                  name
                  products{
                      _id
                      title
                      photo
                      price
                  }
              }
            }
              `,
          variables: {
            shopId: read_cookie("product").split(",")[0],
          },
        },
      }).then((result) => {
        // console.log(result);
        let cookie = read_cookie("product").split(",");
        cookie.splice(-1, 1);
        cookie.splice(0, 1);
        let basketproducts = [];
        for (let basketId of cookie) {
          for (let product of result.data.data.getFoods[0].products) {
            if (basketId === product._id) {
              basketproducts.push(product);
            }
          }
        }
        this.setState({
          basketproducts,
          isLoaded: true,
          shopName: result.data.data.getFoods[0].name,
          shopId: read_cookie("product").split(",")[0],
        });
      });
    }
  }

  async updateUp(p) {
    this.setState((state) => ({
      totalPrice: state.totalPrice + Number(p),
    }));
    this.setState((state) => ({
      quantity: state.quantity + 1,
    }));
  }

  async updateDown(p, q, i) {
    this.setState((state) => ({
      totalPrice: state.totalPrice - Number(p),
    }));
    await this.setState((state) => ({
      quantity: state.quantity - 1,
    }));
    let actualProdQuan = read_cookie("productCount").split(",");
    actualProdQuan.splice(-1, 1);
    actualProdQuan[i] = q;
    bake_cookie("productCount", `${actualProdQuan},`);
    // console.log(read_cookie("productCount"));
  }

  removeItem = (p, q, id, i) => (e) => {
    this.setState((state) => ({
      totalPrice: state.totalPrice - p * q,
    }));
    e.target.parentNode.parentNode.parentNode.remove();
    let cookie = read_cookie("product").split(",");
    cookie.splice(-1, 1);
    bake_cookie("basketCount", `${cookie.length - 2}`);
    let str = "";
    for (let basketId of cookie) {
      if (basketId !== id) {
        str += basketId + ",";
      }
    }
    bake_cookie("product", `${str}`);
    // console.log(read_cookie("product"));
    if (str.split(",").length === 2) {
      delete_cookie("product");
      delete_cookie("basketCount");
    }
    let actualProdQuan = read_cookie("productCount").split(",");
    actualProdQuan.splice(-1, 1);
    actualProdQuan.splice(i, 1);
    if (actualProdQuan.length === 0) {
      delete_cookie("productCount");
    } else {
      bake_cookie("productCount", `${actualProdQuan},`);
    }
    window.location.reload();
  };

  getOrder = (e) => {
    if (read_cookie("token").length === 0) {
      document.location.href = `/Login/?next=${window.location.pathname}`;
    }
    let button = e.target;
    if (read_cookie("product") !== 0) {
      button.disabled = true;
      let myproducts = [];
      for (let i = 0; i < this.state.basketproducts.length; i++) {
        myproducts.push({
          productId: this.state.basketproducts[i]._id,
          count: Number(read_cookie("productCount").split(",")[i]),
        });
      }
      // console.log(this.state.basketproducts)
      // console.log(read_cookie('productCount'))
      // console.log(myproducts)
      if (!this.state.isFood) {
        axios({
          url: process.env.REACT_APP_SERV_URL,
          method: "post",
          data: {
            query: `
            mutation checkoutCart($shopId: String!, $product: [CartProduct!] ) {
              checkoutCart(where:{shopId: $shopId, product: $product})
            }
                  `,
            variables: {
              shopId: read_cookie("product").split(",")[0],
              product: myproducts,
            },
          },
          headers: {
            authorization: read_cookie("token").replace("jwt", ""),
          },
        }).then(
          (result) => {
            // console.log(result);
            if (result.data.data.checkoutCart) {
              alert(
                "Заказ оформлен! Ожидайте звонка с магазина. Чек направлен на вашу почту (Проверьте спам)."
              );
              delete_cookie("basketCount");
              delete_cookie("product");
              delete_cookie("productCount");
              document.location.href = "Shops";
            } else {
              alert(result.data.errors[0].message);
              button.disabled = false;
            }
          },
          (error) => {
            console.log(error);
            button.disabled = false;
          }
        );
      } else {
        axios({
          url: process.env.REACT_APP_SERV_URL,
          method: "post",
          data: {
            query: `
            mutation checkoutFoodCart($shopId: String!, $product: [CartProduct!] ) {
              checkoutFoodCart(where:{shopId: $shopId, product: $product})
            }
                  `,
            variables: {
              shopId: read_cookie("product").split(",")[0],
              product: myproducts,
            },
          },
          headers: {
            authorization: read_cookie("token").replace("jwt", ""),
          },
        }).then(
          (result) => {
            // console.log(result);
            if (result.data.data.checkoutFoodCart) {
              alert(
                "Заказ оформлен! Ожидайте звонка. Чек направлен на вашу почту (Проверьте спам)."
              );
              delete_cookie("basketCount");
              delete_cookie("product");
              delete_cookie("productCount");
              document.location.href = "Food";
            } else {
              alert(result.data.errors[0].message);
              button.disabled = false;
            }
          },
          (error) => {
            console.log(error);
            button.disabled = false;
          }
        );
      }
    } else {
      alert("В коризине нет товаров.");
      button.disabled = false;
    }
  };
  getBasketItem(basketproducts) {
    let content = [];
    for (let i = 0; i < basketproducts.length; i++) {
      content.push(
        <BasketItem
          key={basketproducts[i]._id}
          index={i}
          shopId={this.state.shopId}
          isFood={this.state.isFood}
          id={basketproducts[i]._id}
          img={basketproducts[i].photo}
          title={basketproducts[i].title}
          price={basketproducts[i].price}
          updateUp={this.updateUp}
          updateDown={this.updateDown}
          removeItem={this.removeItem}
        />
      );
    }
    return content;
  }
  render() {
    if (!this.state.isLoaded) {
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
          <div className="catalogWrapper basket">
            <CatalogSearch />
            <div className="basketWrapper">
              <h3>
                Корзина —{" "}
                <a
                  href={`/${this.state.isFood ? "Food" : "Shops"}/${
                    this.state.shopId
                  }`}
                >
                  {this.state.shopName}
                </a>{" "}
              </h3>
              <div className="basket">
                <div className="products">
                  {this.getBasketItem(this.state.basketproducts)}
                  {this.state.totalPrice !== 0 ? (
                    ""
                  ) : (
                    <div className="basket_product none">
                      <div>
                        Ваша корзина не содержит товаров. Давайте исправим это!
                      </div>
                      <a href="/Shops" className="gohome">
                        Перейти к магазинам
                      </a>
                      <a href="/Food" className="gohome">
                        Кафе, рестораны
                      </a>
                    </div>
                  )}
                </div>
                <div className="total">
                  <div className="price">
                    <h5>Итого:</h5>
                    <div>
                      {this.state.totalPrice
                        .toString()
                        .replace(/(\d)(?=(\d{3})+(\D|$))/g, "$1 ")}{" "}
                      ₽
                    </div>
                  </div>
                  <button onClick={this.getOrder}>Оформить заказ</button>
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
