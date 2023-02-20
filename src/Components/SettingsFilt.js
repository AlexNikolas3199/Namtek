import React, { Component } from 'react'
import { NavLink } from 'react-router-dom';
import { delete_cookie } from 'sfcookies'
export default class SettingsFilt extends Component {
    render(){
        const linkTriger = () =>{
            let arr = document.querySelectorAll('.parameters a')
            for(let item of arr){
                item.addEventListener('click', function(){
                    document.querySelector('.darkness').classList.remove('active')
                })
            }
        }
        var popupfilter = function(){
            const darkness = document.querySelector('.darkness')
            const filter = document.querySelector('.filter')
            const body = document.querySelector('body')
            const filtercloser = document.querySelector('.filtercloser')
            const arr = [darkness,filter,filtercloser,body]
            linkTriger()
            for(let item of arr){item.classList.toggle('active')}
            darkness.addEventListener('click',function(){
                for(let item of arr){item.classList.remove('active')}
            })
        }
        var exitAcc = () => {
            localStorage.removeItem("token")
            delete_cookie('token')
            delete_cookie('role')
            delete_cookie('name')
            delete_cookie('userId')
        }
        return(
            <div className="filterbox settings">
                <div className="mobbtnform" onClick={popupfilter}>Все настройки</div>
                <div className="filtercloser" onClick={popupfilter}></div>
                <div className="filter">
                    <div className="filterSide">
                       <div className="headingsetting">
                        <h3>Все настройки</h3>
                       </div> 
                        <ul className="parameters">
                            <li><div><NavLink activeStyle={{color:'#EE6812'}} to="/Settings">Настройка пользователя</NavLink></div></li>
                            {/* <li><div><NavLink activeStyle={{color:'#EE6812'}} to="/Location">Местоположение</NavLink></div></li> */}
                            <li><div><NavLink activeStyle={{color:'#EE6812'}} to="/AdsPost">Мои объявления</NavLink></div></li>
                            {this.props.role === 'admin'
                            ?<>
                            <li><div><NavLink activeStyle={{color:'#EE6812'}} to="/AdminControlShops">Контроль магазинов</NavLink></div></li>
                            <li><div><NavLink activeStyle={{color:'#EE6812'}} to="/AdminNews">Управление новостями</NavLink></div></li>
                            <li><div><NavLink activeStyle={{color:'#EE6812'}} to="/AdminAnnouncement">Управление анонсами</NavLink></div></li>
                            <li><div><NavLink activeStyle={{color:'#EE6812'}} to="/AdminServices">Развлечения, услуги...</NavLink></div></li>
                            <li><div><NavLink activeStyle={{color:'#EE6812'}} to="/AdminTurism">Управление туризмом</NavLink></div></li>
                            <li><div><NavLink activeStyle={{color:'#EE6812'}} to="/KinoControl">Управление афишей</NavLink></div></li>
                            <li><div><NavLink activeStyle={{color:'#EE6812'}} to="/AdminRoles">Управление ролями</NavLink></div></li>
                            </>
                            : ''}
                            {this.props.role === 'trader'
                            ?<li><div><NavLink activeStyle={{color:'#EE6812'}} to="/TraderShops">Управление магазином</NavLink></div></li>
                            : ''}
                            {this.props.role === 'editorNews'
                            ?<><li><div><NavLink activeStyle={{color:'#EE6812'}} to="/AdminNews">Управление новостями</NavLink></div></li>
                            <li><div><NavLink activeStyle={{color:'#EE6812'}} to="/AdminAnnouncement">Управление Анонсами</NavLink></div></li>
                            </>: ''}
                            {this.props.role === 'kinoman'
                            ?<li><div><NavLink activeStyle={{color:'#EE6812'}} to="/KinoControl">Управление афишей</NavLink></div></li>
                            : ''}
                            {this.props.role === 'cook'
                            ?<li><div><NavLink activeStyle={{color:'#EE6812'}} to="/CookFood">Управление общепитом</NavLink></div></li>
                            : ''}
                            <li><div><a href="/" onClick={exitAcc}>Выйти</a></div></li>
                        </ul>
                    </div>
                </div>
            </div>
            )
    }
}