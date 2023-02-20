import React, { Component } from "react";
import Footer from "../Components/Footer";
import InfoAmusItem3 from "../Components/InfoAmusItem3";
import axios from "axios";
import { read_cookie } from "sfcookies";
export default class Cinema extends Component {
  constructor(props) {
    super(props);
    this.state = {
      afisha: [],
      isLoaded: false,
    };
  }
  async componentDidMount() {
    await axios({
      url: process.env.REACT_APP_SERV_URL,
      method: "post",
      data: {
        query: `
          query{
            getAfisha{
                _id
                title
                text
                age
                photo
                genre
                country
                duration
              }
            }
              `,
      },
    }).then((result) => {
      this.setState({
        afisha: result.data.data.getAfisha,
        isLoaded: true,
      });
      // console.log(this.state.afisha);
    });
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
          <div className="catalogWrapper">
            <div className="catalogSides cinema fix">
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
                    <h3>
                      Кинотеатр Сардана
                      <a href="tel:+79142212110">позвонить</a>{" "}
                    </h3>
                    <div className="infoAmus_typed_items">
                      <div className="infoAmus_items">
                        {this.state.afisha.map((item) => (
                          <InfoAmusItem3
                            link={`/Cinema/${item.itemTitle}`}
                            key={item._id}
                            id={item._id}
                            title={item.title}
                            image={item.photo}
                            text={item.text}
                            genre={item.genre}
                            duration={item.duration}
                            country={item.country}
                            age={item.age}
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
