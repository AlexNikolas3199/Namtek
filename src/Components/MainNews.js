import React, { useState, useEffect } from "react";
import axios from "axios";
import {useQuery} from "@apollo/react-hooks";
import eye1 from "../img/eye1.png";
import clock1 from "../img/clock1.png";
import { read_cookie } from "sfcookies";
import {GET_NEWS_MAIN} from '../gqls/news/queries'

const MainNews = (props) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mainNew, setMainNew] = useState(undefined);
  const {data} = useQuery(GET_NEWS_MAIN)
  // console.log('testData',data)
  useEffect(() => {
    axios({
      url: process.env.REACT_APP_SERV_URL,
      method: "post",
      data: {
        query: `
        query{
            getNewsMain{
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
      // console.log(result)
      let mainNew = result.data.data.getNewsMain
      if(mainNew !== null){
        setMainNew(result.data.data.getNewsMain[0])
      }
      setIsLoaded(true)
    });
  }, []);
  if (!isLoaded || mainNew === undefined) {
    return (
      <div className="topNews">
        <div className="loaderwrapper">
          <div>
            <img src="/images/logoWhite.png" alt="" />
          </div>
        </div>
      </div>
    );
  } else {
    const getDate = (n) => {
      let options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      };
      let date = new Date(n);
      return date.toLocaleString("ru", options);
    }
    return (
      <a href={`/News/${mainNew._id}`} className="topNews">
        <img src={mainNew.photo.split(",")[0]} alt="" />
        <div className="toptext">
          <p>{mainNew.title}</p>
          <div className="usersInfo">
            <div className="time">
              <img src={clock1} alt="" />
              <p>{getDate(Number(mainNew.date))}</p>
            </div>
            <div className="sees">
              <img src={eye1} alt="" />
              <p>{mainNew.viewed}</p>
            </div>
          </div>
        </div>
        {read_cookie("role") === "admin" ||
        read_cookie("role") === "editorNews" ? (
          <div className="delete" onClick={props.delete}>
            <img src="/images/trash.png" alt="" />
          </div>
        ) : (
          ""
        )}
      </a>
    );
  }
};
export default MainNews;
