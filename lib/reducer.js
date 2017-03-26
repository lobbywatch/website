import {combineReducers} from 'redux'

const getReducer = (client) => {
  return combineReducers({
    apollo: client.reducer()
  })
}

export default getReducer
