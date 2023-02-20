import React, { Component } from 'react'
import { read_cookie } from 'sfcookies';
export default class Registration extends Component{
    render(){
      if(read_cookie('token').length !== 0){
        this.props.history.push(`/`);
      }else{
        var sendRequest = (e) =>{
            e.preventDefault();
            var form = e.target
            if(form.elements.personal.checked){
              const button = form.querySelector('button')
              button.disabled = true
              form.className="disabled"
              var body = {
                  login: form.elements.login.value,
                  password: form.elements.password.value,
                  email: form.elements.email.value,
                  name: form.elements.name.value,
                  surname: form.elements.surname.value,
              };
              const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
              };
              fetch(process.env.REACT_APP_IMAGE_URL+'/account/reg', requestOptions)
                .then((response) => response.json())
                .then((data) => {
                  if (data.success === true) {
                    // console.log(data);
                    this.props.history.push('/Login');
                  } else {
                    // console.log(data);
                    button.disabled = false
                    form.className=""
                    alert('Такой логин уже существует.')
                  }
                });
            }else{
              alert('Поставьте галочку!')
            }
          }
        }
        return(
            <div className="centerwrapper">
                <div className="flexCenter flex">
                  <a href="/"><img src="/images/nam.png" alt="" /></a>
                  <h1>Создание аккаунта</h1>
                    <form onSubmit={sendRequest}>
                      <div className="labels">
                        <div>
                          <label htmlFor="name">Имя</label>
                          <input id="name" name="name" placeholder="Иван" required/>
                        </div>
                        <div>
                          <label htmlFor="sur">Фамилия</label>
                          <input id="sur" name="surname"  placeholder="Иванов" required/>
                        </div>
                        <div>
                          <label htmlFor="mail">Почта</label>
                          <input id="mail" type="email" name="email" placeholder="ivan@mail.ru" required/>
                        </div>
                        {/* <div>
                          <label htmlFor="tel">Номер телефона</label>
                          <input id="tel" pattern="[+][7][0-9]{10}" type="tel" placeholder="+79142889727" required name="tel"/>
                        </div> */}
                        <div>
                          <label htmlFor="log">Логин</label>
                          <input id="log" name="login"  placeholder="..." required/>
                        </div>
                        <div>
                          <label htmlFor="pass">Пароль</label>
                          <input id="pass" name="password" type="password"  placeholder="..." required/>
                        </div>
                        <div className="personalCheckBox">
                          <input id="personal" name="personal" type="checkbox" required/>
                          <label htmlFor="personal">Даю <a href="/images/Обработка персональных данных.pdf" target="_blank">согласие</a> на обработку своих персональных данных.</label>
                        </div>
                      </div>
                        <button type="submit">Зарегистрироваться</button>
                    </form>
                    <div className="link">
                        Уже есть аккаунт?
                        <a href="/Login">Войти</a>
                    </div>
                </div>
            </div>
        )
    }
}
