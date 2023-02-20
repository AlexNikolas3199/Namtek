import React, { Component } from 'react'
import FilterParameter from './FilterParameter'
export default class Filter extends Component {
    render(){
        var popupfilter = function(){
            const darkness = document.querySelector('.darkness')
            const filter = document.querySelector('.filter')
            const body = document.querySelector('body')
            const filtercloser = document.querySelector('.filtercloser')
            var arr = [darkness,filter,filtercloser,body]
            for(let item of arr){item.classList.toggle('active')}
            darkness.addEventListener('click',function(){
                for(let item of arr){ item.classList.remove('active')}
            })
        }
        return(
            <div className="filterbox">
                <div className="mobbtnform" onClick={popupfilter}>Фильтр</div>
                <div className="filtercloser" onClick={popupfilter}></div>
                <form className="filter">
                    <div className="filterSide">
                        <h3>Фильтр</h3>
                        <ul className="parameters">
                            <FilterParameter name={this.props.name} id={'1'}
                                parameters={
                                    this.props.parameters
                                }
                            />
                        </ul>
                    </div>
                    <div className="buttons">
                        <button className="add" type="submit">Применить фильтр</button>
                        <button className="add1" type="reset">Отменить</button>
                    </div>
                </form>
            </div>
        )
    }
}