import React, { useState, useEffect } from "react";
import Footer from "../Components/Footer";
import CatalogSearch from "../Components/CatalogSearch";
import AdvertCard from "../Components/AdvertCard";
import Filter from "../Components/Filter";
import * as JsSearch from "js-search";
import axios from "axios";
const Ads = () => {
  const [ads, setAds] = useState([]);
  const [count, setCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const params = window.location.search
      .replace("?", "")
      .split("&")
      .reduce(function (p, e) {
        var a = e.split("=");
        p[a[0]] = a[1];
        return p;
      }, {});
    if (!params.find) {
      let page = 1;
      if (params.page) {
        page = Number(params.page);
      }
      let category = "";
      if (params.category) {
        category = params.category;
      }
      axios({
        url: process.env.REACT_APP_SERV_URL,
        method: "post",
        data: {
          query: `
              query getAdPages($category: String!){
                getAdPages( where: {category: $category})
              }
                 `,
          variables: {
            category,
          },
        },
      }).then((result) => {
        if (result.data.data.getAdPages) {
          setCount(result.data.data.getAdPages);
        }
        // console.log(result.data.data.getAdPages);
      });
      axios({
        url: process.env.REACT_APP_SERV_URL,
        method: "post",
        data: {
          query: `
              query getAds($page:Int!, $category: String){
                getAds(where: {page: $page, category: $category}){
                    _id
                    title
                    price
                    description
                    expired
                    logo
                    type
                  }
                }
                  `,
          variables: {
            page,
            category,
          },
        },
      }).then((result) => {
        if (result.data.data.getAds) {
          setAds(result.data.data.getAds);
          setIsLoaded(true);
        }
        // console.log(result.data.data);
      });
    } else {
      axios({
        url: process.env.REACT_APP_SERV_URL,
        method: "post",
        data: {
          query: `
              query getAdsSearch{
                getAdsSearch{
                  title
                  _id
                  price
                  logo
                }
              }
                 `,
        },
      }).then((result) => {
        if (result.data.data.getAdsSearch) {
          var search = new JsSearch.Search("_id");
          search.addIndex("title");
          search.addDocuments(result.data.data.getAdsSearch);
          setAds(search.search(decodeURIComponent(params.find)));
          setIsLoaded(true);
        }
        // console.log(search.search(decodeURIComponent(params.find)));
      });
    }
  }, []);
  let categories = [
    { name: "category", value: "products", title: "Продукты питания" },
    {
      name: "category",
      value: "construction",
      title: "Ремонт и строительство",
    },
    { name: "category", value: "sport", title: "Спорт и здоровье" },
    { name: "category", value: "hobby", title: "Хобби и увлечения" },
    { name: "category", value: "beauty", title: "Товары для красоты" },
    { name: "category", value: "house", title: "Недвижимость" },
    { name: "category", value: "work", title: "Вакансии/Работа" },
    { name: "category", value: "Auto", title: "Авто" },
    { name: "category", value: "Services", title: "Услуги" },
    {
      name: "category",
      value: "Technics",
      title: "Бытовая техника и электроника",
    },
    { name: "category", value: "holidays", title: "Всё для праздников" },
    { name: "category", value: "garden", title: "Для дома и дачи" },
    { name: "category", value: "Pets", title: "Домашние животные" },
    { name: "category", value: "Computers", title: "Компьютеры, телефоны" },
    { name: "category", value: "Furniture", title: "Мебель и интерьер" },
    { name: "category", value: "Finds", title: "Находки, потери" },
    { name: "category", value: "clothing", title: "Одежда, обувь, аксессуары" },
    {
      name: "category",
      value: "exchange",
      title: "Отдам, возьму бесплатно, обменяю",
    },
  ];
  if (!isLoaded) {
    return (
      <div className="catalogWrapper">
        <div className="loader">
          <img src="/images/logoWhite.png" alt="" />
        </div>
      </div>
    );
  } else {
    const getPages = (count) => {
      if (count > 1) {
        const params = window.location.search
          .replace("?", "")
          .split("&")
          .reduce(function (p, e) {
            var a = e.split("=");
            p[a[0]] = a[1];
            return p;
          }, {});
        let content = [];
        for (let i = 1; i <= count; i++) {
          if (params.category) {
            content.push(
              <a
                href={
                  window.location.pathname +
                  `?category=${params.category}&page=` +
                  i
                }
                key={i}
              >
                {i}
              </a>
            );
          } else {
            content.push(
              <a href={window.location.pathname + "?page=" + i} key={i}>
                {i}
              </a>
            );
          }
        }
        return content;
      } else {
        return "";
      }
    };
    return (
      <>
        <div className="catalogWrapper AdsMain fix">
          <CatalogSearch />
          <div className="catalogSides fix">
            <div className="filterbox">
              <Filter name="Категории" parameters={categories} />
            </div>
            <div className="catologContent">
              <a href="/AdsPost">
                <div></div>
              </a>
              <div className="advert_container">
                <h3>Объявления</h3>
                <div className="adverts">
                  {ads.length !== 0
                    ? ads.map((item) => (
                        <AdvertCard
                          key={item._id}
                          id={item._id}
                          price={item.price}
                          text={item.title}
                          img={item.logo}
                          type={item.type}
                        />
                      ))
                    : "Объявлений нет :("}
                </div>
                {count !== 0 ? (
                  <div className="pages">{getPages(count)}</div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }
};
export default Ads;
