import React, { useState, useEffect } from "react";
import Footer from "../Components/Footer";
import CatalogSearch from "../Components/CatalogSearch";
import axios from "axios";
import Filter from "../Components/Filter";
import InfoAmusItem2 from "../Components/InfoAmusItem2";
import { read_cookie } from "sfcookies";
import * as JsSearch from "js-search";

const FoodPlace = (props) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [shop, setShop] = useState([]);
  const [basketCount, setBasketCount] = useState(read_cookie("basketCount"));
  const [products, setProducts] = useState([]);
  const [undefined1, setUndefined1] = useState(false);

  useEffect(() => {
    const params = window.location.search
      .replace("?", "")
      .split("&")
      .reduce(function (p, e) {
        var a = e.split("=");
        p[a[0]] = a[1];
        return p;
      }, {});
    axios({
      url: process.env.REACT_APP_SERV_URL,
      method: "post",
      data: {
        query: `
      query getFoods($shopId: String){
          getFoods(shopId:$shopId){
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
          shopId: props.match.params.shopId,
        },
      },
    }).then((result) => {
      let response = result.data.data.getFoods;
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
          setShop(response[0]);
          setProducts(paramproducts);
          setIsLoaded(true);
          // console.log(shop);
        } else {
          setIsLoaded(true);
          setUndefined1(true);
        }
      } else {
        var search = new JsSearch.Search("_id");
        search.addIndex("title");
        search.addDocuments(response[0].products);
        // console.log(response[0].products)
        setShop(response[0]);
        setProducts(search.search(decodeURIComponent(params.find)));
        setIsLoaded(true);
        // console.log(search.search(decodeURIComponent(params.find)))
      }
    });
  }, [props]);

  const newBasket = () => {
    setBasketCount(read_cookie("basketCount"));
  };

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
            <h2>Общепит не найден</h2>
            <a href="/Shops" className="gohome">
              На страницу Кафе, рестораны
            </a>
          </div>
        </div>
        <Footer />
      </>
    );
  } else if (shop.block) {
    return (
      <>
        <div className="catalogWrapper">
          <div className="catalogSides non">
            <h2 style={{ marginTop: 40 }}>Общепит заблокирован</h2>
            <a href="/Shops" className="gohome">
              На страницу Кафе, рестораны
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
                  <a href="/checkout_basket" data-products-count={basketCount}>
                    <img src="/images/basket.png" alt="Корзина" />
                  </a>
                </div>
                <div className="infoAmus">
                  <h3 className="shop">
                    <a href={window.location.pathname}>
                        <i>{shop.name}</i>
                    </a>
                  </h3>
                  <div className="infoAmus_typed_items">
                    <div className="infoAmus_items shop">
                      {products.map((item) => (
                        <InfoAmusItem2
                          key={item._id}
                          link={`/Food/${shop._id}/${item._id}`}
                          title={item.title}
                          image={item.photo}
                          price={item.price}
                          id={item._id}
                          shopId={shop._id}
                          newBasket={newBasket}
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
};
export default FoodPlace;
