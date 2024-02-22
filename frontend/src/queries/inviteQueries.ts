import { gql } from "@apollo/client";

export const INVITE = gql`
    mutation Invite($input: InviteInput!) {
        invite(input: $input) {
            joinCode
        }
    }
`;

export const JOIN = gql`
    mutation Join($input: JoinInput!) {
        join(input: $input) {
            success
            errorReason
        }
    }
`;