import React, {Component} from 'react'
import InfoAmusItem from './InfoAmusItem'
import InfoAmusItem1 from './InfoAmusItem1'
export default class InfoAmusTypedItems extends Component {
    render() {
        return(
            <div className="infoAmus_typed_items">
                <h4><a href={`/Catalog/${this.props.title}/${this.props.type}`}>{this.props.type}</a></h4>
                <div className="infoAmus_items">
                    {this.props.infoData.map(item => (
                        this.props.title ==='Магазины' || this.props.title ==='Туризм' ?
                        <InfoAmusItem
                        key={item.title}
                        link={`/Catalog/${this.props.title}/${this.props.type}/${item.title}`} 
                        title={item.title} 
                        image={item.img} 
                        firstText={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sed quis cursus suspendisse viverra fames id. Ac males uada nibh in tempus molestie."}
                        /> :
                        <InfoAmusItem1 
                        key={item.title} 
                        workinfo={item.workinfo} 
                        title={item.title} 
                        image={item.img}
                        number={item.number}
                        />
                    ))}
                </div>
                <div className="linkCenter">
                    <a href={`/Catalog/${this.props.title}/${this.props.type}`}>Еще</a>
                </div>
            </div>
        )
        
    }
}