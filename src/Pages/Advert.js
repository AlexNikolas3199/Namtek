import React, { useState, useEffect } from "react";
import Footer from "../Components/Footer";
import mapPoint from "../img/mapPoint.png";
import { read_cookie } from "sfcookies";
import axios from "axios";
const Advert = (props) => {
  const [ads, setAds] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    axios({
      url: process.env.REACT_APP_SERV_URL,
      method: "post",
      data: {
        query: `
          query getAd($id: String!){
            getAd(where: {_id: $id}){
                title
                price
                description
                number
                address
                logo
              }
            }
              `,
        variables: {
          id: props.match.params.AdId,
        },
      },
    }).then((result) => {
      if (result.data.data.getAd) {
        setAds(result.data.data.getAd);
        setIsLoaded(true);
      }
      // console.log(result.data.data);
      // console.log(result.data.data.getAd);
    });
  }, [props]);
  var changePhoto = (e) => {
    let showPhoto = document.querySelector(".showPhoto img");
    showPhoto.src = e.target.src;
  };
  const delete1 = () => {
    var answer = window.confirm("Удалить объявление?");
    if (answer) {
      axios({
        url: process.env.REACT_APP_SERV_URL,
        method: "post",
        data: {
          query: `
                  mutation deleteAdAdmin($id: String!){
                  deleteAdAdmin(where: {_id: $id}){_id}
                  }
                  `,
          variables: {
            id: props.match.params.AdId,
          },
        },
        headers: {
          authorization: read_cookie("token").replace("jwt", ""),
        },
      }).then((result) => {
        // console.log(result.data);
        if (result.data.data.deleteAdAdmin) {
          alert("Объявление удалено.");
          props.history.push("/Ads");
        } else {
          alert("Объявление не найдено.");
        }
      });
    }
  };
  const makeGold = () => {
    var answer = window.confirm("Отметить как оплаченное объявление?");
    if (answer) {
      axios({
        url: process.env.REACT_APP_SERV_URL,
        method: "post",
        data: {
          query: `
                  mutation grantTypeAd($id: String!){
                    grantTypeAd(where: {_id: $id}, data: {type: "paid"}){ type }
                  }
                  `,
          variables: {
            id: props.match.params.AdId,
          },
        },
        headers: {
          authorization: read_cookie("token").replace("jwt", ""),
        },
      }).then((result) => {
        // console.log(result.data);
        if (result.data.data.grantTypeAd) {
          alert("Объявление обновлено.");
          props.history.push("/Ads");
        } else {
          alert("Объявление не найдено.");
        }
      });
    }
  };
  
  if (!isLoaded) {
    return (
      <div className="catalogWrapper">
        <div className="loader">
          <img src="/images/logoWhite.png" alt="" />
        </div>
      </div>
    );
  } else {
    let text = [];
    for (let item of ads.description.split(/(\n)/)) {
      if (item.length > 1) {
        text.push(item);
      }
    }
    return (
      <>
        <div className="catalogWrapper AdsMain">
          <div className="productWrapper">
            <h3
              onClick={() => {
                window.history.back();
              }}
            >
              <img src="/images/arrowback.png" alt="Назад" /> <i>Объявления</i>
            </h3>
            <div className="productContainer">
              <div className="prodSlider">
                <div className="prodbuttons">
                  {ads.logo
                    .replace(process.env.REACT_APP_IMAGE_URL + "/static/", "")
                    .split(",")
                    .map((item) => (
                      <div key={item}>
                        <img
                          src={
                            process.env.REACT_APP_IMAGE_URL + "/static/" + item
                          }
                          onClick={changePhoto}
                          alt=""
                        />
                      </div>
                    ))}
                </div>
                <div className="showPhoto">
                  <img src={ads.logo.split(",")[0]} alt="" />
                </div>
                {read_cookie("role") === "admin" ? (
                  <>
                  <div className="delete" onClick={delete1}>
                    <img src="/images/trash.png" alt="" />
                  </div>
                  <div className="delete" style={{top:35}} onClick={makeGold}>
                    <img src="/images/first.png" alt="" />
                  </div>
                  </>
                ) : (
                  ""
                )}
              </div>
              <div className="productinfo">
                <h2>{ads.title}</h2>
                <div style={{ marginTop: 10, marginBottom: 10 }}>
                  {text.map((item) => (
                    <p style={{ marginTop: 2.5, marginBottom: 2.5 }} key={item}>
                      {item}
                    </p>
                  ))}
                </div>
                <div className="sellerinfo">
                  <img src={mapPoint} alt="" />
                  <p>{ads.address}</p>
                </div>
                <div className="price">
                  {ads.price.replace(/(\d)(?=(\d{3})+(\D|$))/g, "$1 ")} ₽
                </div>
                {ads.number !== null ?
                  <a href={`tel:${ads.number}`} className="tobasket">
                    Позвонить
                  </a>
                  :''
                }
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }
};
export default Advert;
