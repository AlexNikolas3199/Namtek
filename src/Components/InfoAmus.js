import React, {Component} from 'react'
import InfoAmusTypedItems from './InfoAmusTypedItems'
export default class InfoAmus extends Component {
    render() {
        return(
            <div className="infoAmus">
                <h3>{this.props.title}</h3>
                {this.props.infoData.map(item => (
                    <InfoAmusTypedItems key={item.type} title={this.props.title} type={item.type} infoData={item.itemShops.slice(0,2)}  />
                ))}
            </div>
        )
    }
}