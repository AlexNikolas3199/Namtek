import React, { useState, useEffect } from "react";
import Footer from "../Components/Footer";
import { read_cookie } from "sfcookies";
import InfoAmusItem from "../Components/InfoAmusItem";
import Axios from "axios";
const Turbases = () => {
  const [tourbases, setTourbases] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    Axios({
      url: process.env.REACT_APP_SERV_URL,
      method: "post",
      data: {
        query: `
            query getTourism{
              getTourism{
                  _id
                  title
                  text
                  map
                  photo
                }
              }
                `,
      },
    }).then((result) => {
      if (result.data.data.getTourism) {
        setTourbases(result.data.data.getTourism);
        setIsLoaded(true);
      }
      // console.log(result.data.data);
    });
  }, []);
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
          <div className="catalogSides fix">
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
                    data-products-count={read_cookie("basketCount")}
                  >
                    <img src="/images/basket.png" alt="Корзина" />
                  </a>
                </div>
                <div className="infoAmus">
                  <h3>Туризм</h3>
                  <div className="infoAmus_typed_items">
                    <div className="infoAmus_items">
                      {tourbases.length !== 0
                        ? tourbases.map((item) => (
                            <InfoAmusItem
                              catalogType="Туризм"
                              key={item._id}
                              link={`/tourism/${item._id}`}
                              title={item.title}
                              image={item.photo}
                              firstText={item.text.slice(0, 103) + "..."}
                            />
                          ))
                        : ""}
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
export default Turbases;
