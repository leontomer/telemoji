import React from "react";
import { mount } from "enzyme";
import { DataHooks } from "./dataHooks";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { storeFactory } from "./testUtils";

export default abstract class ComponentDriver {
  protected wrapper;
  constructor({ Component, componentProps = {}, initialState = {} }) {
    const store = storeFactory(initialState);
    this.wrapper = mount(
      //@ts-ignore
      <Provider store={store}>
        <Router>
          <Component {...componentProps} />
        </Router>
      </Provider>
    );
  }
  protected findByDataHook(dataHook: DataHooks) {
    return this.wrapper.find(`[data-hook="${dataHook}"]`);
  }
}
