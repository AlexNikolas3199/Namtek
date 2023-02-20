import React, { useRef } from "react";
import { GET_AUTH } from "../gqls/news/mutations";
import { useMutation } from "@apollo/react-hooks";
import { bake_cookie, read_cookie } from "sfcookies";

const Login = (props) => {
  // нахождение параметров в поисковой строке
  const params = window.location.search
    .replace("?", "")
    .split("&")
    .reduce(function (p, e) {
      let a = e.split("=");
      p[a[0]] = a[1];
      return p;
    }, {});
  let strGET = "/";
  //   переадресация
  if (params.next !== undefined) {
    strGET = params.next;
  }
  const formEl = useRef(null);
  const mesEl = useRef(null);
  // Мутация аутентификации
  const [authIt] = useMutation(GET_AUTH, {
    onCompleted: (data) => {
      // console.log(data)
      bake_cookie("token", `${data.auth}`);
      localStorage.setItem("token", data.auth.replace("jwt", ""));
      props.history.push(strGET);
    },
    onError: (er) => {
      console.log(er.message);
      formEl.current.button.disabled = false;
      formEl.current.className = "";
      let wrong = document.createElement("div");
      wrong.className = "wrong";
      wrong.textContent = "Неправильный логин или пароль.";
      mesEl.current.prepend(wrong);
    },
  });
  if (read_cookie("token").length !== 0) {
    // есть токен - нечего тут делать
    props.history.push(strGET);
  } else {
    const sendRequest = (e) => {
      e.preventDefault();
      let form = formEl.current;
      form.button.disabled = true;
      form.className = "disabled";

      //   // аутентификация, вызываем authIt
      authIt({
        variables: {
          login: encodeURIComponent(form.login.value),
          password: encodeURIComponent(form.password.value),
        },
      });
    };
    return (
      <div className="centerwrapper">
        <div className="flexCenter">
          <a href="/">
            <img src="/images/nam.png" alt="" />
          </a>
          <h1>Войти в аккаунт</h1>
          <form
            ref={formEl}
            onChange={() => {
              mesEl.current.innerHTML = "";
            }}
            onSubmit={sendRequest}
          >
            <div ref={mesEl} className="message"></div>
            <label htmlFor="log">Логин</label>
            <input id="log" name="login" placeholder="..." required />
            <label htmlFor="pass">Пароль</label>
            <input
              id="pass"
              name="password"
              type="password"
              placeholder="..."
              required
            />
            <a href="/ForgotPass">Забыли пароль?</a>
            <button name="button" type="submit">
              Войти
            </button>
          </form>
          <div className="link">
            Вы у нас впервые?
            <a href="/registration">Создать аккаунт</a>
          </div>
        </div>
      </div>
    );
  }
};
export default Login;
