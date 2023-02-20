import React, { useState, useEffect } from "react";
import Footer from "../Components/Footer";
const Photos = () => {
  const [photos, setPhotos] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [photosScroll, setPhotosScroll] = useState([]);
  useEffect(() => {
    fetch("https://www.instagram.com/cit.nam/?__a=1")
      .then((response) => response.json())
      .then(
        (data) => {
          // console.log(data.graphql.user.edge_owner_to_timeline_media.edges);
          setPhotos(data.graphql.user.edge_owner_to_timeline_media.edges);
          setIsLoaded(true);
        },
        (error) => {
          console.log(error);
        }
      );
  }, []);
  var global1 = 0;
  const photoTriger = (item) => {
    if (item.is_video) {
      setIsLoaded(false);
      fetch(`https://www.instagram.com/p/${item.shortcode}/?__a=1`)
        .then((response) => response.json())
        .then(
          (data) => {
            setIsLoaded(true);
            let video = document.querySelector("video.big");
            video.src = data.graphql.shortcode_media.video_url;
            video.classList.toggle("disnone");
            document.querySelector("img.big").classList.toggle("disnone");
            document.querySelector(".darkback").classList.remove("disnone");
            document.querySelector("body").classList.add("active");
            document.querySelector(".filtercloser").classList.add("active");
            document.querySelector(".details .text p").innerHTML =
              data.graphql.shortcode_media.edge_media_to_caption.edges[0].node.text;
          },
          (error) => {
            console.log(error);
          }
        );
    } else {
      let photo = document.querySelector(".details img.big");
      let text = document.querySelector(".details .text p");
      photo.src = item.display_url;
      if (item.edge_media_to_caption.edges.length !== 0) {
        text.innerHTML = item.edge_media_to_caption.edges[0].node.text;
      }
      document.querySelector(".darkback").classList.remove("disnone");
      document.querySelector("body").classList.add("active");
      document.querySelector(".filtercloser").classList.add("active");
      if (item.edge_sidecar_to_children) {
        global1 = 0;
        setPhotosScroll(item.edge_sidecar_to_children.edges);
        document.querySelector(".arrow_1").classList.remove("disnone");
        document.querySelector(".arrow_1").style.opacity = 0.7
        document.querySelector(".arrow_2").classList.remove("disnone");
      }
    }
  };
  const clearPhoto = () => {
    document.querySelector(".darkback").classList.add("disnone");
    document.querySelector(".arrow_1").classList.add("disnone");
    document.querySelector(".arrow_2").classList.add("disnone");
    document.querySelector("body").classList.remove("active");
    document.querySelector("img.big").classList.remove("disnone");
    document.querySelector("video.big").src = "";
    if (!document.querySelector("video.big").classList.contains("disnone")) {
      document.querySelector("video.big").classList.add("disnone");
    }
  };
  async function arrow2(e) {
    if (global1 < photosScroll.length - 1) {
      global1++;
      document.querySelector(".details img.big").src =
      photosScroll[global1].node.display_url;
      document.querySelector(".arrow_1").style.opacity = 1
      if (global1 === photosScroll.length -1 ) {e.target.style.opacity = 0.7}
    }
  }
  async function arrow1(e) {
    if (global1 !== 0) {
      global1--;
      document.querySelector(".details img.big").src =
        photosScroll[global1].node.display_url;
        document.querySelector(".arrow_2").style.opacity = 1
        if (global1 === 0) {e.target.style.opacity = 0.7}
    }else{
      e.target.style.opacity = 0.7
    }
  }
  if (!isLoaded) {
    return (
      <div className="catalogWrapper">
        <div className="loader">
          <img src="/images/logoWhite.png" alt="" />
        </div>
      </div>
    );
  } else {
    return (
      <>
        <div className="catalogWrapper">
          <h3 className="photoHeading">Фото/Видео</h3>
          <div className="photos">
            {photos.map((item) => (
              <img
                key={item.node.id}
                onClick={() => {
                  photoTriger(item.node);
                }}
                src={item.node.thumbnail_resources[2].src}
                alt=""
              />
            ))}
          </div>
          <div className="darkback disnone">
            <div className="wrapper">
              <div className="details">
                <div className="photowrapper">
                  <img className="big" src="" alt="" />
                  <video
                    autoPlay={true}
                    controls={true}
                    loop={true}
                    className="big disnone"
                    src=""
                    type="video/mp4"
                  ></video>
                  <img
                    onClick={arrow1}
                    className="arrow_1 disnone"
                    src="/images/arrowback.png"
                    alt=""
                  />
                  <img
                    onClick={arrow2}
                    className="arrow_2 disnone"
                    src="/images/arrowback.png"
                    alt=""
                  />
                </div>
                <div className="text">
                  <p></p>
                </div>
              </div>
              <div onClick={clearPhoto} className="filtercloser photo"></div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }
};
export default Photos;
