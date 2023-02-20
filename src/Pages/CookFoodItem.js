import React, { useState, useEffect } from "react";
import Footer from "../Components/Footer";
import SettingsFilt from "../Components/SettingsFilt";
import { read_cookie } from "sfcookies";
import axios from "axios";
const CookFoodItem = (props) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [createdNewsImg, setСreatedNewsImg] = useState([]);
  const [products, setProducts] = useState([]);
  const [myShops, setMyShops] = useState([]);

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
        setMyShops(result.data.data.getFood);
        setProducts(result.data.data.getFood.products);
        setIsLoaded(true);
      },
      (error) => {
        console.log(error.message);
      }
    );
  }, [props]);

  const deleteFood = () => {
    var answer = window.confirm(
      "Вы уверены что хотите удалить общепит? Информация и все товары будут потеряны."
    );
    if (answer) {
      axios({
        url: process.env.REACT_APP_SERV_URL,
        method: "post",
        data: {
          query: `
                mutation deleteFood{
                    deleteFood{_id}
                    }
                    `,
        },
        headers: {
          authorization: read_cookie("token").replace("jwt", ""),
        },
      }).then((result) => {
        // console.log(result.data);
        if (result.data.data.deleteFood) {
          alert("Общепит удален.");
          props.history.push("/TraderShops");
        } else {
          alert("Общепит не найден.");
        }
      });
    }
  };

  const createProduct = (e) => {
    e.preventDefault();
    let form = e.target;
    form.querySelector("button").disabled = true;
    axios({
      url: process.env.REACT_APP_SERV_URL,
      method: "post",
      data: {
        query: `
                  mutation addFoodProduct($title: String, $photo: String, $text: String, $price: String, $category: String){
                    addFoodProduct(data:{title: $title, photo: $photo, text: $text, price: $price, category:$category}){_id}
                    }
                  `,
        variables: {
          title: form.elements.title.value,
          photo: process.env.REACT_APP_IMAGE_URL + "/static/" + createdNewsImg,
          text: form.elements.text.value,
          price: form.elements.price.value,
          category: form.elements.category.value,
        },
      },
      headers: {
        authorization: read_cookie("token").replace("jwt", ""),
      },
    }).then(
      (result) => {
        // console.log(result.data);
        if (result.data.data.addFoodProduct) {
          alert("Продукт добавлен!");
          document.location.reload();
        } else {
          alert("Продукт не был добавлен!");
        }
        form.reset();
      },
      (error) => {
          console.log(error)
        form.querySelector("button").disabled = false;
      }
    ).catch((error)=>{
        console.log(error)
    });
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
          setСreatedNewsImg([...createdNewsImg, res.data]);
          input.className = "";
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  window.scroll(0, 0);
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
          <div className="catalogSides">
            <SettingsFilt role={read_cookie("role")} />
            <div className="catologContent">
              <div className="infoAmus settings">
                <div className="adminform">
                  <h3>Создать товар</h3>
                  <form onSubmit={createProduct} className="settingsForm">
                    <div className="formcontent">
                      <div className="labels">
                        <label>
                          <p>Название</p>
                          <input name="title" required />
                        </label>
                        <label>
                          <p>Изображения</p>
                          <input
                            type="file"
                            onChange={createImg}
                            required
                            multiple
                            name="photo"
                            accept="image/jpeg,image/png"
                          />
                        </label>
                        <label>
                          <p>Категория</p>
                          <select name="category" required>
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
                          <textarea name="text" required></textarea>
                        </label>
                        <label>
                          <p>Цена</p>
                          <input name="price" type="number" required />
                        </label>
                      </div>
                      <button type="submit">Сохранить</button>
                    </div>
                  </form>
                </div>
                <div className="infoAmus_typed_items">
                  <h3>Товары</h3>
                  <div className="infoAmus_items shop">
                    {products.length !== 0 ? (
                      products.map((item) => (
                        <div key={item._id} className="infoAmusItem new">
                          <a href={`/CookFood/myFood/${item._id}`}>
                            <img src={item.photo.split(",")[0]} alt="" />
                          </a>
                          <span>
                            <div>
                              <a href={`/CookFood/myFood/${item._id}`}>
                                <h5>{item.title}</h5>
                                <div className="worktime">
                                  {item.price
                                    .toString()
                                    .replace(
                                      /(\d)(?=(\d{3})+(\D|$))/g,
                                      "$1 "
                                    )}{" "}
                                  ₽
                                </div>
                              </a>
                            </div>
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="adminform">Здесь пока нет товаров.</div>
                    )}
                  </div>
                </div>
                <div className="adminform">
                  <h4 onClick={deleteFood} className="danger">
                    Удалить магазин
                  </h4>
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
export default CookFoodItem;
