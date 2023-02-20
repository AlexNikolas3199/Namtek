import React, { useState, useEffect } from "react";
import Footer from "../Components/Footer";
import SettingsFilt from "../Components/SettingsFilt";
import { read_cookie } from "sfcookies";
import axios from "axios";
const AdvertPost = (props) => {
  const [createdNewsImg, setСreatedNewsImg] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [myAd, setMyAd] = useState([]);
  const [category, setCategory] = useState(undefined);
  useEffect(() => {
    if (read_cookie("token").length === 0) {
      props.history.push(`/Login/?next=${window.location.pathname}`);
    }
    axios({
      url: process.env.REACT_APP_SERV_URL,
      method: "post",
      data: {
        query: `
          query getAd($id: String!){
            getAd(where:{_id: $id}){
                title
                price
                description
                address
                logo
                category
                _id
            }
          }
              `,
        variables: {
          id: props.match.params.id,
        },
      },
      headers: {
        authorization: read_cookie("token").replace("jwt", ""),
      },
    }).then((result) => {
      if (result.data.data.getAd) {
        setMyAd(result.data.data.getAd);
        setIsLoaded(true);
        setCategory(result.data.data.getAd.category);
      }
      // console.log(result.data.data);
    });
  }, [props]);
  const createImg = (e) => {
    let input = e.target;
    let images = [];
    for (let item of e.target.files) {
      input.className = "disabled";
      let fd = new FormData();
      fd.append("image", item);
      axios({
        method: "post",
        url: process.env.REACT_APP_IMAGE_URL + "/photo",
        data: fd,
      })
        .then((res) => {
          // console.log(res);
          images.push(res.data);
          setСreatedNewsImg(images);
          input.className = "";
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const updateAd = (e) => {
    e.preventDefault();
    let form = e.target;
    form.querySelector("button").disabled = true;
    let urlimg;
    if (createdNewsImg.length === 0) {
      urlimg = myAd.logo;
    } else {
      urlimg = process.env.REACT_APP_IMAGE_URL + "/static/" + createdNewsImg;
    }
    // console.log(urlimg);
    axios({
      url: process.env.REACT_APP_SERV_URL,
      method: "post",
      data: {
        query: `
              mutation updateAd($title: String, $logo: String, $description: String, $price: String, $category: String, $address: String, $id: String!){
                updateAd(data:{title: $title,logo: $logo,description: $description, price:$price, category:$category, address:$address},where:{_id: $id})
                }
              `,
        variables: {
          title: form.elements.title.value,
          logo: urlimg,
          description: form.elements.description.value,
          price: form.elements.price.value,
          category: form.elements.category.value,
          address: form.elements.address.value,
          id: myAd._id,
        },
      },
      headers: {
        authorization: read_cookie("token").replace("jwt", ""),
      },
    }).then(
      (result) => {
        // console.log(result.data);
        if (result.data.data.updateAd) {
          alert("Объявление обновлено!");
          props.history.push(`/AdsPost`);
        } else {
          alert("Объявление не было обновлено!");
          form.querySelector("button").disabled = false;
        }
      },
      (error) => {
        alert(error);
        form.querySelector("button").disabled = false;
      }
    );
  };
  const deleteAd = (e) => {
    e.preventDefault();
    var answer = window.confirm("Вы уверены что хотите удалить объявление?");
    if (answer) {
      axios({
        url: process.env.REACT_APP_SERV_URL,
        method: "post",
        data: {
          query: `
              mutation deleteAd($id: String!){
                deleteAd(where:{_id: $id}){_id}
                }
              `,
          variables: {
            id: myAd._id,
          },
        },
        headers: {
          authorization: read_cookie("token").replace("jwt", ""),
        },
      }).then(
        (result) => {
          // console.log(result.data);
          if (result.data.data.deleteAd) {
            alert("Объявление удалено!");
            props.history.push(`/AdsPost`);
          } else {
            alert("Объявление не было удалено!");
          }
        },
        (error) => {
          alert(error);
        }
      );
    }
  };
  if (!isLoaded || category === undefined) {
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
                <h3>Обновить объявление</h3>
                <div className="adminform">
                  <form onSubmit={updateAd} className="settingsForm">
                    <div className="formcontent">
                      <div className="labels">
                        <label>
                          <p>Заголовок</p>
                          <input
                            defaultValue={myAd.title}
                            name="title"
                            required
                          />
                        </label>
                        <label>
                          <p>Изображения</p>
                          <input
                            type="file"
                            onChange={createImg}
                            multiple
                            name="logo"
                            accept="image/jpeg,image/png"
                          />
                        </label>
                        <label>
                          <p>Категория</p>
                          <select
                            defaultValue={myAd.category}
                            name="category"
                            required
                          >
                            <option value="products">Продукты питания</option>
                            <option value="construction">
                              Ремонт и строительство
                            </option>
                            <option value="sport">Спорт и здоровье</option>
                            <option value="hobby">Хобби и увлечения</option>
                            <option value="beauty">Товары для красоты</option>
                            <option value="house">Недвижимость</option>
                            <option value="work">Вакансии/Работа</option>
                            <option value="Auto">Авто</option>
                            <option value="Services">Услуги</option>
                            <option value="Technics">
                              Бытовая техника и электроника
                            </option>
                            <option value="holidays">Всё для праздников</option>
                            <option value="garden">Для дома и дачи</option>
                            <option value="Pets">Домашние животные</option>
                            <option value="Computers">
                              Компьютеры, телефоны
                            </option>
                            <option value="Furniture">Мебель и интерьер</option>
                            <option value="Finds">Находки, потери</option>
                            <option value="clothing">
                              Одежда, обувь, аксессуары
                            </option>
                            <option value="exchange">
                              Отдам, возьму бесплатно, обменяю
                            </option>
                          </select>
                        </label>
                        <label>
                          <p>Цена</p>
                          <input
                            defaultValue={myAd.price}
                            name="price"
                            type="number"
                            required
                          />
                        </label>
                        <label>
                          <p>Ваш адрес</p>
                          <input
                            defaultValue={myAd.address}
                            name="address"
                            required
                          />
                        </label>
                        <label>
                          <p>Описание</p>
                          <textarea
                            defaultValue={myAd.description}
                            name="description"
                            required
                          ></textarea>
                        </label>
                      </div>
                      <button type="submit">Сохранить</button>
                    </div>
                  </form>
                </div>
                <div className="adminform">
                  <h4 onClick={deleteAd} className="danger">
                    Удалить объявление
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
export default AdvertPost;
