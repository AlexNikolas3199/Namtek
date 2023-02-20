import React, { Component } from "react";
import { read_cookie } from "sfcookies";
import Axios from "axios";
export default class ForgotPass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usermail: "",
    };
  }
  componentDidMount() {
    if (read_cookie("token").length !== 0) {
      var body = {
        Authorization: "Bearer " + read_cookie("token").split(" ")[1],
      };
      const requestOptions = {
        method: "GET",
        headers: body,
      };
      fetch(
        "http://kvm4.golden9208.14kpz.vps.myjino.ru:49446/account/dashboard",
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          this.setState({
            usermail: data.user.email,
          });
        });
    }
  }
  sendRequest = (e) => {
    e.preventDefault();
    var form = e.target;
    const button = form.querySelector("button");
    button.disabled = true;
    form.className = "disabled";
    Axios({
      url: process.env.REACT_APP_SERV_URL,
      method: "post",
      data: {
        query: `
              query requestResetPassword($email: String!){
                requestResetPassword(where: {email: $email})
                }
                  `,
        variables: {
          email: form.elements.email.value,
        },
      },
    }).then(
      (result) => {
        // console.log(result);
        alert('Запрос получен. Перейдите по ссылке в письме, которое было направлено на вашу почту.')
        this.props.history.push('/Login');
      },
      (error) => {
        console.log(error);
        button.disabled = false;
        form.className = "";
      }
    );
  };
  render() {
    return (
      <div className="centerwrapper">
        <div className="flexCenter">
          <a href="/">
            <img src="/images/nam.png" alt="" />
          </a>
          <h1>Восстановление пароля</h1>
          <form onSubmit={this.sendRequest}>
            <label htmlFor="mail">
              Введите вашу подтвержденную почту, и мы вышлем вам ссылку для
              сброса пароля.
            </label>
            <input
              id="mail"
              name="email"
              type="email"
              defaultValue={this.state.usermail}
              placeholder="ivan@mail.ru"
              required
            />
            <button type="submit">Восстановить</button>
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
