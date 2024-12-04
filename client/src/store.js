import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension'


import { authReducer, userReducer, forgotPasswordReducer, allUsersReducer, userDetailsReducer } from './reducers/userReducers'


const reducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    allUsers: allUsersReducer,
    userDetails: userDetailsReducer,
    forgotPassword: forgotPasswordReducer,
})


// let initialState = {
//     auth: {
//         isAuthenticated: localStorage.getItem('isAuthenticated'),
//         user: localStorage.getItem('user')
//     }
// }
let initialState = {
    auth: {
        isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
        user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
    }
}

const middlware = [thunk];
const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middlware)))

export default store;