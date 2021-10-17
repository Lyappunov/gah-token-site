import {
    TOKEN_ADD,
    TOKEN_UPDATE
} from "../actions/types";

const initialState = {
    token: {}
};
export default function(state = initialState, action) {
    switch (action.type) {
        case TOKEN_ADD:
            return {
                token: action.payload
            };
        case TOKEN_UPDATE:
            return {
                token: action.payload,
            };
        
        default:
            return state;
    }
}
