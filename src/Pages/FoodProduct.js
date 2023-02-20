import React, { useState, useEffect } from "react";
import Footer from "../Components/Footer";
import axios from "axios";
import ProductItem2 from "../Components/ProductItem2";
import { NavLink } from "react-router-dom";
import { read_cookie } from "sfcookies";

const FoodProduct = (props) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [shop, setShop] = useState([]);
  const [basketCount, setBasketCount] = useState(read_cookie("basketCount"));
  const [product, setProduct] = useState([]);

  useEffect(() => {
    axios({
      url: process.env.REACT_APP_SERV_URL,
      method: "post",
      data: {
        query: `
              query getFoods($shopId: String){
                  getFoods(shopId:$shopId){
                      _id
                      name
                      block
                      products{
                          _id
                          title
                          photo
                          price
                          text
                          category
                      }
                  }
                }
                  `,
        variables: {
          shopId: props.match.params.shopId,
        },
      },
    }).then((result) => {
      // console.log(result.data.data.getFoods);
      if (result.data.data.getFoods) {
        setShop(result.data.data.getFoods[0]);
        for (let item of result.data.data.getFoods[0].products) {
          if (item._id === props.match.params.productId) {
            setProduct(item);
            setIsLoaded(true);
            // console.log(item)
          }
        }
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
  } else if (shop.block) {
    return (
      <>
        <div className="catalogWrapper">
          <div className="catalogSides non">
            <h2 style={{ marginTop: 40 }}>Общепит заблокирован</h2>
            <a href="/Shops" className="gohome">
              К кафе и ресторанам
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
              <a href="/checkout_basket" data-products-count={basketCount}>
                <img src="/images/basket.png" alt="Корзина" />
              </a>
            </div>
            <h3>
              <NavLink
                activeStyle={{ color: "#EE6812" }}
                to={`/Food/${shop._id}`}
              >
                <img src="/images/arrowback.png" alt="Назад" />{" "}
                <i>{shop.name}</i>
              </NavLink>
            </h3>
            <ProductItem2
              product={product}
              shopId={shop._id}
              newBasket={newBasket}
            />
          </div>
        </div>
        <Footer />
      </>
    );
  }
};
export default FoodProduct;
