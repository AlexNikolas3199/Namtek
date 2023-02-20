import React, { Component } from "react";
import { read_cookie } from "sfcookies";
export default class ProveEmail extends Component {
  componentDidMount() {
    if (read_cookie("token").length === 0) {
      this.props.history.push(`/Login`)
    }
    let code =window.location.search.replace("?Code=", "")
    if(code !== ''){
        fetch(process.env.REACT_APP_IMAGE_URL+`/account/confirmEmail?confirmCode=${code}`)
        .then((response) => response.json())
        .then(
            (data) => {
                // console.log(data)
                this.props.history.push('/Settings');
            },
            (error)=>{
                console.log(error)
            }
        );
    }
  }
  sendRequest = (e) => {
    e.preventDefault();
    var form = e.target;
    const button = form.querySelector("button");
    button.disabled = true;
    form.className = "disabled";
    var wrong = document.createElement("div");
    wrong.className = "wrong";
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { confirmCode: form.elements.confirmCode.value },
    };
    fetch(
      "http://kvm4.golden9208.14kpz.vps.myjino.ru:49446/account/confirmEmail",
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
      });
  };
  render() {
    return (
      <>
        <div className="centerwrapper">
          <div className="flexCenter">
            <a href="/">
              <img src="/images/nam.png" alt="" />
            </a>
            <h1>Подтверждение почты</h1>
            <form onSubmit={this.sendRequest}>
              <label htmlFor="cod" className="onlyMessage">
                Мы выслали код на вашу почту. Перейдите по ссылке для
                подтверждения почты.
              </label>
            </form>
          </div>
        </div>
      </>
    );
  }
}
