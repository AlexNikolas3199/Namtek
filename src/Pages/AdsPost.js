import React, { useState, useEffect } from "react";
import Footer from "../Components/Footer";
import SettingsFilt from "../Components/SettingsFilt";
import { read_cookie } from "sfcookies";
import axios from "axios";
const AdsPost = (props) => {
  const [createdNewsImg, setСreatedNewsImg] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [myAds, setMyAds] = useState([]);
  useEffect(() => {
    if (read_cookie("token").length === 0) {
      props.history.push(`/Login/?next=${window.location.pathname}`);
    }
    axios({
      url: process.env.REACT_APP_SERV_URL,
      method: "post",
      data: {
        query: `
          query getMyAds{
            getMyAds{
              title
              logo
              price
              _id
              type
            }
          }
              `,
      },
      headers: {
        authorization: read_cookie("token").replace("jwt", ""),
      },
    }).then((result) => {
      if (result.data.data.getMyAds) {
        setMyAds(result.data.data.getMyAds);
        setIsLoaded(true);
      }
      // console.log(result.data.data);
    });
  }, [props.history]);
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
          images.push(res.data);
          input.className = "";
          setСreatedNewsImg(images);
        })
        .catch((err) => {
          // console.log(err);
        });
    }
  };
  const createAd = (e) => {
    e.preventDefault();
    let form = e.target;
    form.querySelector("button").disabled = true;
    // console.log(createdNewsImg);
    axios({
      url: process.env.REACT_APP_SERV_URL,
      method: "post",
      data: {
        query: `
              mutation postAd($title: String!, $logo: String, $description: String!, $price: String!, $category: String!, $address: String){
                postAd(data:{title: $title,logo: $logo,description: $description, price:$price, category:$category, address:$address}){_id}
                }
              `,
        variables: {
          title: form.elements.title.value,
          logo: process.env.REACT_APP_IMAGE_URL + "/static/" + createdNewsImg,
          description: form.elements.description.value,
          price: form.elements.price.value,
          category: form.elements.category.value,
          address: form.elements.address.value,
        },
      },
      headers: {
        authorization: read_cookie("token").replace("jwt", ""),
      },
    }).then(
      (result) => {
        // console.log(result.data);
        if (result.data.data.postAd) {
          alert("Объявление создано!");
          document.location.reload();
        } else {
          alert("Объявление не было создано!");
          form.querySelector("button").disabled = false;
        }
      },
      (error) => {
        alert(error);
        form.querySelector("button").disabled = false;
      }
    );
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
    document.querySelector("body").className = "";
    return (
      <>
        <div className="catalogWrapper">
          <div className="catalogSides">
            <SettingsFilt role={read_cookie("role")} />
            <div className="catologContent">
              <div className="infoAmus settings">
                <h3>Создать объявление</h3>
                <div className="adminform">
                  <form onSubmit={createAd} className="settingsForm">
                    <div className="formcontent">
                      <div className="labels">
                        <label>
                          <p>Заголовок</p>
                          <input name="title" required />
                        </label>
                        <label>
                          <p>Изображения</p>
                          <input
                            type="file"
                            onChange={createImg}
                            required
                            multiple
                            name="logo"
                            accept="image/jpeg,image/png"
                          />
                        </label>
                        <label>
                          <p>Категория</p>
                          <select name="category" required>
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
                          <input name="price" type="number" required />
                        </label>
                        <label>
                          <p>Ваш адрес</p>
                          <input name="address" required />
                        </label>
                        <label>
                          <p>Описание</p>
                          <textarea name="description" required></textarea>
                        </label>
                      </div>
                      <button type="submit">Сохранить</button>
                    </div>
                  </form>
                </div>
                <div className="advert_container">
                  <h3>Мои объявления</h3>
                  <div className="adverts">
                    {myAds.map((item) => (
                      <a
                        key={item._id}
                        className={'advertCard '+ (item.type === 'paid' ? 'gold' : '')}
                        href={`/AdsPost/${item._id}`}
                      >
                        <img src={item.logo.split(",")[0]} alt="" />
                        <div>
                          <h5>{item.title}</h5>
                          <p>
                            {item.price.replace(
                              /(\d)(?=(\d{3})+(\D|$))/g,
                              "$1 "
                            )}{" "}
                            ₽
                          </p>
                          <div>Подробнее</div>
                        </div>
                      </a>
                    ))}
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
export default AdsPost;
