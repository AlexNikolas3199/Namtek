import React, {Component} from 'react'
import Footer from '../Components/Footer'
import LeftColumn from '../Components/LeftColumn'
import RightColumn from '../Components/RightColumn'
import AdvertCard from '../Components/AdvertCard'
import NewItem from '../Components/NewItem'
import Announces from '../Components/Announces'
// import swan from '../img/nammap.png'
import meetfamily from '../img/meetfamily.png'
import axios from "axios";
export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
          news: undefined,
          anons: undefined,
          ads: undefined,
          services: undefined,
          shops: undefined,
          isLoaded: false,
        };
      }
    componentDidMount() {
      let page = 1
      axios({
       url: process.env.REACT_APP_SERV_URL,
       method: "post",
       data: {
         query: `
           query getNews($page:Int!){
             getNews(where: {page: $page}){
                 _id
                 title
                 text
                 photo
                 date
                 viewed
               }
             }
               `,
               variables: {
                 page
               },
       },
     }).then((result) => {
         if(result.data.data.getNews){
             this.setState({
               news: result.data.data.getNews.slice(0,5),
             });
            //  console.log(this.state.news);
         }
     },
     (error) => {
       alert(error);
     });
     axios({
      url: process.env.REACT_APP_SERV_URL,
      method: "post",
      data: {
        query: `
          query getAnnouncements{
            getAnnouncements{
                _id
                title
                text
                photo
                startDate
                time
              }
            }
              `
      },
    }).then((result) => {
        if(result.data.data.getAnnouncements){
            this.setState({
              anons: result.data.data.getAnnouncements.slice(0,3)
            });
            // console.log(this.state.anons);
        }
    },
    (error) => {
      alert(error);
    });
    axios({
      url: process.env.REACT_APP_SERV_URL,
      method: "post",
      data: {
        query: `
          query getAds($page:Int!, $category: String){
            getAds(where: {page: $page, category: $category}){
                _id
                title
                price
                description
                expired
                logo
                type
              }
            }
              `,
        variables: {
          page: 1,
          category: '',
        },
      },
    }).then((result) => {
      if (result.data.data.getAds) {
        this.setState({
          ads: result.data.data.getAds.slice(0,6)
        });
      }
      // console.log(result.data.data);
    });
    axios({
      url: process.env.REACT_APP_SERV_URL,
      method: "post",
      data: {
        query: `
              query getOther($page:Int!, $type: String!){
                getOther(where: {page: $page, type: $type}){
                    _id
                    title
                    address
                    description
                    logo
                    number
                    workTime
                  }
                }
                  `,
        variables: {
          page: 1,
          type: "Services",
        },
      },
    }).then((result) => {
      if (result.data.data.getOther) {
        this.setState({
          services: result.data.data.getOther.slice(0, 2)
        });
      }
      // console.log(result.data.data);
    });
    axios({
      url: process.env.REACT_APP_SERV_URL,
      method: "post",
      data: {
        query: `
              query getShops{
                getShops{
                  _id
                  name
                  description
                  logo
                  block
                  }
                }
                  `
      },
    }).then((result) => {
      if (result.data.data.getShops) {
        this.setState({
          shops: result.data.data.getShops.slice(0, 2),
          isLoaded: true
        });
      }
      // console.log(result.data.data);
    });
    }
    render() {
      const {isLoaded, anons, news, ads, services, shops} = this.state
        if (!isLoaded || news === undefined || anons === undefined || ads === undefined || services === undefined || shops === undefined) {
          return (
              <div className="catalogWrapper">
                <div className="loader">
                  <img src="/images/logoWhite.png" alt="" />
                </div>
              </div>
          );
        } else {
        return(<>
            <div className="HomeMain">
                <div className="meetingbox">
                    <div className="hotLine">
                        <p>#сидимдома</p>
                        <span></span>
                    </div>
                    <div className="sitHome">Горячая линия:  <span>112</span></div>
                    <span>
                        <h1>#сидимдома</h1>
                        <p>Уважаемые жители республики Саха, соблюдайте ограничения,
                        оставайтесь дома. Давайте не допустим распространения инфекции!</p>
                    </span>
                    <img src={meetfamily}alt="" />
                </div>
                <div className="gridnews home">
                    <div className="mainNews">
                        <h3><a href="/News" >Новости</a></h3>
                        {news.map(item => (
                            <NewItem
                              key={item._id}
                              id={item._id}
                              text={item.title}
                              date={Number(item.date)}
                              liltext={item.text.slice(0,100)+'...'}
                              viewed={item.viewed}
                              link={`/News/${item._id}`}
                              img={item.photo}
                            />
                        ))}
                    </div>
                    <div className="announces">
                      <Announces anons={anons}  />
                    </div>
                </div>
                <div className="mainWrapper">
                    <LeftColumn services={services} shops={shops} />
                    <RightColumn/>
                </div>
                {/* <article className="swanArticle">
                    <span>
                        <p>Lorem ipsum dolor sit amet, consectetur
                        adipiscing elit. Ullamcorper mi neque
                        pulvinar aliquam metus. Ac sagittis
                        consectetur pulvinar ac. Eget ut massa
                        nulla amet faucibus.</p>
                        <div>Lorem ipsum dolor sit amet, consectetur
                        adipiscing elit. Euismod eros proin nulla
                        netus eget iaculis. Vel etiam nunc urna amet,
                        erat. Tristique integer non sodales at augue
                        adipiscing. Odio eros, senectus nam
                        fringilla aliquam sem ornare sit. Tellus
                        curabitur id tristique faucibus
                        elementum arcu libero.</div>
                    </span>
                    <img src={swan} alt="" />
                </article> */}
                <div className="advert_container">
                    <h3><a href="/Ads" >Объявления</a></h3>
                    <div className="adverts">
                    {ads.length !== 0
                      ? ads.map((item) => (
                          <AdvertCard
                            key={item._id}
                            id={item._id}
                            price={item.price}
                            text={item.title}
                            img={item.logo}
                            type={item.type}
                          />
                        ))
                      : "Объявлений нет :("}
                    </div>
                </div>
            </div>
            <Footer/>
            </>
        )
    }}
}
