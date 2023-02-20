import React from "react";
import Footer from "../Components/Footer";
// import { useQuery, useMutation } from "@apollo/react-hooks";
// import { gql } from "apollo-boost";
const NotFound = () => {
  // console.log(localStorage.getItem('token'))
  // const TEST = gql`
  //   query {
  //     hello
  //   }
  // `;
  // // loading error refetch
  // const { data } = useQuery(TEST);
  // console.log(data);
  // const TEST1 = gql`
  // mutation checkoutCart($shopId: String!, $product: [CartProduct!] ) {
  //   checkoutCart(where:{shopId: $shopId, product: $product})
  // }
  // `;

  // const [getMut] = useMutation(TEST1, {
  //   onCompleted: (data) => {
  //     console.log(data);
  //   },
  //   onError: (er) => {console.log(er.message)},
  // });

  return (
    <>
      <div className="catalogWrapper">
        <div className="catalogSides non">
          <h2
            // onClick={() => {
            //   getMut({
            //     variables: {
            //       product: [{productId:"5f1657416d22ca6c8a3b4e9d",count:2},{productId:"5f16561e6d22ca6c8a3b4e90",count:2}],
            //       shopId: "5f16543f6d22ca6c8a3b4e81",
            //     },
            //   });
            // }}
          >
            Ресурс не найден
          </h2>
          <a href="/" className="gohome">
            На главную
          </a>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default NotFound;
