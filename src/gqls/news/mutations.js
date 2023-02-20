import gql from 'graphql-tag'

export const GET_AUTH = gql`
    mutation ($password:String!,$login:String!){
        auth(password: $password, login: $login)
    }
`
export const ADD_COMMENT = gql`
    mutation ($where: NewsWhereInput!,$data: CommentInput!){
        addComment(where: $where, data: $data){
            _id
            title
            text
            comments{
                date
                userName
                text
            }
        }
    }
`
export const DELETE_NEWS = gql`
    mutation ($where:NewsWhereInput!){
        deleteNews(where: $where){
            _id
            title
        }
    }
`
export const UPDATE_NEWS = gql`
    mutation ($where:NewsWhereInput!,$data:NewsEditInput!){
        updateNews(where: $where, data: $data){
            _id
            title
            isMain
        }
    }
`