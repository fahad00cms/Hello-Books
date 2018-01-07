import expect from 'expect';
import hammerjs from 'hammerjs';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';
import mockData from '../__mocks__/mockData';
import * as AuthActions from '../../actions/UserActions';
import * as ActionTypes from '../../actions/ActionTypes';

const middlewares = [thunk];

const mockStore = configureMockStore(middlewares);

window.localStorage = {};

global.Materialize = { toast: jest.fn(Promise.resolve(1)) };


describe('Auth actions', () => {
  beforeEach(() => moxios.install());
  afterEach(() => moxios.uninstall());

  it('should create SET_CURRENT_USER', () => {
    const user = {
      fullName: 'Abdulrasaq Nasirudeen',
      username: 'dealwap',
      email: 'nosisky@gmail.com',
    };

    const expectedAction = {
      decoded: {
        currentUser:
          {
            type: ActionTypes.SET_CURRENT_USER,
            user,
            authenticated: true
          }
      }
    };

    expect(AuthActions.setCurrentUser(user))
      .toEqual(expectedAction.decoded.currentUser);
  });

  it('creates SET_CURRENT_USER when login action is successful', () => {
    const { authResponse } = mockData;
    moxios.stubRequest('/api/v1/users/signin', {
      status: 200,
      response: authResponse
    });

    const expectedActions = {
      type: ActionTypes.SET_CURRENT_USER,
      user: authResponse.currentUser
    };

    const store = mockStore({});
    store.dispatch(AuthActions.loginAction({}))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      })
      .catch(error => error);
  });


  it('creates SET_CURRENT_USER when signup action is successful', () => {
    const { authResponse } = mockData;
    moxios.stubRequest('/api/v1/users/signup', {
      status: 200,
      response: authResponse
    });

    const expectedActions = {
      type: ActionTypes.SET_CURRENT_USER,
      user: authResponse.currentUser
    };

    const store = mockStore({});
    store.dispatch(AuthActions.registerUserAction({}))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      })
      .catch(error => error);
  });

  it('creates EDIT_PROFILE when user edit profile', () => {
    const { authResponse } = mockData;
    moxios.stubRequest('/api/v1/users/edit/1', {
      status: 200,
      response: authResponse
    });

    moxios.stubRequest('/api/v1/search/1', {
      status: 200,
      response: authResponse
    });

    const expectedActions = {
      type: ActionTypes.EDIT_PROFILE,
      user: authResponse.currentUser
    };

    const store = mockStore({});
    store.dispatch(AuthActions.editProfileAction({}))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      })
      .catch(error => error);
  });
});