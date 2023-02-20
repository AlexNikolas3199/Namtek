import React, { useState, useEffect } from "react";
import Footer from "../Components/Footer";
import SettingsFilt from "../Components/SettingsFilt";
import { read_cookie } from "sfcookies";
import axios from "axios";
import InfoAmusItem from "../Components/InfoAmusItem";
const CookFood = (props) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [createdNewsImg, setСreatedNewsImg] = useState([]);
  const [myShops, setMyShops] = useState([]);
  useEffect(() => {
    if (read_cookie("token").length !== 0) {
      if (read_cookie('role') !== "cook") {
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
              description
              logo
              block
              categories{
                _id
                name
              }
            }
          }
            `,
      },
      headers: {
        authorization: read_cookie("token").replace("jwt", ""),
      },
    }).then((result) => {
      // console.log(result);
      if (result.data.data.getFood === null) {
        setIsLoaded(true)
      } else {
        setMyShops(result.data.data.getFood)
        setIsLoaded(true)
      }
      // console.log(myShops);
    });
  }, [props]);
    
  const createImg = (e) => {
    let input = e.target;
    input.className = "disabled";
    let fd = new FormData();
    fd.append("image", e.target.files[0]);
    axios({
      method: "post",
      url: process.env.REACT_APP_IMAGE_URL + "/photo",
      data: fd,
    })
      .then((res) => {
        // console.log(res);
        setСreatedNewsImg(res.data)
        input.className = "";
      })
      .catch((err) => {
        // console.log(err);
      });
  };  
  const createFood = (e) => {
    e.preventDefault();
    var form = e.target;
    form.querySelector("button").disabled = true;
    axios({
      url: process.env.REACT_APP_SERV_URL,
      method: "POST",
      data: {
        query: `
                mutation postFood($name: String, $description: String, $logo: String, $user: String){
                postFood(data:{name: $name,description: $description, logo: $logo, user: $user}){
                    name
                }
                }
                `,
        variables: {
          name: form.elements.title.value,
          description: form.elements.text.value,
          logo:
            process.env.REACT_APP_IMAGE_URL +
            "/static/" +
            createdNewsImg,
          user: read_cookie("userId"),
        },
      },
      headers: {
        authorization: read_cookie("token").replace("jwt", ""),
      },
    }).then(
      (result) => {
        // console.log(result.data);
        alert("Общепит создан!");
        form.reset();
        document.location.reload();
      },
      (error) => {
        alert(error);
        form.querySelector("button").disabled = false;
      }
    );
  };

  const editFood = (e) => {
    e.preventDefault();
    var form = e.target;
    form.querySelector("button").disabled = true;
    let photo =
      process.env.REACT_APP_IMAGE_URL + "/static/" + createdNewsImg;
    if (createdNewsImg.length === 0) {
      photo = myShops.logo;
    }
    // console.log(photo);
    axios({
      url: process.env.REACT_APP_SERV_URL,
      method: "post",
      data: {
        query: `
            mutation updateFood($name: String,$description: String, $logo: String){
              updateFood(data: {name : $name, description: $description, logo: $logo})
              }
                  `,
        variables: {
          name: form.elements.title.value,
          description: form.elements.text.value,
          logo: photo,
        },
      },
      headers: {
        authorization: read_cookie("token").replace("jwt", ""),
      },
    }).then((result) => {
      // console.log(result.data);
      if (result.data.data.updateFood) {
        alert("Общепит обновлен.");
        window.location.reload();
      }
      form.querySelector("button").disabled = false;
    });
  };

  const createCategory = (e) => {
    e.preventDefault();
    let form = e.target;
    form.querySelector("button").disabled = true;
    axios({
      url: process.env.REACT_APP_SERV_URL,
      method: "post",
      data: {
        query: `
                  mutation postFoodCategory($name: String, $id: String){
                    postFoodCategory(data:{name: $name},shopId:$id)
                    }
                  `,
        variables: {
          name: form.elements.category.value,
          id: myShops._id,
        },
      },
      headers: {
        authorization: read_cookie("token").replace("jwt", ""),
      },
    }).then(
      (result) => {
        // console.log(result.data);
        alert("Категория добавлена!");
        document.location.reload();
      },
      (error) => {
        alert(error);
        form.querySelector("button").disabled = false;
      }
    );
  };

  const deleteCategory = (e) => {
    e.preventDefault();
    var answer = window.confirm(
      "Удалить категорию? Лучше сперва поменять категории у товаров удалаемой категории."
    );
    if (answer) {
      let form = e.target;
      form.querySelector("button").disabled = true;
      // console.log(form.elements.category.value);
      // console.log(myShops._id);
      axios({
        url: process.env.REACT_APP_SERV_URL,
        method: "post",
        data: {
          query: `
                  mutation deleteFoodCategory($categoryId: String!, $shopId: String){
                    deleteFoodCategory(categoryId:$categoryId, shopId:$shopId)
                    }
                  `,
          variables: {
            categoryId: form.elements.category.value,
            shopId: myShops._id,
          },
        },
        headers: {
          authorization: read_cookie("token").replace("jwt", ""),
        },
      }).then(
        (result) => {
          // console.log(result.data);
          if (result.data.data.deleteFoodCategory) {
            alert("Категория Удалена!");
            document.location.reload();
          } else {
            alert("Категория не найдена!");
          }
          form.reset();
        },
        (error) => {
          alert(error);
          form.querySelector("button").disabled = false;
        }
      );
    }
  };

  window.scroll(0, 0);
  document.querySelector("body").classList.remove("active");
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
                <h3>Мой общепит</h3>
                <div className="infoAmus_typed_items">
                  <div className="infoAmus_items">
                    {myShops !== null && myShops.block === true ? (
                      <div className="danger" style={{ marginBottom: 40 }}>
                        Общепит заблокирован. Свяжитесь с админестрацией.
                      </div>
                    ) : (
                      ""
                    )}
                    {myShops !== null && myShops.length !== 0 ? (
                      <InfoAmusItem
                        key={myShops._id}
                        link={`/CookFood/${myShops._id}`}
                        title={myShops.name}
                        image={myShops.logo}
                        firstText={myShops.description}
                      />
                    ) : (
                      <div>У вас пока нет общепита.</div>
                    )}
                  </div>
                </div>
                {myShops !== null && myShops.length !== 0 ? (
                  <>
                    <div className="adminform">
                      <h4>Редактировать общепит</h4>
                      <form onSubmit={editFood} className="settingsForm">
                        <div className="formcontent">
                          <div className="labels">
                            <label>
                              <p>Название</p>
                              <input
                                defaultValue={myShops.name}
                                name="title"
                                required
                              />
                            </label>
                            <label>
                              <p>Логотип</p>
                              <input
                                type="file"
                                onChange={createImg}
                                name="photo"
                                accept="image/jpeg,image/png"
                              />
                            </label>
                            <label>
                              <p>Краткое описание</p>
                              <textarea
                                defaultValue={myShops.description}
                                name="text"
                                required
                              ></textarea>
                            </label>
                          </div>
                          <button type="submit">Сохранить</button>
                        </div>
                      </form>
                    </div>
                    <div className="adminform">
                      <h4>Добавить категорию</h4>
                      <form
                        onSubmit={createCategory}
                        className="settingsForm"
                      >
                        <div className="formcontent">
                          <div className="labels">
                            <label>
                              <p>Категория</p>
                              <div>
                                <input name="category" required />
                                <button type="submit">Сохранить</button>
                              </div>
                            </label>
                          </div>
                        </div>
                      </form>
                    </div>
                    <div className="adminform">
                      <h4>Удалить категорию</h4>
                      <form
                        onSubmit={deleteCategory}
                        className="settingsForm"
                      >
                        <div className="formcontent">
                          <div className="labels">
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
                          </div>
                          <button type="submit">Сохранить</button>
                        </div>
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="adminform">
                    <h3>Создать общепит</h3>
                    <form onSubmit={createFood} className="settingsForm">
                      <div className="formcontent">
                        <div className="labels">
                          <label>
                            <p>Название</p>
                            <input name="title" required />
                          </label>
                          <label>
                            <p>Логотип</p>
                            <input
                              type="file"
                              onChange={createImg}
                              required
                              name="photo"
                              accept="image/jpeg,image/png"
                            />
                          </label>
                          <label>
                            <p>Краткое описание</p>
                            <textarea name="text" required></textarea>
                          </label>
                        </div>
                        <button type="submit">Сохранить</button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

}
export default CookFood

