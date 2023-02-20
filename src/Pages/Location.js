import React, { Component } from 'react'
import Footer from '../Components/Footer'
import SettingsFilt from '../Components/SettingsFilt'
import { read_cookie } from 'sfcookies';

const API_KEY = '236db37be77c48866fdcd7e5e1f88d19';

export default class Location extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
          temp: undefined,
          city: undefined,
          wind:  undefined,
          pressure: undefined,
          error: undefined,
          role:''
        };
      }
    async componentDidMount() {
        if(read_cookie('token').length !== 0){
            await this.setState({
                role: read_cookie('role')
            });
        }else{
            this.props.history.push(`/Login/?next=${window.location.pathname}`);
        }
    }
    gettingWeather = async (e) => {
      e.preventDefault();
      const city = e.target.elements.city.value;
      const api_url = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
      const data = await api_url.json();
    //   console.log(data);
      this.setState({
        temp: data.main.temp,
        city: data.name,
        wind: data.wind.speed,
        pressure: data.main.pressure,
        error: ""
      });
    }
    render(){
        window.scroll(0, 0);
        document.querySelector('body').classList.remove('active')
        return(<>
            <div className="catalogWrapper">
                <div className="catalogSides">
                    <SettingsFilt role={this.state.role}/>
                    <div className="catologContent">
                        <div className="infoAmus settings">
                            <h3>Местоположение</h3>
                            <form onSubmit={this.gettingWeather} className="settingsForm">
                                <div className="formcontent">
                                    <div className="labels">
                                        <label>
                                            <p>Населенный пункт</p>
                                            <select name="city" required>
                                                <option value="Namtsy">Намцы</option>
                                                <option value="Yakutsk">Якутск</option>
                                                <option value="Mirniy">Мирный</option>
                                                <option value="Neryungri">Нерюнгри</option>
                                                <option value="Aldan">Алдан</option>
                                                <option value="Oymyakon">Оймякон</option>
                                                <option value="Olekminsk">Олекминск</option>
                                                <option value="Nyurba">Нюрба</option>
                                            </select>
                                        </label>
                                    </div>
                                    <button className="left" type="submit">Сохранить изменения</button>
                                    { this.state.city !== undefined
                                    ?<div style={{marginTop:30}}>
                                        <h1>Город: {this.state.city} </h1>
                                        <p> Температура: {this.state.temp} </p>
                                        <p> Давление: {Math.round(this.state.pressure/1.333)} </p>
                                        <p> Ветер: {this.state.wind} </p>
                                    </div>
                                    :''}
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