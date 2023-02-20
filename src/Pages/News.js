import React, { Component } from "react";
import Footer from "../Components/Footer";
import CatalogSearch from "../Components/CatalogSearch";
import TableTemp from "../Components/TableTemp";
import NewItem from "../Components/NewItem";
// import Slider2 from "../Components/Slider2";
// import Announces from '../Components/Announces'
import Announces from "../Components/Announces";
import axios from "axios";
import { read_cookie } from "sfcookies";
import * as JsSearch from "js-search";
import MainNews from "../Components/MainNews";
export default class News extends Component {
  constructor(props) {
    super(props);
    this.state = {
      news: [],
      anons: [],
      isLoaded: false,
      count: 0,
    };
  }
  async componentDidMount() {
    const params = window.location.search
      .replace("?", "")
      .split("&")
      .reduce(function (p, e) {
        var a = e.split("=");
        p[a[0]] = a[1];
        return p;
      }, {});
    let page = 1;
    if (params.page) {
      page = Number(params.page);
    }
    if (!params.find) {
      axios({
        url: process.env.REACT_APP_SERV_URL,
        method: "post",
        data: {
          query: `
          query getPageCount{
            getPageCount
          }
             `,
        },
      }).then((result) => {
        if (result.data.data.getPageCount) {
          this.setState({
            count: result.data.data.getPageCount,
          });
        }
        // console.log(result.data.data);
      });
      axios({
        url: process.env.REACT_APP_SERV_URL,
        method: "post",
        data: {
          query: `
         query getNews($page:Int!){
           getNews(where: {page: $page}){
               _id
               title
               text
               photo
               date
               viewed
             }
           }
             `,
          variables: {
            page,
          },
        },
      }).then(
        (result) => {
          if (result.data.data.getNews) {
            this.setState({
              news: result.data.data.getNews,
              isLoaded: true,
            });
            //  console.log(this.state.news);
          }
        },
        (error) => {
          alert(error);
        }
      );
    } else {
      axios({
        url: process.env.REACT_APP_SERV_URL,
        method: "post",
        data: {
          query: `
            query getNewsSearch{
              getNewsSearch{
                _id
                title
                text
                photo
                date
                viewed
              }
            }
               `,
        },
      }).then((result) => {
        let search = new JsSearch.Search("_id");
        if (result.data.data.getNewsSearch) {
          search.addIndex("title");
          search.addIndex("text");
          // console.log(result.data.data.getNewsSearch)
          search.addDocuments(result.data.data.getNewsSearch);
          this.setState({
            isLoaded: true,
            find: decodeURIComponent(params.find),
            news: search.search(decodeURIComponent(params.find)),
          });
        }
        // console.log(search.search(decodeURIComponent(params.find)));
        document.querySelector(".topNews").remove();
      });
    }
    axios({
      url: process.env.REACT_APP_SERV_URL,
      method: "post",
      data: {
        query: `
        query getAnnouncements{
          getAnnouncements{
              _id
              title
              text
              photo
              startDate
              time
            }
          }
            `,
      },
    }).then(
      (result) => {
        if (result.data.data.getAnnouncements) {
          this.setState({
            anons: result.data.data.getAnnouncements,
          });
          // console.log(this.state.anons);
        }
      },
      (error) => {
        alert(error);
      }
    );
  }
  delete = (id) => {
    var answer = window.confirm("Удалить новость?");
    if (answer) {
      axios({
        url: process.env.REACT_APP_SERV_URL,
        method: "post",
        data: {
          query: `
                  mutation deleteNews($id: String!){
                  deleteNews(where: {_id: $id}){_id}
                  }
                  `,
          variables: {
            id
          },
        },
        headers: {
          authorization: read_cookie("token").replace("jwt", ""),
        },
      }).then((result) => {
        // console.log(result.data);
        if (result.data.data.deleteNews) {
          alert("Новость удалена.");
          window.location.reload();
        } else {
          alert("Новость не найдена.");
        }
      });
    }
  };

  render() {
    window.scroll(0, 0);
    const { isLoaded, anons, news, count } = this.state;
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
        let content = [];
        for (let i = 1; i <= count; i++) {
          content.push(
            <a href={window.location.pathname + "?page=" + i} key={i}>
              {i}
            </a>
          );
        }
        return content;
      };
      return (
        <>
          <div className="NewsMain">
            <div className="catalogWrapper">
              <CatalogSearch find={this.state.find} />
              <TableTemp />
              <MainNews delete={this.delete} />
              <div className="gridnews">
                <div className="mainNews">
                  <h3>Новости</h3>
                  {news.map((item) => (
                    <NewItem
                      key={item._id}
                      id={item._id}
                      text={item.title}
                      date={Number(item.date)}
                      liltext={item.text.slice(0, 100) + "..."}
                      viewed={item.viewed}
                      link={`/news/${item._id}`}
                      img={item.photo}
                    />
                  ))}
                  {count !== 0 ? (
                    <div className="pages">{getPages(count)}</div>
                  ) : (
                    ""
                  )}
                </div>
                <div className="announces">
                  <Announces anons={anons} />
                  <div className="advbanner">
                    <video src="/images/video3.mp4" autoPlay muted controls alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </>
      );
    }
  }
}
