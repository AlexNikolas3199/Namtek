import React, {Component} from 'react'
import { read_cookie } from "sfcookies";
import axios from "axios";
export default class AdvertCard extends Component {
    delete = (e) => {
      e.preventDefault();
      let buttonDel = e.target;
      var answer = window.confirm(
        "Удалить объявление?"
      );
      if (answer) {
          axios({
            url: process.env.REACT_APP_SERV_URL,
            method: "post",
            data: {
            query: `
                    mutation deleteAdAdmin($id: String!){
                    deleteAdAdmin(where: {_id: $id}){_id}
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
            if (result.data.data.deleteAdAdmin) {
              alert("Объявление удалено.");
              buttonDel.parentNode.parentNode.remove();
            } else {
              alert("Объявление не найдено.");
            }
          });
      }
    };
    render() {
        return(
            <a className={'advertCard '+ (this.props.type === 'paid' ? 'gold' : '')} href={`/Ads/${this.props.id}`}>
                <img src={this.props.img.split(',')[0]} alt=""/>
                <div>
                    <h5>{this.props.text}</h5>
                    <p>{this.props.price.replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ')} ₽</p>
                    <div>Подробнее</div>
                    {read_cookie('role')==='admin'
                    ?<div className="delete" onClick={this.delete}><img src="/images/trash.png" alt="" /></div>
                    :''}
                </div>
            </a>
        )
    }
}
