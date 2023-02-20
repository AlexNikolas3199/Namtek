import React, { useState, useEffect } from "react";
import Footer from "../Components/Footer";
import CatalogSearch from "../Components/CatalogSearch";
import axios from "axios";
import InfoAmusItem1 from "../Components/InfoAmusItem1";
import { read_cookie } from "sfcookies";
const Services = (props) => {
  const [services, setServices] = useState([]);
  const [count, setCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const params = window.location.search
      .replace("?", "")
      .split("&")
      .reduce(function (p, e) {
        var a = e.split("=");
        p[a[0]] = a[1];
        return p;
      }, {});
    let page = 1;
    if (params.page) {
      page = Number(params.page);
    }
    axios({
      url: process.env.REACT_APP_SERV_URL,
      method: "post",
      data: {
        query: `
          query getOtherPageCount($type: String!){
            getOtherPageCount( where: {type: $type})
          }
             `,
        variables: {
          type: props.match.params.type,
        },
      },
    }).then((result) => {
      if (result.data.data.getOtherPageCount) {
        setCount(result.data.data.getOtherPageCount);
      }
      // console.log(result.data.data);
    });
    axios({
      url: process.env.REACT_APP_SERV_URL,
      method: "post",
      data: {
        query: `
          query getOther($page:Int!, $type: String!){
            getOther(where: {page: $page, type: $type}){
                _id
                title
                address
                description
                logo
                number
                workTime
              }
            }
              `,
        variables: {
          page,
          type: props.match.params.type,
        },
      },
    }).then((result) => {
      if (result.data.data.getOther) {
        setServices(result.data.data.getOther);
        setIsLoaded(true);
      }
      // console.log(result.data.data);
    });
  }, [props]);
  if (!isLoaded) {
    return (
      <div className="catalogWrapper">
        <div className="loader">
          <img src="/images/logoWhite.png" alt="" />
        </div>
      </div>
    );
  } else {
    const getPages = (count) => {
      if (count > 1) {
        let content = [];
        for (let i = 1; i <= count; i++) {
          content.push(
            <a href={window.location.pathname + "?page=" + i} key={i}>
              {i}
            </a>
          );
        }
        return content;
      } else {
        return "";
      }
    };
    let typeEn = ["Entertainment", "Services", "Health", "Catering"];
    let typeRu = ["Развлечения", "Услуги", "Здоровье", "Кафе, рестораны"];
    let h3 = "";
    for (let i = 0; i < typeEn.length; i++) {
      if (props.match.params.type === typeEn[i]) {
        h3 = typeRu[i];
      }
    }
    return (
      <>
        <div className="catalogWrapper fix">
          <CatalogSearch />
          <div className="catalogSides fix">
            <div className="filterbox">
              <div className="advbanner">
                <img src="/images/photograp.jpg" alt="" />
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
                  <h3>{h3}</h3>
                  <div className="infoAmus_typed_items">
                    <div className="infoAmus_items Amusement">
                      {services.length !== 0
                        ? services.map((item) => (
                            <InfoAmusItem1
                              key={item._id}
                              id={item._id}
                              title={item.title}
                              description={item.description}
                              workinfo={item.workTime}
                              image={item.logo}
                              number={item.number}
                              address={item.address}
                            />
                          ))
                        : "Услуг нет :("}
                    </div>
                    {count !== 0 ? (
                      <div className="pages">{getPages(count)}</div>
                    ) : (
                      ""
                    )}
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
export default Services;
