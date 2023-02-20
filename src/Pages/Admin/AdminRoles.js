import React, { Component } from 'react'
import Footer from '../../Components/Footer'
import SettingsFilt from '../../Components/SettingsFilt'
import { read_cookie } from 'sfcookies';
import axios from 'axios'
export default class AdminRoles extends Component {
    constructor(props) {
        super(props);
        this.state = {
          message: undefined,
          role:''
        };
      }
   async componentDidMount() {
        if(read_cookie('token').length !== 0){
            await this.setState({
                    role: read_cookie('role')
                })
            if(this.state.role !== 'admin'){
                this.props.history.push('/');
            }
        }else{
            this.props.history.push(`/Login/?next=${window.location.pathname}`);
        }
    }

    createRole = (e) =>{
        e.preventDefault()
        var form = e.target
        form.querySelector('button').disabled = true
        axios({
            url: process.env.REACT_APP_SERV_URL,
            method: "post",
            data: {
              query: `
                  mutation giveRole($login: String!,$role: String!){
                    giveRole(where: {login: $login, role: $role} ){role}
                    }
                  `,
              variables: {
                login: form.elements.login.value,
                role: form.elements.role.value
              },
            },
            headers: {
              authorization:  read_cookie('token').replace('jwt','')
            },
          }).then((result) => {
            // console.log(result.data);
            if(result.data.data.giveRole){
              this.setState({
                  message: 'Смена роли прошла успешно!'
              })
              form.reset()
              form.querySelector('button').disabled = false
            }else{
              alert('Пользователь не найден.')
              form.querySelector('button').disabled = false
            }
        });
    }
    render(){
        window.scroll(0, 0);
        document.querySelector('body').classList.remove('active')
        return(
            <>
            <div className="catalogWrapper">
                <div className="catalogSides">
                    <SettingsFilt role={this.state.role}/>
                    <div className="catologContent">
                        <div className="infoAmus settings">
                            <h3>Управление ролями</h3>
                            <div className="adminform">
                                <h4>Присвоить роль</h4>
                                <form onSubmit={this.createRole} className="settingsForm">
                                    <div className="formcontent">
                                        <div className="labels">
                                            <label>
                                                <p>Логин пользователя</p>
                                                <input name="login" required />
                                            </label>
                                            <label>
                                                <p>Роль</p>
                                                <select name="role" required>
                                                    <option value="default">Обычный</option>
                                                    <option value="trader">Продавец</option>
                                                    <option value="cook">Владелец общепита</option>
                                                    <option value="kinoman">Редактор Афиши</option>
                                                    <option value="editorNews">Редактор новостей</option>
                                                    <option value="admin">Админ</option>
                                                </select>
                                            </label>
                                        </div>
                                        {this.state.message !== undefined
                                        ? <div className="message">{this.state.message}</div>
                                        : ''}
                                        <button type="submit">Сохранить</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
            </>
        )
    }
}
