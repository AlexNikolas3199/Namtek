import React, { useState, useEffect } from "react";
import Footer from "../Components/Footer";
import Axios from "axios";
import { read_cookie } from "sfcookies";
const Turism = (props) => {
  const [tourbase, setTourbase] = useState([]);
  const [tourbaseText, setTourbaseText] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [updateB, setUpdateB] = useState(false);
  useEffect(() => {
    Axios({
      url: process.env.REACT_APP_SERV_URL,
      method: "post",
      data: {
        query: `
              query getTourism($id: String){
                getTourism(where:{_id: $id}){
                    title
                    text
                    map
                    photo
                  }
                }
                  `,
        variables: {
          id: props.match.params.id,
        },
      },
    }).then((result) => {
      if (result.data.data.getTourism) {
        setTourbase(result.data.data.getTourism[0]);
        let text = [];
        for (let item of result.data.data.getTourism[0].text.split(/(\n)/)) {
          if (item.length > 1) {
            text.push(item);
          }
        }
        setTourbaseText(text);
        setIsLoaded(true);
        let frag = document
          .createRange()
          .createContextualFragment(result.data.data.getTourism[0].map);
        document.querySelector(".tourismMap").appendChild(frag);
      }
      // console.log(result.data.data);
    });
  }, [props]);
  if (!isLoaded) {
    return (
      <div className="catalogWrapper">
        <div className="loader">
          <img src="/images/logoWhite.png" alt="" />
        </div>
      </div>
    );
  } else {
    const delete1 = (e) => {
      e.preventDefault();
      var answer = window.confirm("Удалить турбазу?");
      if (answer) {
        Axios({
          url: process.env.REACT_APP_SERV_URL,
          method: "post",
          data: {
            query: `
                    mutation deleteTourism($id: String){
                    deleteTourism(where: {_id: $id})
                    }
                    `,
            variables: {
              id: props.match.params.id,
            },
          },
          headers: {
            authorization: read_cookie("token").replace("jwt", ""),
          },
        }).then((result) => {
          // console.log(result.data);
          if (result.data.data.deleteTourism) {
            alert("Турбаза удалена.");
            props.history.push("/Tourism");
          } else {
            alert("Турбаза не найдена.");
          }
        });
      }
    };
    const update1 = (e) => {
      let parent = e.target.parentNode.parentNode
      parent.querySelector('.tourismText div').style.display = 'none'
      setUpdateB(true)
      let h2 = document.querySelector('.tourismContainer h3 span')
      h2.contentEditable = true
      h2.focus()
      setTimeout(()=>{
        let ta = parent.querySelector('textarea.update')
        ta.style.height = ta.scrollHeight+"px"
      },1)
      e.target.addEventListener('click',()=>{window.location.reload()})
    }
    const update2 = (e) => {
      e.preventDefault();
      let form = e.target
      var answer = window.confirm("Обновить турбабзу?");
      if (answer) {
        console.log(props.match.params.id)
        Axios({
          url: process.env.REACT_APP_SERV_URL,
          method: "post",
          data: {
            query: `
                      mutation updateTourism($id: String, $text: String, $title: String){
                      updateTourism(where: {_id: $id}, data: {text: $text, title: $title})
                      }
                      `,
            variables: {
              id: props.match.params.id,
              title: document.querySelector('.tourismContainer h3 span').innerHTML,
              text: form.elements.text.value,
            },
          },
          headers: {
            authorization: read_cookie("token").replace("jwt", ""),
          },
        }).then((result) => {
          // console.log(result.data);
          if (result.data.data.updateTourism) {
            alert("Турбаза обновлена.");
            window.location.reload()
          } else {
            alert("Турбаза не найдена.");
          }
        });
      }
    };
    let adjustHeight = (el) =>{
      let ta = el.target
      ta.style.height = (ta.scrollHeight > ta.clientHeight) ? (ta.scrollHeight)+"px" : (ta.scrollHeight)+"px";
    }
    return (
      <>
        <div className="catalogWrapper tourism">
          <div className="tourismContainer">
            <h3>
              <a href="/Tourism" style={{ color: "#E24E1F" }}>
                Туризм
              </a>{" "}
              / <span>{tourbase.title}</span>
            </h3>
            <div className="tourismInline">
              <div className="headingImg">
                {read_cookie("role") === "admin" ? (
                 <>
                 <div className="delete" onClick={delete1}>
                   <img src="/images/trash.png" alt="" />
                 </div>
                 <div style={{top: 40}} className="delete" onClick={update1}>
                   <img src="/images/reload.png" alt="" />
                 </div>
               </>
                ) : (
                  ""
                )}
                <img src={tourbase.photo} alt="" />
              </div>
              <div className="tourismTextWrapper">
                <div className="tourismText">
                  <div>
                  {tourbaseText.map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                  </div>
                  {updateB
                  ?<form className="update" onSubmit={update2}>
                    <textarea className="update" name="text" defaultValue={tourbase.text} onKeyUp={adjustHeight}></textarea>
                    <button type="submit" className="avatar">Сохранить</button>
                  </form>
                  :''}
                </div>
              </div>
            </div>
            <div className="tourismMap"></div>
          </div>
        </div>
        <Footer />
      </>
    );
  }
};
export default Turism;
