import React from "react";
import { read_cookie, bake_cookie, delete_cookie } from "sfcookies";
import { useQuery } from "@apollo/react-hooks";
import { DASHBOARD } from "../gqls/user/queries";

const LogIn = () => {
  const { data, loading } = useQuery(DASHBOARD, {
    onCompleted: ({ dashboard }) => {
      if (
        !(
          read_cookie("name").length === 0 ||
          read_cookie("role").length === 0 ||
          read_cookie("userId").length === 0
        )
      )
        return null;
      bake_cookie("role", `${dashboard.role}`);
      bake_cookie("name", `${dashboard.name} ${dashboard.surname}`);
      bake_cookie("userId", `${dashboard._id}`);
    },
    onError: ({ message }) => {
      if (message !== "message GraphQL error: no access") return null;
      delete_cookie("token");
      delete_cookie("role");
      delete_cookie("name");
      delete_cookie("userId");
      localStorage.removeItem("token");
    },
	});
	console.log('render')
  if (loading)
    return (
      <div className="logIn">
        <div>
          <img src="/images/logo.png" alt="" />
        </div>
      </div>
    );
  if (!data)
    return (
      <div className="logIn">
        <a href={`/Login?next=${window.location.pathname}`}>Войти</a>
      </div>
    );
  return (
    <div className="logIn">
      <a href="/Settings">
        {data && data.dashboard.name ? data.dashboard.name : null}
      </a>
    </div>
  );
};
export default LogIn;
