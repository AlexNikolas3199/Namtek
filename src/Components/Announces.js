import React, { Component } from "react";
import { read_cookie } from "sfcookies";
import axios from "axios";

export default class Announces extends Component {
  delete = (e) => {
    e.preventDefault();
    let buttonDel = e.target;
    var answer = window.confirm("Удалить анонс?");
    if (answer) {
      axios({
        url: process.env.REACT_APP_SERV_URL,
        method: "post",
        data: {
          query: `
                    mutation deleteAnnouncement($id: String){
                    deleteAnnouncement(where: {_id: $id}){_id}
                    }
                    `,
          variables: {
            id: buttonDel.dataset.id,
          },
        },
        headers: {
          authorization: read_cookie("token").replace("jwt", ""),
        },
      }).then((result) => {
        // console.log(result.data);
        if (result.data.data.deleteAnnouncement) {
          alert("Анонс удален.");
          buttonDel.parentNode.remove();
        } else {
          alert("Анонс не найден.");
        }
      });
    }
  };
  getDate(n) {
    let options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    };
    let date = new Date(n);
    return date
      .toLocaleString("ru", options)
      .replace(".", "/")
      .replace(".", "/");
  }
  render() {
    const imgPopUp = (e) => {
      let newitem = e.target;
      let wrapper = document.querySelector(".Anonspopup img");
      let darkness = document.querySelector(".darkness")
      wrapper.src = newitem.querySelector(".img img").src;
      document.querySelector("body").classList.add("active")
      document.querySelector(".Anonspopup").classList.add("active");
      document.querySelector('.mobHeader').classList.add('z99')
      document.querySelector('.appNav').classList.add('z99')
      darkness.classList.add("active");
      darkness.addEventListener('click',closer1)
    };
    const closer1 = () => {
      document.querySelector('.mobHeader').classList.remove('z99')
      document.querySelector('.appNav').classList.add('z99')
      document.querySelector(".darkness").classList.remove("active");
      document.querySelector("body").classList.remove("active")
      document.querySelector(".Anonspopup").classList.remove("active");
    };
    return (
      <>
        <h3>Анонсы</h3>
        <div className="Anonspopup">
          <img src="" alt="" />
          <div onClick={closer1} className="filtercloser photo"></div>
        </div>
        {this.props.anons.map((item) => (
          <div onClick={imgPopUp} key={item._id} className="newItem">
            <div className="img">
              <img src={item.photo} alt="" />
            </div>
            <div className="text">
              <p>{item.title}</p>
              <div>
                <div className="mainNewstext">{item.text}</div>
                <div className="usersInfo">
                  <div className="time">
                    <p>{item.time}</p>
                  </div>
                  <div className="date">
                    <p>{this.getDate(Number(item.startDate))}</p>
                  </div>
                </div>
              </div>
            </div>
            {read_cookie("role") === "admin" ||
            read_cookie("role") === "editorNews" ? (
              <div className="delete" data-id={item._id} onClick={this.delete}>
                <img src="/images/trash.png" alt="" />
              </div>
            ) : (
              ""
            )}
          </div>
        ))}
      </>
    );
  }
}
