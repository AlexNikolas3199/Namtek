import React, { Component } from "react";
import { bake_cookie, read_cookie } from "sfcookies";
export default class InfoAmusItem2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inBasket: false,
    };
  }
  componentDidMount() {
    if (read_cookie("product").length !== 0) {
      let products = read_cookie("product").split(",");
      products.splice(-1, 1);
      bake_cookie("basketCount", `${products.length - 1}`);
      for (let product of products) {
        if (product === this.props.id) {
          this.setState({
            inBasket: true,
          });
        }
      }
    }
  }
  render() {
    var tobuy = () => {
      var actualProducts = read_cookie("product");
      if (actualProducts.length !== 0) {
        actualProducts += this.props.id + ",";
      }else{
        actualProducts = this.props.shopId +"," + this.props.id + ",";
      }
      if(this.props.shopId===actualProducts.split(",")[0]){
        bake_cookie("product", `${actualProducts}`);
        bake_cookie("basketCount", `${read_cookie("product").split(",").length - 2}`);
        this.setState({
          inBasket: true,
        });
        this.props.newBasket()
        let actualProdQuan = read_cookie("productCount");
        if (actualProdQuan.length !== 0) {
          bake_cookie("productCount", `${actualProdQuan}1,`);
          // console.log(read_cookie("productCount"));
        } else {
          bake_cookie("productCount", `1,`);
          // console.log(read_cookie("productCount"));
        }
    }else{
        alert('В корзине могут быть товары только одного магазина!')
    }
    };
    return (
      <div className="infoAmusItem new">
        <a href={this.props.link}>
          <img src={this.props.image.split(",")[0]} alt="" />
        </a>
        <span>
          <div>
            <a href={this.props.link}>
              <h5>{this.props.title}</h5>
              <div className="worktime">
                {this.props.price.replace(/(\d)(?=(\d{3})+(\D|$))/g, "$1 ")} ₽
              </div>
            </a>
          </div>
          {this.state.inBasket ? (
            <a href="/checkout_basket" className="tobasket">
              Просмотр корзины
            </a>
          ) : (
            <button onClick={tobuy} className="tobasket">
              В корзину
            </button>
          )}
        </span>
      </div>
    );
  }
}
