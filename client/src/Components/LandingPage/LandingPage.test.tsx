import React from 'react';
import LandingPage from './LandingPage';
import { mount } from 'enzyme';
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

import { findByDataHook, storeFactory } from '../../utilities/testUtils';


const setup = (initialState = {}, props = {}) => {
    const store = storeFactory(initialState);
    return mount(
        //@ts-ignore
        <Provider store={store}>
            <Router>
                <LandingPage {...props} />
            </Router>
        </Provider>);
}

describe('Testing landingpage UI', () => {
    let wrapper
    beforeEach(() => {
        wrapper = setup()
    })
    test('renders button', () => {
        const landingPageButton = findByDataHook(wrapper, 'landing-page-button');
        expect(landingPageButton.length).toBe(1);
    })
})
