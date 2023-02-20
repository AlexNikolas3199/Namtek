import React, { useState, useRef } from "react";
import Footer from "../Components/Footer";
import TableTemp from "../Components/TableTemp";
import Newsblock from "../Components/Newsblock";
import eye from "../img/eye.png";
import clock from "../img/clock.png";
import { read_cookie } from "sfcookies";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { GET_NEWS, GET_NEWS_POST } from "../gqls/news/queries";
import { ADD_COMMENT, DELETE_NEWS, UPDATE_NEWS } from "../gqls/news/mutations";

const Pieceofnews = (props) => {
  const [news, setNews] = useState([]);
  const [updateB, setUpdateB] = useState(false);
  const [textAreaValue, setTextAreaValue] = useState("");
  // Получение id новости
  const newsitemId = props.match.params.newsItem;


  // Запрос на данный пост

  const { data: data0, loading, error } = useQuery(GET_NEWS_POST, {
    variables: {
      where: {
        _id: newsitemId,
      },
    },
    errorPolicy: "ignore",
  });
  const newsitem = data0 && data0.getNewsPost ? data0.getNewsPost : null;
  if (error) {
    alert("Ой! Ошибка. Попробуйте перезагрузить.");
  }

  // Запрос на свежие новости
  const { loading: loading1 } = useQuery(GET_NEWS, {
    variables: {
      page: 1,
    },
    onCompleted: (data) => {
      // console.log(data);
      setNews(data.getNews);
    },
    errorPolicy: "ignore",
  });

  // Мутация удаления новости
  const [deleteIt] = useMutation(DELETE_NEWS, {
    onCompleted: (data) => {
      // console.log(data);
      if (data.deleteNews) {
        alert("Новость удалена.");
        props.history.push("/News");
      } else {
        alert("Новость не найдена.");
      }
    },
    onError: (er) => {
      console.log(er.message);
    },
  });
  // Удаление новости, вызывает deleteIt
  const deleteNews = (e) => {
    e.preventDefault();
    let answer = window.confirm("Удалить новость?");
    if (answer) {
      deleteIt({
        variables: {
          where: {
            _id: newsitemId,
          },
        },
      });
    }
  };

  // Режим обноволения для админа
  const update1 = (e) => {
    let h2 = document.querySelector(".main h2");
    h2.contentEditable = true;
    h2.focus();
    document.querySelector(".postarticle").style.display = "none";
    setUpdateB(true);
    setTimeout(() => {
      let ta = document.querySelector("textarea.update");
      ta.style.height = ta.scrollHeight + "px";
    }, 1);
    e.target.addEventListener("click", () => {
      window.location.reload();
    });
  };

  // Мутация обновления новости
  const [updateIt] = useMutation(UPDATE_NEWS, {
    onCompleted: (data) => {
      // console.log(data);
      if (data.updateNews) {
        alert("Новость обновлена.");
        window.location.reload();
      } else {
        alert("Новость не найдена.");
      }
    },
    onError: (er) => {
      console.log(er.message);
    },
  });
  //  Обновление новости, вызывает updateIt
  const updateNews = (e) => {
    e.preventDefault();
    let form = e.target;
    var answer = window.confirm("Обновить новость?");
    if (answer) {
      updateIt({
        variables: {
          where: {
            _id: newsitemId,
          },
          data: {
            text: form.elements.text.value,
            title: document.querySelector(".main h2").innerHTML,
          },
        },
      });
    }
  };

  // сделать главной новостью
  const makeMain = () => {
    var answer = window.confirm("Сделать данную новость главной?");
    if (answer) {
      updateIt({
        variables: {
          where: {
            _id: newsitemId,
          },
          data: {
            isMain: true,
          },
        },
      });
    }
  };

  // Параметры для даты
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  // Создание даты
  const getDate = (num) => {
    let date = new Date(num);
    return date.toLocaleString("ru", options);
  };
  //  Мутация создания комментария
  const [addComment, { loading: addCommentLoading }] = useMutation(
    ADD_COMMENT,
    {
      onCompleted: () => {
        alert("Комментарий опубликован!");
      },
      onError: (er) => {
        console.log(er.message);
      },
    }
  );
  // Отправить комментарий, вызывает addComment
  const onCommentClick = (userName, text) => {
    addComment({
      variables: {
        where: {
          _id: newsitemId,
        },
        data: {
          userName,
          text,
        },
      },
    });
  };

  // Отправить комментарий, вызывает onCommentClick
  const newComment = (e) => {
    e.preventDefault();
    onCommentClick(read_cookie("name"), textAreaValue);
    setTextAreaValue("");
  };

  // Написать ответ пользователью в комментарии
  const commentTextArea = useRef("");
  const toAnswer = (e) => {
    setTextAreaValue(e.target.dataset.name + ", ");
    commentTextArea.current.focus();
  };

  if (loading || loading1) {
    return (
      <div className="catalogWrapper">
        <div className="catalogSides non">
          <div className="loader">
            <img src="/images/logoWhite.png" alt="" />
          </div>
        </div>
      </div>
    );
  }
  if (newsitem === null) {
    return (
      <>
        <div className="catalogWrapper">
          <div className="catalogSides non">
            <h2>Ничего не найдено</h2>
            <a href="/news" className="gohome">
              Свежие новости
            </a>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  //   Корректировка высоты textarea при обновлении текста
  const adjustHeight = (e) => {
    let ta = e.target;
    ta.style.height =
      ta.scrollHeight > ta.clientHeight
        ? ta.scrollHeight + "px"
        : ta.scrollHeight + "px";
  };
  //   Добавляет форму обновления текста
  const getUpdateForm = () => {
    return (
      <form onSubmit={updateNews}>
        <textarea
          className="update"
          name="text"
          defaultValue={newsitem.text}
          onKeyUp={adjustHeight}
        />
        <button type="submit" className="avatar">
          Сохранить
        </button>
      </form>
    );
  };
  //   Добавляет абзацы текста
  const getParagraphs = (text) => {
    let text1 = [];
    for (let item of text.split(/(\n)/)) {
      item = item.replace("<br>", "").replace("<br>", "");
      if (item.length > 1) {
        text1.push(item);
      }
    }
    return text1;
  };
  //   Добавляет кнопки админа
  const getAdminButtons = () => {
    return (
      <>
        <div className="delete" onClick={deleteNews}>
          <img src="/images/trash.png" alt="" />
        </div>
        <div style={{ top: 35 }} className="delete" onClick={update1}>
          <img src="/images/reload.png" alt="" />
        </div>
        <div style={{ top: 70 }} className="delete" onClick={makeMain}>
          <img src="/images/first.png" alt="" />
        </div>
      </>
    );
  };
  //   Добавляет комментарии
  const getAllComments = (item) => {
    return (
      <div key={item.date} className="comment">
        <div style={{ padding: 0 }} className="avatar">
          <img src="/images/defaultUser.png" alt="" />
        </div>
        <div>
          <div className="nick"> {item.userName} </div>
          <div className="comment_date">{getDate(Number(item.date))}</div>
          <div className="letter">{item.text}</div>
          {read_cookie("name") !== item.userName ? (
            <button onClick={toAnswer} data-name={item.userName}>
              Ответить
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  };
  return (
    <>
      <div className="NewsMain">
        <div className="catalogWrapper item">
          <TableTemp />
          <div className="catalogSides">
            <div className="filterbox">
              <Newsblock news={news} newsitem={newsitem} />
            </div>
            <div className="catologContent">
              <div className="newItem">
                <div className="main">
                  <h2>{newsitem.title}</h2>
                  <div className="usersInfo">
                    <div className="time">
                      <img src={clock} alt="" />
                      <p> {getDate(Number(newsitem.date))} </p>
                    </div>
                    <div className="sees">
                      <img src={eye} alt="" />
                      <p>{newsitem.viewed}</p>
                    </div>
                  </div>
                  <img
                    className="postimg"
                    src={newsitem.photo.split(",")[0]}
                    alt=""
                  />
                  <div className="postarticle">
                    {newsitem && newsitem.text
                      ? getParagraphs(newsitem.text).map((p) => (
                          <p key={p}>{p}</p>
                        ))
                      : ""}
                  </div>
                  {updateB ? getUpdateForm() : ""}
                  {newsitem.photo
                    .split(",")
                    .slice(1)
                    .map((item) => (
                      <img
                        className="postimg"
                        key={item}
                        src={"https://namulus.info/oldback/static/" + item}
                        alt=""
                      />
                    ))}
                  {read_cookie("role") === "admin" ||
                  read_cookie("role") === "editorNews"
                    ? getAdminButtons()
                    : ""}
                  <h4>Соблюдайте правила общения в комментариях.</h4>
                  <form
                    name="comment"
                    onSubmit={newComment}
                    className="commentform"
                  >
                    <div className="flex_center">
                      <textarea
                        name="text"
                        ref={commentTextArea}
                        placeholder="Написать комментарий"
                        value={textAreaValue}
                        onChange={(e) => setTextAreaValue(e.target.value)}
                        required
                      />
                    </div>
                    {read_cookie("token").length !== 0 ? (
                      <button type="submit">Отправить</button>
                    ) : (
                      "Авторизируйтесь, чтобы оставлять комментарии."
                    )}
                    {addCommentLoading ? (
                      <div className="loaderwrapper">
                        <div>
                          <img src="/images/logoWhite.png" alt="" />
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </form>
                  <div className="commentarium">
                    {newsitem.comments && newsitem.comments.length !== 0
                      ? newsitem.comments.map((item) => getAllComments(item))
                      : "Напишите первый комментарий!"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default Pieceofnews;
