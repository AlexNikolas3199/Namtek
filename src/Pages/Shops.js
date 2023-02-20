import React, { Component } from "react";
import Footer from "../Components/Footer";
import CatalogSearch from "../Components/CatalogSearch";
import InfoAmusItem from "../Components/InfoAmusItem";
import axios from "axios";
import { read_cookie } from "sfcookies";
import * as JsSearch from "js-search";

export default class Shops extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      message: undefined,
      shops: [],
      basketCount: read_cookie("basketCount"),
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
        query{
            getShops{
              _id
              name
              description
              logo
              block
            }
          }
            `,
      },
    }).then((result) => {
      let shops = [];
      // console.log(result.data.data.getShops)
      if (!params.find) {
        for (let item of result.data.data.getShops) {
          if (!item.block) {
            shops.push(item);
          }
        }
      } else {
        var search = new JsSearch.Search("_id");
        search.addIndex("name");
        search.addIndex("description");
        // console.log(decodeURIComponent(params.find))
        search.addDocuments(result.data.data.getShops);
        shops = search.search(decodeURIComponent(params.find))
      }
      this.setState({
        shops,
        isLoaded: true,
      });
      // console.log(this.state.shops);
    });
  }
  render() {
    const { shops, isLoaded } = this.state;
    window.scroll(0, 0);
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
            <CatalogSearch />
            <div className="catalogSides shop">
              <div className="filterbox">
                <div className="advbanner">
                  <img src="/images/mong.jpg" alt="" />
                </div>
              </div>
              <div className="catologContent">
                <div className="infoAmus_container">
                  <div className="basketLink">
                    <a
                      href="/checkout_basket"
                      data-products-count={this.state.basketCount}
                    >
                      <img src="/images/basket.png" alt="Корзина" />
                    </a>
                  </div>
                  <div className="infoAmus">
                    <h3>Магазины</h3>
                    <div className="infoAmus_typed_items">
                      <div className="infoAmus_items">
                        {shops.map((item) => (
                          <InfoAmusItem
                            key={item._id}
                            link={`/shops/${item._id}`}
                            title={item.name}
                            image={item.logo}
                            firstText={item.description}
                          />
                        ))}
                        {shops.length === 0 ? 'Ничего не найдено' :''}
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
