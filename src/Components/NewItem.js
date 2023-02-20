import React, {Component} from 'react'
import eye from '../img/eye.png'
import clock from '../img/clock.png'
import { read_cookie } from "sfcookies";
import axios from "axios";

export default class NewItem extends Component {
    delete = (e) => {
      e.preventDefault();
      let buttonDel = e.target;
      var answer = window.confirm(
        "Удалить новость?"
      );
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
                id: this.props.id,
              },
            },
            headers: {
              authorization: read_cookie("token").replace("jwt", ""),
            },
          }).then((result) => {
            // console.log(result.data);
            if (result.data.data.deleteNews) {
              alert("Новость удалена.");
              buttonDel.parentNode.remove();
            } else {
              alert("Новость не найдена.");
            }
          });
      }
    };
    render() {
        var options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
          };
        var date = new Date(Number(this.props.date))
        return(
            <a href={this.props.link} className="newItem">
                <div className="img">
                    <img src={this.props.img.split(',')[0]} alt=""/>
                </div>
                <div className="text" >
                    <p>{this.props.text}</p>
                    <div className="mainNewstext">{this.props.liltext}</div>
                    <div className="usersInfo">
                        <div className="time">
                            <img src={clock} alt="" />
                            <p>{ date.toLocaleString("ru",options) }</p>
                        </div>
                        <div className="sees">
                            <img src={eye} alt="" />
                            <p> {this.props.viewed} </p>
                        </div>
                    </div>
                </div>
                {read_cookie('role')==='admin' || read_cookie('role')==='editorNews'
                ?<div className="delete" onClick={this.delete}><img src="/images/trash.png" alt="" /></div>
                :''}
            </a>
        )
    }
}
