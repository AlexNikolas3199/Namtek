import React, { Component } from 'react'
import arrpow from '../img/arrow.png'
export default class FilterParameter extends Component{
    render(){
        return(
            <li>
            <input type="checkbox" defaultChecked id={this.props.id} className="toggleSubMenu"/>
            <div>{this.props.name} <img src={arrpow} alt="" /></div>
            <label className="toggleSubMenu" htmlFor={this.props.id}></label>
            <ul>
                {this.props.parameters.map(item=>(
                <li key={item.value}>
                <label>
                    <input name={item.name} value={item.value} type="radio"/>
                    <p>{item.title}</p>
                </label>
            </li>
                ))}
            </ul>
        </li>
        )
    }
}