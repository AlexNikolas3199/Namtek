import React, {Component} from 'react'
// import current1 from '../img/current1.png'
// import current2 from '../img/current2.png'
// import current3 from '../img/current3.png'
const API_KEY = '236db37be77c48866fdcd7e5e1f88d19';
export default class TableTemp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cities: ['Namtsy','Yakutsk','Mirniy','Neryungri','Aldan','Oymyakon','Olyokminsk','Nyurba'],
            citiesrus: ['Намцы','Якутск','Мирный','Нерюнгри','Алдан','Оймякон','Олекминск','Нюрба'],
            names: [],
            temp: []
        };
    }
    
    componentDidMount() {
        for(let item of this.state.cities){
            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${item}&appid=${API_KEY}&units=metric`)
            .then(res => res.json())
            .then(
                (res) => {
                    this.setState({
                        names: [...this.state.names, res.name],
                        temp: [...this.state.temp, res.main.temp]
                    });
                }
            )
        }
    }
    render() {
        var openTemp = function(){
            document.querySelector('.TableTemp').classList.toggle('active')
        }
        const { names, cities, citiesrus, temp } = this.state;
        const getTemp = () => {
            let content = [];
            let index;
            for (let i=0; i < names.length ;i++) {
                for (let j=0; j < names.length ;j++) {
                    if(cities[i] === names[j]){index = j}
                }
                content.push(<div key={citiesrus[i]}>{citiesrus[i]} <span>{Math.round(temp[index])}ºC</span></div>);
            }
            return content;
        };
        return(
            <div className="TableTemp"onClick={openTemp}>
                <div className="tempreture">
                    {getTemp()}
                </div>
                {/* <div className="currencies">
                    <div className="current">
                        <img src={current1} alt=""/>
                        73,86 ₽
                    </div>
                    <div className="current">
                        <img src={current2} alt=""/>
                        80,31 ₽
                    </div>
                    <div className="current">
                        <img src={current3} alt=""/>
                        1,44 ₽
                    </div>
                </div> */}
            </div>
        )
    }
}