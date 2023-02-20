import React from "react";
import { NavLink } from "react-router-dom";
import LogIn from "../Components/LogIn";
import { read_cookie, bake_cookie } from "sfcookies";

const Header = (props) => {
  // Адаптация для смартфонов
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
  window.addEventListener("resize", () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  });
// кнопка навигации для смартфонов
  const navbtnf = function () {
    var navbtn = document.querySelector(".navbtn");
    var appNav = document.querySelector(".appNav");
    var body = document.querySelector("body");
    const darkness = document.querySelector(".darkness");
    var navlinks = document.querySelectorAll(".appNav .rightHeader nav a");
    const arr = [darkness, navbtn, appNav, body];
    for (let item of arr) {
      item.classList.toggle("active");
    }
    darkness.addEventListener("click", function () {
      for (let item of arr) {
        item.classList.remove("active");
      }
    });
    for (let item of navlinks) {
      item.addEventListener("click", function () {
        for (let item of arr) {
          item.classList.remove("active");
        }
      });
    }
  };
  const checkcookieAgree = (e) => {
    bake_cookie("cookieAgree", "true");
    e.target.parentNode.remove();
  };
  return (
    <>
      <div className="mobHeader">
        <a href="/" className="heading">
          <img src="/images/nam.png" alt="" />
          <span>
            <p>Информационный портал Намского улуса</p>
          </span>
        </a>
        <div onClick={navbtnf} className="navbtn">
          <div className="lan"></div>
        </div>
      </div>
      <div className="darkness"></div>
      <header className="appNav">
        <a href="/" className="heading">
          <img src="/images/nam.png" alt="" />
          <span>
            <p>Информационный портал Намского улуса</p>
          </span>
        </a>
        <div className="rightHeader">
          <nav>
            <NavLink activeStyle={{color:'#EE6812'}} to="/news">Новости</NavLink>
            <NavLink activeStyle={{color:'#EE6812'}} to="/shops">Магазины</NavLink>
            <NavLink activeStyle={{color:'#EE6812'}} to="/amusement/Services">Услуги</NavLink>
            <NavLink activeStyle={{color:'#EE6812'}} to="/ads">Объявления</NavLink>
            <NavLink activeStyle={{color:'#EE6812'}} to="/tourism">Туризм</NavLink>
            <NavLink activeStyle={{color:'#EE6812'}} to="/cinema">Кинотеатр</NavLink>
            <NavLink activeStyle={{color:'#EE6812'}} to="/amusement/Health">Здоровье</NavLink>
            <NavLink activeStyle={{color:'#EE6812'}} to="/food">Кафе, рестораны</NavLink>
            <NavLink activeStyle={{color:'#EE6812'}} to="/amusement/Entertainment">Развлечения</NavLink>
            <NavLink activeStyle={{color:'#EE6812'}} to="/photos-videos">Фото/видео</NavLink>
            <NavLink activeStyle={{color:'#EE6812'}} to="/radio">Местное радио</NavLink>
          </nav>
          <LogIn />
        </div>
      </header>
      {read_cookie("cookieAgree").length === 0 ? (
        <div className="cookie-popup">
          <button onClick={checkcookieAgree} className="close"></button>
          <h2>Мы используем файлы cookies</h2>
          <p>
            Они помогают улучшить работу сайта и сделать его удобнее. Посещая
            страницы сайта, вы соглашаетесь с{" "}
            <a href="/images/Обработка персональных данных.pdf" target="_blank">
              условиями использования
            </a>
          </p>
          <button onClick={checkcookieAgree} className="agree">
            Согласен
          </button>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default Header;
