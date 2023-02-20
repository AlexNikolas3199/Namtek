import React, { Component } from 'react'
import lupa1 from '../img/lupa1.png'
export default class CatalogSearch extends Component{
    render(){
        return(
            <div className="catalogSearchbox">
            <form>
                <button className="searchbtn" type="submit">
                    <img src={lupa1} alt="" />
                </button>
                <input placeholder="Поиск" defaultValue={this.props.find} name="find" type="search" required />
            </form>
        </div>
        )
    }
}