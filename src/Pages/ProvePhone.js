import React, { Component } from 'react'
import { read_cookie } from 'sfcookies';
export default class ProvePhone extends Component{

    componentDidMount() {
        if(read_cookie('token').length === 0){
            this.props.history.push(`/Login`);
        }
    }
    sendRequest = (e) =>{
      e.preventDefault();
      var form = e.target
      const button = form.querySelector('button')
      button.disabled = true
      form.className="disabled"
      var wrong = document.createElement('div')
      wrong.className="wrong"
      let body = {
        code: form.elements.code.value
      };
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json','Authorization': 'Bearer '+ read_cookie('token').replace('jwt','') },
        body: JSON.stringify(body)
      }
      fetch(process.env.REACT_APP_IMAGE_URL+'/account/number/confirmTel', requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if (data.success === true) {
            // console.log(data);
            this.props.history.push(`/Settings`);
          } else {
            // console.log(data);
            button.disabled = false
            form.className=""
            wrong.textContent = 'Неверный код.'
            form.querySelector('.message').innerHTML = ''
            form.querySelector('.message').prepend(wrong)
          }
        });
    }
    render(){
        return(
            <>
            <div className="centerwrapper">
                <div className="flexCenter">
                    <a href="/"><img src="/images/nam.png" alt="" /></a>
                    <h1>Подтверждение номера</h1>
                    <form onSubmit={this.sendRequest}>
                        <div className="message"></div>
                        <label htmlFor="cod">Мы выслали вам код на номер телефона. Введите его для подтверждения.</label>
                        <input id="cod" name="code" type="number" placeholder="Код" required/>
                        <button type="submit">Подтвердить</button>
                    </form>
                </div>
            </div>
            </>
        )
    }
}
