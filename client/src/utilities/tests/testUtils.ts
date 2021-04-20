import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../../reducers'
import thunk from "redux-thunk";

export const storeFactory = (initialState) => {
    //@ts-ignore
    return createStore(rootReducer, initialState, applyMiddleware(thunk));
}
export const findByDataHook = (wrapper, val) => {
    return wrapper.find(`[data-hook="${val}"]`);
}

export function htmlText(innerHTML: string) {
    const e = document.createElement('div');
    e.innerHTML = innerHTML;
    const childNodes = Array.from(e.childNodes);
  
    return childNodes
      .map(childNode => childNode.textContent)
      .join('')
      .replace(/\s/g, ' ');
  }
  

