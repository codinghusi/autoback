import gql from "graphql-tag";
import { graphqlSummary } from "./graphql-summary";


const query = gql`
    query GetUser($userId: ID!) {
        user(id: $userId) {
            id,
            name,
            isViewerFriend,
            profilePicture(size: 50)  {
            ...PictureFragment
            }
        }
    }

    fragment PictureFragment on Picture {
        uri,
        width,
        height
    }
`;

const result = graphqlSummary(query);

console.log(result);