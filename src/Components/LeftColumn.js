import React, { Component } from "react";
import InfoAmusItem1 from "./InfoAmusItem1";
import InfoAmusItem from "./InfoAmusItem";
export default class LeftColumn extends Component {
  render() {
      return (
        <div className="LeftColumn">
          <div className="infoAmus_container">
            <div>
              <div className="infoAmus">
                <h3><a href="/Shops">Магазины</a></h3>
                <div className="infoAmus_typed_items">
                  <div className="infoAmus_items">
                    {this.props.shops.length !== 0
                      ? this.props.shops.map((item) => (
                        <InfoAmusItem
                          key={item._id}
                          link={`/Shops/${item._id}`}
                          title={item.name}
                          image={item.logo}
                          firstText={item.description}
                        />
                        ))
                      : "Услуг нет :("}
                  </div>
                </div>
              </div>
              <a href="/Shops">Далее</a>
            </div>
            <div>
              <div className="infoAmus">
                <h3><a href="/Amusement/Services">Услуги</a></h3>
                <div className="infoAmus_typed_items">
                  <div className="infoAmus_items Amusement">
                    {this.props.services.length !== 0
                      ? this.props.services.map((item) => (
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
                </div>
              </div>
              <a href="/Amusement/Services">Далее</a>
            </div>
          </div>
        </div>
      );
  }
}
