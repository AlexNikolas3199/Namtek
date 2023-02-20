import gql from "graphql-tag";

export const GET_NEWS = gql`
  query($page: Int!) {
    getPageCount
    getNews(where: { page: $page }) {
      _id
      title
      text
      photo
      date
      viewed
      comments {
        date
        userName
        text
      }
    }
  }
`;
export const GET_NEWS_POST = gql`
  query($where: NewsWhereInput!) {
    getNewsPost(where: $where) {
      _id
      title
      text
      photo
      date
      viewed
      comments {
        date
        userName
        text
      }
    }
  }
`;
export const GET_NEWS_MAIN = gql`
  query {
    getNewsMain {
      _id
      title
      text
      photo
      date
      viewed
    }
  }
`;
