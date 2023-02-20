import React, {Component} from 'react'
// import sun from '../img/sun.png'
export default class RightColumn extends Component {

    render() {
        return(
            <div className="RightColumn">
                <div>
                    {/* <div className="weatherbox">
                        <img src={sun} alt="" />
                        <div className="weatherinfo">
                            <h5>Якутск</h5>
                            <p>Днем</p>
                            <h3>Ясно</h3>
                            <h4>9ºC</h4>
                            <p>Ветер: Восток 3м/с</p>
                            <p>Давление: 751 рт.ст.</p>
                        </div>
                    </div> */}
                    <div className="advbanner">
                    <video src="/images/video3.mp4" autoPlay muted controls alt="" />
                    </div>
                </div>
            </div>
        )
    }
}