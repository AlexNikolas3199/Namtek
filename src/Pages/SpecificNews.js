import React, { useState, useEffect } from "react";
import Footer from "../Components/Footer";
import CatalogSearch from "../Components/CatalogSearch";
import TableTemp from "../Components/TableTemp";
import Newsblock from "../Components/Newsblock";
import eye from "../img/eye.png";
import clock from "../img/clock.png";
// import comment1 from '../img/comment1.png'
// import comment2 from '../img/comment2.png'
// import comment3 from '../img/comment3.png'
// import comment4 from '../img/comment4.png'
import newsData from "../newsData.json";
import { read_cookie } from "sfcookies";
const SpecificNews = (props) => {
  const [username, setUsername] = useState("");
  const [usersurname, setUsersurname] = useState("");
  useEffect(() => {
    if (read_cookie("token").length !== 0) {
      var body = {
        Authorization: "Bearer " + read_cookie("token").split(" ")[1],
      };
      const requestOptions = {
        method: "GET",
        headers: body,
      };
      fetch(
        process.env.REACT_APP_IMAGE_URL + "/account/dashboard",
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          setUsername(data.user.name);
          setUsersurname(data.user.surname);
        });
    }
  }, []);
  const toanswer = () => {
    let combtns = document.querySelectorAll(".comment button");
    for (let combtn of combtns) {
      combtn.addEventListener("click", function () {
        var textarea = document.querySelector("textarea");
        textarea.value = combtn.dataset.username + ", ";
        textarea.focus();
      });
    }
  };
  // const newComment = (evt) => {
  //     evt.preventDefault();
  //     if(read_cookie('token').length !== 0){
  //         var commentarium = document.querySelector('.commentarium')
  //         var textarea = evt.target.querySelector('textarea')
  //         let comment = document.createElement('div');
  //         comment.classList.add('comment');
  //         commentarium.prepend(comment);
  //         let user = document.createElement('img');
  //         user.classList.add('avatar');
  //         user.src = comment4;
  //         comment.appendChild(user);
  //         var div = document.createElement('div');
  //         comment.appendChild(div);
  //         var nick = document.createElement('div');
  //         nick.textContent = username +' '+ usersurname;
  //         nick.classList.add('nick');
  //         div.appendChild(nick);
  //         var comment_date = document.createElement('div');
  //         comment_date.textContent = 'Сегодня, ' + new Date().getHours()+ ':' + new Date().getMinutes();
  //         comment_date.classList.add('comment_date');
  //         div.appendChild(comment_date);
  //         var letter = document.createElement('div');
  //         letter.textContent = textarea.value;
  //         letter.classList.add('letter');
  //         div.appendChild(letter);
  //         textarea.value = ''
  //     }else{
  //         alert('Только зарегестрированные пользователи могут оставлять комментарии.')
  //     }
  // }
  var newsitem1 = props.match.params.newsItem;
  let newsitem;
  for (let i = 0; i < newsData.news.length; i++) {
    if (newsData.news[i].title === newsitem1) {
      newsitem = newsData.news[i];
      document.title = newsitem.title;
      break;
    }
  }
  if (newsitem === undefined) {
    return (
      <>
        <div className="catalogWrapper">
          <CatalogSearch />
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
  } else {
    return (
      <>
        <div onLoad={toanswer} className="NewsMain">
          <div className="catalogWrapper">
            <CatalogSearch />
            <TableTemp />
            <div className="catalogSides">
              <div className="filterbox">
                <Newsblock newsitem={newsitem} />
              </div>
              <div className="catologContent">
                <div className="newItem">
                  <div className="main">
                    <h2>{newsitem.title}</h2>
                    <div className="usersInfo">
                      <div className="time">
                        <img src={clock} alt="" />
                        <p>5 ч назад</p>
                      </div>
                      <div className="sees">
                        <img src={eye} alt="" />
                        <p>132</p>
                      </div>
                    </div>
                    <img className="postimg" src={newsitem.img} alt="" />
                    <div className="postarticle">
                      {newsitem.text.map((p) => (
                        <p key={p}>{p}</p>
                      ))}
                    </div>
                    {/* <h4>Соблюдайте правила общения в комментариях.</h4>
                                    <form onSubmit={newComment} className="commentform">
                                        <div className="flex_center">
                                            <textarea placeholder="Написать комментарий" required></textarea>
                                        </div>
                                        <button type="submit" className="avatar">
                                            Отправить
                                        </button>
                                    </form>
                                    <div className="commentarium">
                                        <div className="comment">
                                            <img className="avatar" src={comment1}alt=""/>
                                            <div>
                                                <div className="nick">Николай Михайлов</div>
                                                <div className="comment_date">Сегодня, 19:07</div>
                                                <div className="letter">
                                                    "Тур хакатонов стартовал в Нижнем Бестяхе"
                                                    Звучит как начало хорошего анекдота
                                                </div>
                                                <button data-username="Николай Михайлов">Ответить</button>
                                            </div>
                                        </div>
                                        <div className="comment">
                                            <img className="avatar" src={comment2}alt=""/>
                                            <div>
                                                <div className="nick">Александр Алексеев</div>
                                                <div className="comment_date">Сегодня, 18:07</div>
                                                <div className="letter">
                                                Кто прочитал как 20 хотонов?
                                                </div>
                                                <button data-username="Александр Алексеев">Ответить</button>
                                            </div>
                                        </div>
                                        <div className="comment">
                                            <img className="avatar" src={comment3}alt=""/>
                                            <div>
                                                <div className="nick">Ульяна Иннокентьева</div>
                                                <div className="comment_date">Сегодня, 17:07</div>
                                                <div className="letter">
                                                Раньше были киберспортивные игры, а сейчас хакатоны, по крайне мере в хакатонах свои навыки можно замонитизировать.
                                                </div>
                                                <button data-username="Ульяна Иннокентьева">Ответить</button>
                                            </div>
                                        </div>
                                    </div> */}
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
export default SpecificNews;
