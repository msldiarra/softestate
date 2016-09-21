import Relay from 'react-relay';
import React from 'react';
import IndexRoute from 'react-router/lib/IndexRoute';
import Route from 'react-router/lib/Route';
import AuthenticatedApp from '../components/AuthenticatedApp';
import UnauthenticatedApp from '../components/UnauthenticatedApp';
import Dashboard from '../components/Dashboard';
import Login from '../components/Login';
import NewOwner from '../components/NewOwner';
import NewProperty from '../components/NewProperty';
import PropertyDetails from '../components/PropertyDetails';
import PropertyDetailsEdit from '../components/PropertyDetailsEdit';
import OwnerDetails from '../components/OwnerDetails';
import About from '../components/About';
import OwnerEdit from '../components/OwnerEdit';

class RouteHome extends Relay.Route {
    static queries = {
        viewer: (Component, vars) => Relay.QL`
          query {
            viewer(userID: $userID) {
                 ${Component.getFragment('viewer', vars)}
            }
          }
        `
    };

    static paramDefinitions = {
        userID: {required: false},
    };

    static routeName = 'AppHomeRoute';
}

function requireAuth(nextState, replace) {
    if(!JSON.parse(localStorage.getItem('user'))) {
        replace({
            pathname: '/login',
            state: { nextPathname: nextState.location.pathname }
        })
    }
}

function getParams(params, route){

    return {
        ...params,
        userID: JSON.parse(localStorage.getItem('user'))? JSON.parse(localStorage.getItem('user')).id : null
    }
}

export default  <Route path="/">
                    <Route path="admin" component={AuthenticatedApp} queries={RouteHome.queries} prepareParams={getParams} >
                        <Route path="newowner" component={NewOwner} queries={RouteHome.queries} prepareParams={getParams} onEnter={requireAuth} />
                        <Route path="newproperty" component={NewProperty} queries={RouteHome.queries} prepareParams={getParams} onEnter={requireAuth} />
                        <Route path="property/:reference/edit" component={PropertyDetailsEdit} queries={RouteHome.queries} prepareParams={getParams} onEnter={requireAuth} />
                        <Route path="owner/:search" component={OwnerDetails} queries={RouteHome.queries} prepareParams={getParams} onEnter={requireAuth} />
                        <Route path="owner/:search/edit" component={OwnerEdit} queries={RouteHome.queries} prepareParams={getParams} onEnter={requireAuth} />

                    </Route>
                    <Route component={UnauthenticatedApp} queries={RouteHome.queries} prepareParams={getParams} >
                        <IndexRoute component={Dashboard} queries={RouteHome.queries} prepareParams={getParams}  />
                        <Route path="property/:reference" component={PropertyDetails} queries={RouteHome.queries} prepareParams={getParams} />
                        <Route path="about" component={About}  />
                    </Route>
                    <Route path="admin/login" component={Login}  />
                </Route>