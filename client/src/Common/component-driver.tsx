import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import { DataHook } from "./DataHooks";

export default abstract class ComponentDriver {
  protected wrapper;
  constructor({ Component, componentProps = {} }) {
    configure({ adapter: new Adapter() });
    this.wrapper = shallow(<Component {...componentProps}/>);
  }

  findByDataHook(dataHook: DataHook) {
    return this.wrapper.find(`[data-hook="${dataHook}"]`);
  }
}
