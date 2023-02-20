import React, { useState, useEffect } from "react";
import Footer from "../Components/Footer";
import SettingsFilt from "../Components/SettingsFilt";
import { read_cookie } from "sfcookies";
import axios from "axios";
const CookProductItem = (props) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [createdNewsImg, setСreatedNewsImg] = useState([]);
  const [myShops, setMyShops] = useState([]);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState([]);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    if (read_cookie("token").length !== 0) {
      if (read_cookie("role") !== "cook") {
        props.history.push("/");
      }
    } else {
      props.history.push(`/Login/?next=${window.location.pathname}`);
    }
     axios({
      url: process.env.REACT_APP_SERV_URL,
      method: "post",
      data: {
        query: `
        query{
            getFood{
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
        setMyShops(result.data.data.getFood)
        setProducts(result.data.data.getFood.products)
        for (let i = 0; i < products.length; i++) {
          if (
            products[i]._id === props.match.params.productId
          ) {
            setProduct(products[i])
            setCategory(products[i].category)
            setIsLoaded(true)
            // console.log(product);
          }
        }
      },
      (error) => {
        console.log(error.message);
      }
    );
  }, [props, products]);

  const editProduct = (e) => {
    e.preventDefault();
    let form = e.target;
    form.querySelector("button").disabled = true;
    let urlimg;
    if (createdNewsImg.length === 0) {
      urlimg = product.photo;
    } else {
      urlimg =
        process.env.REACT_APP_IMAGE_URL +
        "/static/" +
        createdNewsImg;
    }
    axios({
      url: process.env.REACT_APP_SERV_URL,
      method: "post",
      data: {
        query: `
          mutation updateFoodProduct($productId: String!, $title: String, $photo: String, $text: String, $price: String, $category: String){
            updateFoodProduct(data:{title: $title, photo: $photo, text: $text, price:$price, category:$category }, where:{ productId: $productId }){_id description}
            }
                  `,
        variables: {
          title: form.elements.title.value,
          photo: urlimg,
          text: form.elements.text.value,
          price: form.elements.price.value,
          category: form.elements.category.value,
          productId: product._id,
        },
      },
      headers: {
        authorization: read_cookie("token").replace("jwt", ""),
      },
    }).then(
      (result) => {
        // console.log(result.data);
        if (result.data.data.updateFoodProduct) {
          alert("Продукт изменен!");
          props.history.push(`/CookFood/${product.shop}`);
        } else {
          alert("Продукт не был изменен!");
        }
        form.reset();
      },
      (error) => {
        alert(error);
        form.querySelector("button").disabled = false;
      }
    );
  };

  const deleteProduct = () => {
    var answer = window.confirm("Вы уверены что хотите удалить товар?");
    // console.log(product._id)
    if (answer) {
      axios({
        url: process.env.REACT_APP_SERV_URL,
        method: "post",
        data: {
          query: `
                      mutation deleteFoodProduct($productId: String!){
                        deleteFoodProduct(where:{productId:$productId}){_id}
                        }
                      `,
          variables: {
            productId: product._id,
          },
        },
        headers: {
          authorization: read_cookie("token").replace("jwt", ""),
        },
      }).then(
        (result) => {
          // console.log(result.data);
          if (result.data.data.deleteFoodProduct) {
            alert("Продукт удален!");
            props.history.push(`/CookFood/${myShops._id}`);
          } else {
            alert("Продукт не был удален!");
          }
        },
        (error) => {
          alert(error);
        }
      );
    }
  };

  const createImg = (e) => {
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
          setСreatedNewsImg([...createdNewsImg, res.data])
          // console.log(createdNewsImg);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    input.className = "";
  };
  
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
            <SettingsFilt role={read_cookie('role')} />
            <div className="catologContent">
              <div className="infoAmus settings">
                <div className="adminform">
                  <h3>Редактировать продукт</h3>
                  <form onSubmit={editProduct} className="settingsForm">
                    <div className="formcontent">
                      <div className="labels">
                        <label>
                          <p>Название</p>
                          <input
                            name="title"
                            defaultValue={product.title}
                            required
                          />
                        </label>
                        <label>
                          <p>Изображения</p>
                          <input
                            type="file"
                            onChange={createImg}
                            multiple
                            name="photo"
                            accept="image/jpeg,image/png"
                          />
                        </label>
                        <label>
                          <p>Категория</p>
                          <select
                            defaultValue={category}
                            name="category"
                            required
                          >
                            {myShops.categories.map((item) =>
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
                          <p>Описание</p>
                          <textarea
                            name="text"
                            defaultValue={product.text}
                            required
                          ></textarea>
                        </label>
                        <label>
                          <p>Цена</p>
                          <input
                            name="price"
                            type="number"
                            defaultValue={product.price}
                            required
                          />
                        </label>
                      </div>
                      <button type="submit">Сохранить</button>
                    </div>
                  </form>
                </div>
                <div className="adminform">
                  <h4 onClick={deleteProduct} className="danger">
                    Удалить продукт
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
          <div className="catalogSides non">
            <h2>Ничего не найдено</h2>
            <a href="/" className="gohome">
              На главную
            </a>
          </div>
        </div>
        <Footer />
      </>
    );
  }

};
export default CookProductItem;