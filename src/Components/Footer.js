import React, { Component } from "react";

export default class Footer extends Component {
  render() {
    return (
      <footer>
        <div className="footerLogo">
          <img src="/images/logo.png" alt="" />
          <span>
            <h3>АНО РЦРИТ «Куб-А»</h3>
          </span>
        </div>
        <div className="footerNav">
          <nav>
            <a href="/">Контакты</a>
            <a href="/images/aboutUs.pdf" target="_blank">О нас</a>
            <a href="/">Реклама</a>
            <a href="/">Инфо</a>
          </nav>
          <div className="rectangle">
            <a
              style={{ color: "#fff" }}
              href="/images/Обработка персональных данных.pdf"
              target="_blank"
            >
              Политика в отношении обработки персональных данных
            </a>
            <div></div>
            <div></div>
          </div>
        </div>
        <div className="byWho">
          Cделано командой @itsea из сообщества @Ludum Devolution
        </div>
      </footer>
    );
  }
}
