import React, { Component } from 'react'
// import comment1 from '../img/comment1.png'
// import comment2 from '../img/comment2.png'
// import comment3 from '../img/comment3.png'
// import comment4 from '../img/comment4.png'
import { read_cookie, bake_cookie } from 'sfcookies';
export default class ProductItem2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
          inBasket: false
        };
    }
    componentDidMount() {
      if (read_cookie("product").length !== 0) {
        let products = read_cookie("product").split(",");
        products.splice(-1, 1);
        bake_cookie("basketCount", `${products.length - 1}`);
        // console.log(products);
        for (let product of products) {
          if (product === this.props.product._id) {
            this.setState({
              inBasket: true,
            });
          }
        }
      }
    }
    render(){
        var changePhoto = (e) => {
            let showPhoto = document.querySelector('.showPhoto img')
            showPhoto.src = e.target.src
        }
        const toanswer = () => {
            let combtns = document.querySelectorAll('.comment button')
            for(let combtn of combtns){
                combtn.addEventListener('click', () => {
                    var textarea = document.querySelector('textarea')
                    textarea.value = combtn.dataset.username+', '
                    textarea.focus()
                })
            }
        }
    //     const newComment = (e) =>{
    //         e.preventDefault();
    //         if(read_cookie('token').length !== 0){
    //             var commentarium = document.querySelector('.commentarium')
    //             var textarea = e.target.querySelector('textarea')
    //             let comment = document.createElement('div');
    //             comment.classList.add('comment');
    //             commentarium.prepend(comment);
    //             let user = document.createElement('img');
    //             user.classList.add('avatar');
    //             user.src = comment4;
    //             comment.appendChild(user);
    //             var div = document.createElement('div');
    //             comment.appendChild(div);
    //             var nick = document.createElement('div');
    //             nick.textContent = read_cookie('name');
    //             nick.classList.add('nick');
    //             div.appendChild(nick);
    //             var comment_date = document.createElement('div');
    //             comment_date.textContent = 'Сегодня, ' + new Date().getHours()+ ':' + new Date().getMinutes();
    //             comment_date.classList.add('comment_date');
    //             div.appendChild(comment_date);
    //             var letter = document.createElement('div');
    //             letter.textContent = textarea.value;
    //             letter.classList.add('letter');
    //             div.appendChild(letter);
    //             textarea.value = ''
    //     } else{
    //         alert('Только зарегестрированные пользователи могут оставлять отзывы.')
    //     }
    // }
        var tobuy = () => {
            var actualProducts = read_cookie("product");
            if (actualProducts.length !== 0) {
              actualProducts += this.props.product._id + ",";
            }else{
              actualProducts = this.props.shopId +"," + this.props.product._id + ",";
            }
            if(this.props.shopId===actualProducts.split(",")[0]){
              bake_cookie("product", `${actualProducts}`);
              bake_cookie("basketCount", `${read_cookie("product").split(",").length - 2}`);
              this.setState({
                inBasket: true,
              });
              this.props.newBasket()
              let actualProdQuan = read_cookie("productCount");
              if (actualProdQuan.length !== 0) {
                bake_cookie("productCount", `${actualProdQuan}1,`);
              } else {
                bake_cookie("productCount", `1,`);
              }
          }else{
              alert('В корзине могут быть товары только одного магазина!')
          }
        }
        return(<>
            <div onLoad={toanswer} className="productContainer">
                <div className="prodSlider">
                    <div className="prodbuttons">
                        {this.props.product.photo.replace(process.env.REACT_APP_IMAGE_URL+'/static/','').replace('/oldback/static/','').split(',').map(item => (
                            <div key={item}><img src={process.env.REACT_APP_IMAGE_URL+'/static/'+item} onClick={changePhoto} alt=""/></div>
                        ))}
                    </div>
                    <div className={`showPhoto`}>
                        <img src={this.props.product.photo.split(',')[0]} alt=""/>
                    </div>
                </div>
                <div className="productinfo">
                    <h2>{this.props.product.title}</h2>
                    <p>{this.props.product.text}</p>
                    <div className="price">{this.props.product.price.replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ')} ₽</div>
                    {this.state.inBasket
                    ?<a href="/checkout_basket" className="tobasket">Просмотр корзины</a>
                    :<button onClick={tobuy} className="tobasket">В корзину</button>
                    }
                </div>
            </div>
            {/* <div className="reviews">
                <h3>Отзывы</h3>
                <form className="commentform"onSubmit={newComment}>
                    <div className="flex_center">
                        <textarea placeholder="Написать отзыв" required></textarea>
                    </div>
                    <button type="submit" className="avatar">
                        Отправить
                    </button>
                </form>
                <div className="commentarium">
                    <div className="comment">
                        <img className="avatar" src={comment1}alt=""/>
                        <div>
                            <div className="nick">Николай Михайлов</div>
                            <div className="comment_date">Сегодня, 19:07</div>
                            <div className="letter">
                                Хорошее качество.
                            </div>
                            <button data-username="Николай Михайлов">Ответить</button>
                        </div>
                    </div>
                    <div className="comment">
                        <img className="avatar" src={comment2}alt=""/>
                        <div>
                            <div className="nick">Александр Алексеев</div>
                            <div className="comment_date">Сегодня, 18:07</div>
                            <div className="letter">
                                Я бы взял еще.
                            </div>
                            <button data-username="Александр Алексеев">Ответить</button>
                        </div>
                    </div>
                    <div className="comment">
                        <img className="avatar" src={comment3}alt=""/>
                        <div>
                            <div className="nick">Ульяна Иннокентьева</div>
                            <div className="comment_date">Сегодня, 17:07</div>
                            <div className="letter">
                                Правда, неплохое приобретение!
                            </div>
                            <button data-username="Ульяна Иннокентьева">Ответить</button>
                        </div>
                    </div>
                </div>
            </div> */}
            </>
        )
    }
}
