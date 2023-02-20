import React, { Component } from "react";
import { read_cookie } from "sfcookies";
import Axios from "axios";
export default class ForgotPassNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usermail: "",
    };
  }
  componentDidMount() {
    if (read_cookie("token").length !== 0) {
      this.props.history.push(`/Login`);
    }
    let code = window.location.search.replace("?Code=", "");
    if (code === "") {
      this.props.history.push(`/Login`);
    }
  }
  sendRequest = (e) => {
    e.preventDefault();
    var form = e.target;
    let wrong = form.querySelector(".wrong");
    wrong.innerHTML = "";
    if (form.elements.password1.value === form.elements.password2.value) {
      form.className = "disabled";
      Axios({
        url: process.env.REACT_APP_SERV_URL,
        method: "post",
        data: {
          query: `
          mutation changePassword($code: String!,$password: String!){
                      changePassword(data:{password: $password}, where: {code: $code})
                      }
                        `,
          variables: {
            password: String(form.elements.password1.value),
            code: String(window.location.search.replace("?Code=", "")),
          },
        },
      }).then(
        (result) => {
          // console.log(result);
          this.props.history.push("/Login");
        },
        (error) => {
          console.log(error);
          form.className = "";
        }
      );
    } else {
      wrong.textContent = "Пароли не совпадают";
    }
  };
  render() {
    return (
      <div className="centerwrapper">
        <div className="flexCenter">
          <a href="/">
            <img src="/images/nam.png" alt="" />
          </a>
          <h1>Новый пароль</h1>
          <form onSubmit={this.sendRequest}>
            <div className="message">
              <div className="wrong"></div>
            </div>
            <label htmlFor="pass1">Введите новый пароль:</label>
            <input id="pass1" name="password1" type="password" required />
            <label htmlFor="pass2">Ещё раз:</label>
            <input id="pass2" name="password2" type="password" required />
            <button type="submit">Сохранить</button>
          </form>
          <div className="link">
            Вспомнили пароль?
            <a href="/Login">Войти в аккаунт</a>
          </div>
        </div>
      </div>
    );
  }
}
