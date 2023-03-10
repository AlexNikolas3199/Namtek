import React, { Component } from "react";
import Footer from "../Components/Footer";
import SettingsFilt from "../Components/SettingsFilt";
import { read_cookie } from "sfcookies";
import axios from "axios";
import CatalogSearch from "../Components/CatalogSearch";
export default class TraderProductItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      role: "",
      createdNewsImg: [],
      product: [],
    };
  }

  async componentDidMount() {
    if (read_cookie("token").length !== 0) {
      await this.setState({
        role: read_cookie("role"),
      });
      if (this.state.role !== "trader") {
        this.props.history.push("/");
      }
    } else {
      this.props.history.push(`/Login/?next=${window.location.pathname}`);
    }
    await axios({
      url: process.env.REACT_APP_SERV_URL,
      method: "post",
      data: {
        query: `
        query{
            getShop{
              _id
              name
              categories{
                _id
                name
              }
              products{
                photo
                price
                title
                text
                category
                _id
              }
            }
          }
            `,
      },
      headers: {
        authorization: read_cookie("token").replace("jwt", ""),
      },
    }).then(
      (result) => {
        // console.log(result);
        this.setState({
          myShops: result.data.data.getShop,
          products: result.data.data.getShop.products,
        });
        // console.log(this.state.myShops)
        // console.log(this.state.products)
        for (let i = 0; i < this.state.products.length; i++) {
          if (
            this.state.products[i]._id === this.props.match.params.productId
          ) {
            this.setState({
              product: this.state.products[i],
              category: this.state.products[i].category,
              isLoaded: true,
            });
            // console.log(this.state.product);
          }
        }
      },
      (error) => {
        console.log(error.message);
      }
    );
  }

  editProduct = (e) => {
    e.preventDefault();
    let form = e.target;
    form.querySelector("button").disabled = true;
    let urlimg;
    if (this.state.createdNewsImg.length === 0) {
      urlimg = this.state.product.photo;
    } else {
      urlimg =
        process.env.REACT_APP_IMAGE_URL +
        "/static/" +
        this.state.createdNewsImg;
    }
    axios({
      url: process.env.REACT_APP_SERV_URL,
      method: "post",
      data: {
        query: `
                  mutation updateProduct($productId: String!, $title: String, $photo: String, $text: String, $price: String, $category: String){
                    updateProduct(data:{title: $title, photo: $photo, text: $text, price:$price, category:$category }, where:{ productId: $productId }){_id description}
                    }
                  `,
        variables: {
          title: form.elements.title.value,
          photo: urlimg,
          text: form.elements.text.value,
          price: form.elements.price.value,
          category: form.elements.category.value,
          productId: this.state.product._id,
        },
      },
      headers: {
        authorization: read_cookie("token").replace("jwt", ""),
      },
    }).then(
      (result) => {
        // console.log(result.data);
        if (result.data.data.updateProduct) {
          alert("?????????????? ??????????????!");
          this.props.history.push(`/TraderShops/${this.state.product.shop}`);
        } else {
          alert("?????????????? ???? ?????? ??????????????!");
        }
        form.reset();
      },
      (error) => {
        alert(error);
        form.querySelector("button").disabled = false;
      }
    );
  };

  deleteProduct = () => {
    var answer = window.confirm("???? ?????????????? ?????? ???????????? ?????????????? ???????????");
    // console.log(this.state.product._id)
    if (answer) {
      axios({
        url: process.env.REACT_APP_SERV_URL,
        method: "post",
        data: {
          query: `
                      mutation deleteProduct($productId: String!){
                        deleteProduct(where:{productId:$productId}){_id}
                        }
                      `,
          variables: {
            productId: this.state.product._id,
          },
        },
        headers: {
          authorization: read_cookie("token").replace("jwt", ""),
        },
      }).then(
        (result) => {
          // console.log(result.data);
          if (result.data.data.deleteProduct) {
            alert("?????????????? ????????????!");
            this.props.history.push(`/TraderShops/${this.state.myShops._id}`);
          } else {
            alert("?????????????? ???? ?????? ????????????!");
          }
        },
        (error) => {
          alert(error);
        }
      );
    }
  };

  createImg = (e) => {
    let input = e.target;
    input.className = "disabled";
    for (let item of e.target.files) {
      let fd = new FormData();
      fd.append("image", item);
      axios({
        method: "post",
        url: process.env.REACT_APP_IMAGE_URL + "/photo",
        data: fd,
      })
        .then((res) => {
          // console.log(res);
          this.setState({
            createdNewsImg: [...this.state.createdNewsImg, res.data],
          });
          // console.log(this.state.createdNewsImg);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    input.className = "";
  };

  render() {
    const { product, role, isLoaded, category } = this.state;
    if (!isLoaded) {
      return (
        <div className="catalogWrapper">
          <div className="loader">
            <img src="/images/logoWhite.png" alt="" />
          </div>
        </div>
      );
    } else if (product !== null && category !== undefined) {
      return (
        <>
          <div className="catalogWrapper">
            <div className="catalogSides">
              <SettingsFilt role={role} />
              <div className="catologContent">
                <div className="infoAmus settings">
                  <div className="adminform">
                    <h3>?????????????????????????? ??????????</h3>
                    <form onSubmit={this.editProduct} className="settingsForm">
                      <div className="formcontent">
                        <div className="labels">
                          <label>
                            <p>????????????????</p>
                            <input
                              name="title"
                              defaultValue={product.title}
                              required
                            />
                          </label>
                          <label>
                            <p>??????????????????????</p>
                            <input
                              type="file"
                              onChange={this.createImg}
                              multiple
                              name="photo"
                              accept="image/jpeg,image/png"
                            />
                          </label>
                          <label>
                            <p>??????????????????</p>
                            <select
                              defaultValue={category}
                              name="category"
                              required
                            >
                              {this.state.myShops.categories.map((item) =>
                                item !== null ? (
                                  <option key={item._id} value={item._id}>
                                    {item.name}
                                  </option>
                                ) : (
                                  ""
                                )
                              )}
                            </select>
                          </label>
                          <label>
                            <p>????????????????</p>
                            <textarea
                              name="text"
                              defaultValue={product.text}
                              required
                            ></textarea>
                          </label>
                          <label>
                            <p>????????</p>
                            <input
                              name="price"
                              type="number"
                              defaultValue={product.price}
                              required
                            />
                          </label>
                        </div>
                        {this.state.message !== undefined ? (
                          <div className="message">{this.state.message}</div>
                        ) : (
                          ""
                        )}
                        <button type="submit">??????????????????</button>
                      </div>
                    </form>
                  </div>
                  <div className="adminform">
                    <h4 onClick={this.deleteProduct} className="danger">
                      ?????????????? ??????????
                    </h4>
                  </div>
                </div>
              </div>
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
            <div className="catalogSides non">
              <h2>???????????? ???? ??????????????</h2>
              <a href="/" className="gohome">
                ???? ??????????????
              </a>
            </div>
          </div>
          <Footer />
        </>
      );
    }
  }
}
