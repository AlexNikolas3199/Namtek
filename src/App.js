import React from 'react'
import './App.css'
import './slick/slick.css'
import './slick/slick-theme.css'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import styled from 'styled-components'
import Home from './Pages/Home'
import News from './Pages/News'
import Ads from './Pages/Ads'
import Settings from './Pages/Settings'
import NotFound from './Pages/NotFound'
import Login from './Pages/Login'
import ForgotPass from './Pages/ForgotPass'
import ForgotPassNew from './Pages/ForgotPassNew'
import Registration from './Pages/Registration'
import ProveEmail from './Pages/ProveEmail'
import ProvePhone from './Pages/ProvePhone'
import Basket from './Pages/Basket'
import AdminNews from './Pages/Admin/AdminNews'
import AdminRoles from './Pages/Admin/AdminRoles'
import Pieceofnews from './Pages/Pieceofnews'
import TraderShops from './Pages/TraderShops'
import TraderShopItem from './Pages/TraderShopItem'
import TraderProductItem from './Pages/TraderProductItem'
import AdminControlShops from './Pages/Admin/AdminControlShops'
import Cinema from './Pages/Cinema'
import Shops from './Pages/Shops'
import Shop from './Pages/Shop'
import ShopProduct from './Pages/ShopProduct'
import apollo from './utils/apollo'
import { ApolloProvider } from '@apollo/react-hooks'
import KinoControl from './Pages/KinoControl'
import AdsPost from './Pages/AdsPost'
import Advert from './Pages/Advert'
import AdminAnnouncement from './Pages/Admin/AdminAnnouncement'
import AdvertPost from './Pages/AdvertPost'
import AdminServices from './Pages/Admin/AdminServices'
import Services from './Pages/Services'
import Photos from './Pages/Photos'
import AdminTurism from './Pages/Admin/AdminTurism'
import Turism from './Pages/Turism'
import Turbases from './Pages/Turbases'
import Header from './Components/Header'
import CookFood from './Pages/CookFood'
import CookFoodItem from './Pages/CookFoodItem'
import CookProductItem from './Pages/CookProductItem'
import Food from './Pages/Food'
import FoodPlace from './Pages/FoodPlace'
import FoodProduct from './Pages/FoodProduct'

const Container = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
`

const App = () => {
    return (
        <ApolloProvider client={apollo}>
            <Router>
                <Switch>
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/registration" component={Registration} />
                    <Route exact path="/forgotPass" component={ForgotPass} />
                    <Route exact path="/changePassword" component={ForgotPassNew} />
                    <Container>
                        <Header />
                        <Route exact path="/" component={Home} />
                        <Route exact path="/news" component={News} />
                        <Route exact path="/news/:newsItem" component={Pieceofnews} />
                        <Route exact path="/shops" component={Shops} />
                        <Route exact path="/shops/:shopId" component={Shop} />
                        <Route exact path="/shops/:shopId/:productId" component={ShopProduct} />
                        <Route exact path="/cinema" component={Cinema} />
                        <Route exact path="/kinoControl" component={KinoControl} />
                        <Route exact path="/checkout_basket" component={Basket} />
                        <Route exact path="/ads" component={Ads} />
                        <Route exact path="/ads/:AdId" component={Advert} />
                        <Route exact path="/adsPost" component={AdsPost} />
                        <Route exact path="/adsPost/:id" component={AdvertPost} />
                        <Route exact path="/amusement/:type" component={Services} />
                        <Route exact path="/settings" component={Settings} />
                        {/* <Route exact path="/Location" render={() => <Location />} /> */}
                        <Route exact path="/proveEmail" component={ProveEmail} />
                        <Route exact path="/provePhone" component={ProvePhone} />
                        <Route exact path="/adminNews" component={AdminNews} />
                        <Route exact path="/adminAnnouncement" component={AdminAnnouncement} />
                        <Route exact path="/adminServices" component={AdminServices} />
                        <Route exact path="/adminTurism" component={AdminTurism} />
                        <Route exact path="/tourism/:id" component={Turism} />
                        <Route exact path="/tourism" component={Turbases} />
                        <Route exact path="/adminRoles" component={AdminRoles} />
                        <Route exact path="/photos-videos" component={Photos} />
                        <Route exact path="/adminControlShops" component={AdminControlShops} />
                        <Route exact path="/traderShops" component={TraderShops} />
                        <Route exact path="/traderShops/:shopId" component={TraderShopItem} />
                        <Route exact path="/traderShops/myShop/:productId" component={TraderProductItem} />
                        <Route exact path="/cookFood" component={CookFood} />
                        <Route exact path="/cookFood/:shopId" component={CookFoodItem} />
                        <Route exact path="/cookFood/myFood/:productId" component={CookProductItem} />
                        <Route exact path="/food" component={Food} />
                        <Route exact path="/food/:shopId" component={FoodPlace} />
                        <Route exact path="/food/:shopId/:productId" component={FoodProduct} />
                    </Container>
                    <Route path="*" component={NotFound} />
                </Switch>
            </Router>
        </ApolloProvider>
    )
}

export default App
