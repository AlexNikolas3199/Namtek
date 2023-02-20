import React, {Component} from 'react'

export default class InfoAmusItem extends Component {
    render() {
        var catalogType = this.props.catalogType
        var turismImg = function(){
            if(catalogType === "Туризм"){
                return('tourism')
            }else return ''
        }
        return(
            <div className={"infoAmusItem "+ turismImg()}>
                <a href={this.props.link}><img src={this.props.image} alt=""/></a>
                <span>
                    <h5><a href={this.props.link}>{this.props.title}</a></h5>
                    <p>{this.props.firstText}</p>
                    <a href={this.props.link}>Подробнее</a>
                </span>
            </div>
        )
    }
}