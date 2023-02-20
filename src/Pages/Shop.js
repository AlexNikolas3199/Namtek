import React, { Component } from "react";
import Footer from "../Components/Footer";
import CatalogSearch from "../Components/CatalogSearch";
import axios from "axios";
import Filter from "../Components/Filter";
import InfoAmusItem2 from "../Components/InfoAmusItem2";
import { read_cookie } from "sfcookies";
import * as JsSearch from "js-search";

export default class Shop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      message: undefined,
      shop: [],
      basketCount: read_cookie('basketCount')
    };
  }
  async componentDidMount() {
    const params = window.location.search
      .replace("?", "")
      .split("&")
      .reduce(function (p, e) {
        var a = e.split("=");
        p[a[0]] = a[1];
        return p;
      }, {});
    await axios({
      url: process.env.REACT_APP_SERV_URL,
      method: "post",
      data: {
        query: `
        query getShops($shopId: String){
            getShops(shopId:$shopId){
                _id
                name
                user
                block
                products{
                    _id
                    title
                    photo
                    price
                    category
                }
                categories{
                    _id
                    name
                }
            }
          }
            `,
        variables: {
          shopId: this.props.match.params.shopId,
        },
      },
    }).then((result) => {
      let response = result.data.data.getShops
      if (!params.find) {
      if (response !== null) {
        let param = window.location.search.replace("?category=", "");
        let paramproducts = [];
        for (let i = 0; i < response[0].products.length; i++) {
          if (response[0].products[i].category === param) {
            paramproducts.push(response[0].products[i]);
          }
        }
        if (paramproducts.length === 0) {
          paramproducts = response[0].products;
        }
        this.setState({
          shop: response[0],
          products: paramproducts,
          isLoaded: true,
        });
        // console.log(this.state.shop);
      } else {
        this.setState({
          isLoaded: true,
          undefined1: true,
        });
      }
    }else{
      var search = new JsSearch.Search("_id");
      search.addIndex("title");
      search.addDocuments(response[0].products);
      // console.log(response[0].products)
      this.setState({
        shop: response[0],
        products: search.search(decodeURIComponent(params.find)),
        isLoaded: true,
      });
      // console.log(search.search(decodeURIComponent(params.find)))

    }
    });
  }
  newBasket=()=>{
    this.setState({
      basketCount: read_cookie('basketCount')
    })
  }
  render() {
    const { shop, isLoaded, products, undefined1 } = this.state;
    if (!isLoaded) {
      return (
          <div className="catalogWrapper">
            <div className="loader">
              <img src="/images/logoWhite.png" alt="" />
            </div>
          </div>
      );
    } else if (undefined1) {
      return (
        <>
          <div className="catalogWrapper">
            <div className="catalogSides non">
              <h2>Магазин не найден</h2>
              <a href="/Shops" className="gohome">
                К магазинам
              </a>
            </div>
          </div>
          <Footer />
        </>
      );
    }
  else if (shop.block) {
    return (
      <>
        <div className="catalogWrapper">
          <div className="catalogSides non">
            <h2 style={{marginTop: 40}}>Магазин заблокирован</h2>
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
            <CatalogSearch />
            <div className="catalogSides shop">
              <Filter
                name="Категории"
                parameters={shop.categories.map((item) =>
                  item !== null
                    ? { name: "category", value: item._id, title: item.name }
                    : ""
                )}
              />
              <div className="catologContent">
                <div className="infoAmus_container">
                  <div className="basketLink">
                    <a href="/checkout_basket" data-products-count={this.state.basketCount}>
                      <img src="/images/basket.png" alt="Корзина" />
                    </a>
                  </div>
                  <div className="infoAmus">
                    <h3 className="shop">
                      <a href={window.location.pathname}>
                        Магазин <i>{shop.name}</i>
                      </a>
                    </h3>
                    <div className="infoAmus_typed_items">
                      <div className="infoAmus_items shop">
                        {products.map((item) => (
                          <InfoAmusItem2
                            key={item._id}
                            link={`/Shops/${shop._id}/${item._id}`}
                            title={item.title}
                            image={item.photo}
                            price={item.price}
                            id={item._id}
                            shopId={shop._id}
                            newBasket={this.newBasket}
                          />
                        ))}
                      </div>
                    </div>
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
