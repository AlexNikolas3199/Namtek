import React, { Component } from "react";
import Footer from "../Components/Footer";
import axios from "axios";
import ProductItem2 from "../Components/ProductItem2";
import { NavLink } from "react-router-dom";
import { read_cookie } from "sfcookies";

export default class ShopProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      message: undefined,
      shop: [],
      product: [],
      basketCount: read_cookie("basketCount"),
    };
  }
  async componentDidMount() {
    await axios({
      url: process.env.REACT_APP_SERV_URL,
      method: "post",
      data: {
        query: `
        query getShops($shopId: String){
            getShops(shopId:$shopId){
                _id
                name
                block
                products{
                    _id
                    title
                    photo
                    price
                    text
                }
            }
          }
            `,
        variables: {
          shopId: this.props.match.params.shopId,
        },
      },
    }).then((result) => {
      // console.log(result)
      if (result.data.data.getShops) {
        this.setState({
          shop: result.data.data.getShops[0],
        });
        for (let i = 0; i < this.state.shop.products.length; i++) {
          if (
            this.state.shop.products[i]._id ===
            this.props.match.params.productId
          ) {
            this.setState({
              product: this.state.shop.products[i],
              isLoaded: true,
            });
            // console.log(this.state.shop.products[i])
          }
        }
      }
    });
  }
  newBasket = () => {
    this.setState({
      basketCount: read_cookie("basketCount"),
    });
  };
  render() {
    const { shop, isLoaded, product } = this.state;
    if (!isLoaded) {
      return (
        <div className="catalogWrapper">
          <div className="loader">
            <img src="/images/logoWhite.png" alt="" />
          </div>
        </div>
      );
    } else if (shop.block) {
      return (
        <>
          <div className="catalogWrapper">
            <div className="catalogSides non">
              <h2 style={{ marginTop: 40 }}>Магазин заблокирован</h2>
              <a href="/Shops" className="gohome">
                К магазинам
              </a>
            </div>
          </div>
          <Footer />
        </>
      );
    } else {
      return (
        <>
          <div className="catalogWrapper">
            <div className="productWrapper">
              <div className="basketLink">
                <a
                  href="/checkout_basket"
                  data-products-count={this.state.basketCount}
                >
                  <img src="/images/basket.png" alt="Корзина" />
                </a>
              </div>
              <h3>
                <NavLink
                  activeStyle={{ color: "#EE6812" }}
                  to={`/Shops/${shop._id}`}
                >
                  <img src="/images/arrowback.png" alt="Назад" />{" "}
                  <i>{shop.name}</i>
                </NavLink>
              </h3>
              <ProductItem2
                product={product}
                shopId={shop._id}
                newBasket={this.newBasket}
              />
            </div>
          </div>
          <Footer />
        </>
      );
    }
  }
}
