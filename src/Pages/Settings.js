import React, { Component } from 'react'
import Footer from '../Components/Footer'
import SettingsFilt from '../Components/SettingsFilt'
import { read_cookie } from 'sfcookies';
import user from '../img/defaultUser.png'
import axios from 'axios'
export default class Settings extends Component {

    constructor(props) {
        super(props);
        this.state = {
          error: null,
          isLoaded: false,
          role:'',
          username: '',
          usersurname: '',
          usermail: '',
          tel: null,
          numConfirmed: false
        };
      }
   async componentDidMount() {
        if(read_cookie('token').length !== 0){
            this.setState({
                role: read_cookie('role')
            })
            var body = {
                Authorization: "Bearer " + read_cookie("token").replace("jwt", "")
            };
            const requestOptions = {
                method: 'GET',
                headers: (body)
            };
            await fetch(process.env.REACT_APP_IMAGE_URL+'/account/dashboard', requestOptions)
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    isLoaded: true,
                    username: data.user.name,
                    usersurname: data.user.surname,
                    usermail: data.user.email,
                    tel:data.user.tel,
                    numConfirmed: data.user.numConfirmed,
                    confirmed: data.user.confirmed
                });
                // console.log(data)
                },
                (error) => {
                console.log(error)
                this.setState({
                    isLoaded: true,
                    error
                });
            });
        }else{
            this.props.history.push(`/Login/?next=${window.location.pathname}`);
        }
    }

    addTel = e =>{
        e.preventDefault()
        let form = e.target
        form.querySelector('button').disabled = true
        axios({
            url: process.env.REACT_APP_SERV_URL,
            method: "post",
            data: {
              query: `
                  mutation requestCodeTel($tel: String){
                    requestCodeTel(where: {tel:$tel})
                    }
                  `,
              variables: {
                tel: form.elements.tel.value,
              },
            },
            headers: {
              authorization:  read_cookie('token').replace('jwt','')
            },
          }).then((data) => {
            //   console.log(data)
              if(data.data.data.requestCodeTel){
                this.props.history.push('/ProvePhone');
              }else{
                alert(data.data.errors[0].message)
                document.location.reload()
              }
            })
    }

    addEmail = e =>{
        e.preventDefault()
        let form = e.target
        form.querySelector('button').disabled = true
        axios({
            url: process.env.REACT_APP_SERV_URL,
            method: "post",
            data: {
              query: `
                  mutation requestCodeEmail($email: String){
                    requestCodeEmail(where: {email:$email})
                    }
                  `,
              variables: {
                email: form.elements.email.value,
              },
            },
            headers: {
              authorization:  read_cookie('token').replace('jwt','')
            },
          });
        this.props.history.push('/ProveEmail');
    }

    render(){
        window.scroll(0, 0);
        document.querySelector('body').classList.remove('active')
        const photoChange = function(){
            var changeinput = document.querySelector('.photoChange input')
            changeinput.classList.toggle('disblock')
        }
        const { username, usersurname, usermail, tel, numConfirmed, confirmed, isLoaded} = this.state;
        if (!isLoaded) {
          return (
              <div className="catalogWrapper">
                <div className="loader">
                  <img src="/images/logoWhite.png" alt="" />
                </div>
              </div>
          );
        }else{
            return(<>
                <div className="catalogWrapper">
                    <div className="catalogSides">
                        <SettingsFilt role={this.state.role} />
                        <div className="catologContent">
                            <div className="infoAmus settings">
                                <h3>Настройка пользователя</h3>
                                <form className="settingsForm">
                                    <div className="avatar">
                                        <img src={user} alt="" />
                                    </div>
                                    <div className="formcontent">
                                        <div className="photoChange">
                                            <p onClick={photoChange}>Изменить фото</p>
                                            <input type="file"name="avatar" accept="image/jpeg,image/png" />
                                        </div>
                                        <div className="labels">
                                            <label>
                                                <p>Имя</p>
                                                <input name="name" defaultValue={username} required />
                                            </label>
                                            <label>
                                                <p>Фамилия</p>
                                                <input name="surname" defaultValue={usersurname} required />
                                            </label>
                                            {/* <label>
                                                <p>Пароль</p>
                                                <input type="password" name="password" required defaultValue="*************"/>
                                                <a href="/ForgotPass" className="changePass">Изменить пароль</a>
                                            </label> */}
                                        </div>
                                        <button type="submit">Сохранить</button>
                                    </div>
                                </form>
                                <form onSubmit={this.addEmail} className="settingsForm">
                                    <div className="avatar">
                                    </div>
                                    <div className="formcontent">
                                        <div className="labels">
                                            <label>
                                                <p>E-mail</p>
                                                <div>
                                                    <input type="email" defaultValue={usermail} name="email" required />
                                                    <button type="submit">Сохранить</button>
                                                </div>
                                                {usermail !== null && !confirmed
                                                ?<a href="/ProveEmail">Подтвердить</a>
                                                :''
                                                }
                                                {confirmed
                                                ?<a href="/Settings">Подтвержден</a>
                                                :''
                                                }
                                            </label>
                                        </div>
                                    </div>
                                </form>
                                <form onSubmit={this.addTel} className="settingsForm">
                                    <div className="avatar">
                                    </div>
                                    <div className="formcontent">
                                        <div className="labels">
                                            <label>
                                                <p>Номер телефона</p>
                                                <div>
                                                    <input pattern="[+][7][0-9]{10}" type="tel" defaultValue={tel}  placeholder="+79142889727" required name="tel"/>
                                                    <button type="submit">Сохранить</button>
                                                </div>
                                                {this.state.tel !== null && !numConfirmed
                                                ?<a href="/ProvePhone">Подтвердить</a>
                                                :''
                                                }
                                                {numConfirmed
                                                ?<a href="/Settings">Подтвержден</a>
                                                :''
                                                }
                                            </label>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer/>
                </>
            )
        }
    }
}
