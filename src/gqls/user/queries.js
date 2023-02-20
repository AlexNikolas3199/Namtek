import gql from "graphql-tag";

export const DASHBOARD = gql`
  query {
    dashboard{
        _id
        name
        surname
        role
    }
  }
`;