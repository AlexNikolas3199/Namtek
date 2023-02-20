import React, { Component } from "react";
import { bake_cookie, read_cookie } from "sfcookies";

export default class BasketItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: Number(read_cookie('productCount').split(',')[this.props.index]),
      price: this.props.price,
    };
    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
  }

  async increment() {
    await this.setState((state) => ({
      quantity: state.quantity + 1,
    }));
    let actualProdQuan = read_cookie("productCount").split(",");
    await actualProdQuan.splice(-1, 1);
    actualProdQuan[this.props.index] = this.state.quantity;
    bake_cookie("productCount", `${actualProdQuan},`);
    // console.log(read_cookie("productCount"));
    this.props.updateUp(this.state.price);
  }

  async decrement() {
    if (this.state.quantity !== 1) {
      await this.setState((state) => ({
        quantity: state.quantity - 1,
      }));
      this.props.updateDown(this.state.price,this.state.quantity,this.props.index);
    }
  }

  componentDidMount() {
    window.addEventListener("load", this.props.updateUp(this.state.price*this.state.quantity));
  }

  render() {
    const { price, quantity } = this.state;
    return (
      <div className="basket_product">
        <img src={this.props.img.split(",")[0]} alt="" />
        <div className="content">
          <div className="description">
            <a href={`/${this.props.isFood ? 'Food' : 'Shops'}/${this.props.shopId}/${this.props.id}`}>
              <h3>{this.props.title}</h3>
            </a>
          </div>
          <div className="little">
            <div className="price">
              <div>
                {price.toString().replace(/(\d)(?=(\d{3})+(\D|$))/g, "$1 ")}
              </div>{" "}
              ₽
            </div>
            <div className="quantity">
              <button onClick={this.decrement} className="less">
                <div></div>
              </button>
              <div>{quantity}</div>
              <button onClick={this.increment} className="more">
                <div></div>
              </button>
            </div>
            <button
              className="deleteProduct"
              onClick={this.props.removeItem(price, quantity, this.props.id, this.props.index)}
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
    );
  }
}
