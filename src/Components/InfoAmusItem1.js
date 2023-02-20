import React, { Component } from "react";
import mapPoint from "../img/mapPoint.png";
import { read_cookie } from "sfcookies";
import axios from "axios";
export default class InfoAmusItem1 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  deleteOther = (e) => {
    e.preventDefault();
    let buttonDel = e.target;
    var answer = window.confirm("Удалить услугу?");
    if (answer) {
      axios({
        url: process.env.REACT_APP_SERV_URL,
        method: "post",
        data: {
          query: `
                    mutation deleteOther($id: String){
                    deleteOther(where: {_id: $id}){_id}
                    }
                    `,
          variables: {
            id: this.props.id,
          },
        },
        headers: {
          authorization: read_cookie("token").replace("jwt", ""),
        },
      }).then((result) => {
        // console.log(result.data);
        if (result.data.data.deleteOther) {
          alert("Услуга удалена.");
          buttonDel.parentNode.remove();
        } else {
          alert("Услуга не найдена.");
        }
      });
    }
  };
  update1 = (e) => {
    let parent = e.target.parentNode;
    parent.querySelector(".infoAmusItem.new span").style.display = "none";
    this.setState({
      updateB: true,
    });
    setTimeout(() => {
      let ta = parent.querySelector("textarea.update");
      ta.style.height = ta.scrollHeight + "px";
    }, 1);
    e.target.addEventListener("click", () => {
      window.location.reload();
    });
  };
  update2 = (e) => {
    e.preventDefault();
    let form = e.target;
    var answer = window.confirm("Обновить услугу?");
    if (answer) {
      axios({
        url: process.env.REACT_APP_SERV_URL,
        method: "post",
        data: {
          query: `
                      mutation updateOther($id: String, $description: String, $title: String, $address: String, $number: String, $workTime: String){
                      updateOther(where: {_id: $id}, data: {description: $description, title: $title, address: $address, number: $number, workTime: $workTime})
                      }
                      `,
          variables: {
            id: this.props.id,
            title: form.elements.title.value,
            description: form.elements.text.value,
            address: form.elements.address.value,
            number: form.elements.number.value,
            workTime: form.elements.workTime.value,
          },
        },
        headers: {
          authorization: read_cookie("token").replace("jwt", ""),
        },
      }).then((result) => {
        // console.log(result.data);
        if (result.data.data.updateOther) {
          alert("Услуга обновлена.");
          window.location.reload();
        } else {
          alert("Услуга не найдена.");
        }
      });
    }
  };
  render() {
    let text = [];
    for (let item of this.props.description.split(/(\n)/)) {
      if (item.length > 1) {
        text.push(item);
      }
    }
    const readmoreOpen = (e)=>{
      const span = e.target
      const parent = span.parentNode
      span.classList.add('disnone')
      parent.querySelector("span").className=""
      parent.querySelector(".close").classList.remove('disnone')
    }
    const readmoreClose = (e)=>{
      const span = e.target
      const parent = span.parentNode
      span.classList.add('disnone')
      parent.querySelector("span").className="mainText"
      parent.querySelector(".open").classList.remove('disnone')
    }
    const adjustHeight = (el) => {
      let ta = el.target;
      ta.style.height =
        ta.scrollHeight > ta.clientHeight
          ? ta.scrollHeight + "px"
          : ta.scrollHeight + "px";
    };
    return (
      <div className="infoAmusItem new">
        <img src={this.props.image} alt="" />
        <span>
          <div>
            <h5>{this.props.title}</h5>
            <div className="worktime">{this.props.workinfo}</div>
          </div>
          <span className="mainText">
            {text.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </span>
          <span onClick={readmoreOpen} className="readMore open">Читать дальше</span>
          <span onClick={readmoreClose} className="readMore disnone close">Скрыть</span>
          <div className="sellerinfo">
            <img src={mapPoint} alt="" />
            <p>{this.props.address}</p>
          </div>
          <a
            href={`tel:${this.props.number}`}
            data-number={this.props.number}
            className="phoneNumber"
          >
            Позвонить
          </a>
        </span>
        {this.state.updateB ? (
          <form className="update" onSubmit={this.update2}>
            <input name="title" defaultValue={this.props.title} />
            <input
              name="workTime"
              defaultValue={this.props.workinfo}
              placeholder="Рабочее время"
            />
            <textarea
              className="update"
              name="text"
              defaultValue={this.props.description}
              onKeyUp={adjustHeight}
            ></textarea>
            <input name="address" defaultValue={this.props.address} />
            <input
              name="number"
              defaultValue={this.props.number}
              placeholder="Номер"
            />
            <button type="submit" className="avatar">
              Сохранить
            </button>
          </form>
        ) : (
          ""
        )}
        {read_cookie("role") === "admin" ? (
          <>
            <div className="delete" onClick={this.deleteOther}>
              <img src="/images/trash.png" alt="" />
            </div>
            <div style={{ top: 40 }} className="delete" onClick={this.update1}>
              <img src="/images/reload.png" alt="" />
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    );
  }
}
