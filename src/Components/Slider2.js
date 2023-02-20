import React, {Component} from 'react'
import Slider from "react-slick";


export default class Slider2 extends Component {
    constructor(props) {
        super(props);
        this.state = {settings: {
            dots: true,
            infinite: true,
            speed: 700,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            autoplay: true,
            autoplaySpeed: 3000,
          }};
      }
    render() {
        return(
            <div className="slider2">
                <Slider className="SliderSlick" {...this.state.settings}>
                    <div className="SliderItem">
                        <a href="/Каталог/Кафе,рестораны/Доставка">
                            <img src='/images/adv1.png' alt=""/>
                        </a>
                    </div>
                    <div className="SliderItem">
                        <a href="/Каталог/Кафе,рестораны/Доставка">
                            <img src='/images/adv1.png' alt=""/>
                        </a>
                    </div>
                    <div className="SliderItem">
                        <a href="/Каталог/Кафе,рестораны/Доставка">
                            <img src='/images/adv1.png' alt=""/>
                        </a>
                    </div>
                    <div className="SliderItem">
                        <a href="/Каталог/Кафе,рестораны/Доставка">
                            <img src='/images/adv1.png' alt=""/>
                        </a>
                    </div>
                    <div className="SliderItem">
                        <a href="/Каталог/Кафе,рестораны/Доставка">
                            <img src='/images/adv1.png' alt=""/>
                        </a>
                    </div>
                </Slider>
            </div>
        )
    }
}