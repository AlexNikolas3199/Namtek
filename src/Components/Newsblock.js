import React, {Component} from 'react'
import NewItem from '../Components/NewItem'
export default class Newsblock extends Component {
    render() {
        var newsarr=[];
        for(let item of this.props.news){
            if(item.title !== this.props.newsitem.title){
                newsarr.push(item)
            }
        }
        return(
            <div className="newsblock">
               <h3> <a href="/News">Новости</a></h3>
                <div className="newItems">
                    {newsarr.map(item => (
                            <NewItem 
                            key={item._id} 
                            img={item.photo}
                            link={`/news/${item._id}`}
                            date={item.date}
                            viewed={item.viewed}
                            text={item.title}
                            />
                    ))}
                </div>
            </div>
        )
    }
}