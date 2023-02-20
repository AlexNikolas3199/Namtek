import React, { Component } from "react";
import { read_cookie } from "sfcookies";
import axios from "axios";
export default class InfoAmusItem3 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  delete = (e) => {
    e.preventDefault();
    let buttonDel = e.target;
    var answer = window.confirm("Удалить фильм?");
    if (answer) {
      axios({
        url: process.env.REACT_APP_SERV_URL,
        method: "post",
        data: {
          query: `
                    mutation deleleAfisha($id: String){
                    deleleAfisha(where: {_id: $id}){_id}
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
        if (result.data.data.deleleAfisha) {
          alert("Фильм удален.");
          buttonDel.parentNode.remove();
        } else {
          alert("Фильм не найден.");
        }
      });
    }
  };
  update1 = (e) => {
    let parent = e.target.parentNode
    parent.querySelector('.infoAmusItem.new span').style.display = 'none'
    this.setState({
      updateB : true
    });
    setTimeout(()=>{
      let ta = parent.querySelector('textarea.update')
      ta.style.height = ta.scrollHeight+"px"
    },1)
    e.target.addEventListener('click',()=>{window.location.reload()})
  }
  update2 = (e) => {
    e.preventDefault();
    let form = e.target
    var answer = window.confirm("Обновить фильм?");
    if (answer) {
      axios({
        url: process.env.REACT_APP_SERV_URL,
        method: "post",
        data: {
          query: `
                    mutation updateAfisha($id: String, $text: String, $title: String!, $age: String, $genre: String, $country: String, $duration: String){
                    updateAfisha(where: {_id: $id}, data: {text: $text, title: $title, age: $age, genre: $genre, country: $country, duration: $duration}){_id}
                    }
                    `,
          variables: {
            id: this.props.id,
            title: form.elements.title.value,
            text: form.elements.text.value,
            age: form.elements.age.value,
            genre: form.elements.genre.value,
            country: form.elements.country.value,
            duration: form.elements.duration.value
          },
        },
        headers: {
          authorization: read_cookie("token").replace("jwt", ""),
        },
      }).then((result) => {
        // console.log(result.data);
        if (result.data.data.updateAfisha) {
          alert("Фильм обновлен.");
          window.location.reload()
        } else {
          alert("Фильм не найден.");
        }
      });
    }
  };
  render() {
    let text = [];
    for (let item of this.props.text.split(/(\n)/)) {
      if (item.length > 1) {
        text.push(item);
      }
    }
    let adjustHeight = (el) =>{
      let ta = el.target
      ta.style.height = (ta.scrollHeight > ta.clientHeight) ? (ta.scrollHeight)+"px" : (ta.scrollHeight)+"px";
    }
    return (
      <div className="infoAmusItem new kino">
        <img src={this.props.image} alt="" />
        <span>
          <div>
            {/* <h5><a href={this.props.link}>{this.props.title}</a></h5> */}
            <h5>{this.props.title}</h5>
            <div className="age">{this.props.age}+</div>
          </div>
          {text.map((item) => (
            <p style={{marginTop: 2.5,marginBottom: 2.5}} key={item}>{item}</p>
          ))}
          <div className="movieData">
            <div>
              <h4>Жанр:</h4>
              <p>{this.props.genre}</p>
            </div>
            <div>
              <h4>Страна:</h4>
              <p>{this.props.country}</p>
            </div>
            <div>
              <h4>Продолжительность:</h4>
              <p>{this.props.duration}</p>
            </div>
          </div>
        </span>
        {this.state.updateB
        ?<form className="update" onSubmit={this.update2}>
          <input name="title" defaultValue={this.props.title}/>
          <input name="age" defaultValue={this.props.age} placeholder="Возраст" />
          <textarea className="update" name="text" defaultValue={this.props.text} onKeyUp={adjustHeight}></textarea>
          <input name="genre" defaultValue={this.props.genre} placeholder="Жанр"/>
          <input name="country" defaultValue={this.props.country}/>
          <input name="duration" defaultValue={this.props.duration}/>
          <button type="submit" className="avatar">Сохранить</button>
        </form>
        :''}
        {read_cookie("role") === "kinoman" || read_cookie("role") === "admin" ? (
          <>
          <div className="delete" onClick={this.delete}>
            <img src="/images/trash.png" alt="" />
          </div>
          <div style={{top: 40}} className="delete" onClick={this.update1}>
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
