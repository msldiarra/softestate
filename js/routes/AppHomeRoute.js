import Relay from 'react-relay';
import React from 'react';
import IndexRoute from 'react-router/lib/IndexRoute';
import Route from 'react-router/lib/Route';
import AuthenticatedApp from '../components/AuthenticatedApp';
import AnonymousApp from '../components/AnonymousApp';
import Dashboard from '../components/Dashboard';
import Login from '../components/Login';
import NewOwner from '../components/NewOwner';
import NewProperty from '../components/NewProperty';
import PropertyDetails from '../components/PropertyDetails';
import PropertyDetailsEdit from '../components/PropertyDetailsEdit';
import OwnerDetails from '../components/OwnerDetails';
import OwnerEdit from '../components/OwnerEdit';

class RouteHome extends Relay.Route {
    static queries = {
        viewer: (Component, vars) => Relay.QL`
          query {
            viewer(viewerId: $viewerId) {
                 ${Component.getFragment('viewer', vars)}
            }
          }
        `
    };

    static paramDefinitions = {
        viewerId: {required: false},
    };

    static routeName = 'AppHomeRoute';
}

function requireAuth(nextState, replace) {
    if(!JSON.parse(localStorage.getItem('user'))) {
        replace({
            pathname: '/',
            state: { nextPathname: nextState.location.pathname }
        })
    }
}

function getParams(params, route){

    return {
        ...params,
        viewerId: (JSON.parse(localStorage.getItem('user')).id)
    }
}

function getAnonymousParams(params, route){

    return {
        ...params,
        viewerId: 0
    }
}

// ToDo : refactor all this
function getAnonymousDashboardParams(params, route){

    return {
        ...params,
        reference:'',
        city: 'Bamako',
        viewerId: 0
    }
}

export default  <Route>
                    <Route path="/" component={AnonymousApp} queries={RouteHome.queries} prepareParams={getAnonymousParams} >
                        <IndexRoute component={Dashboard} queries={RouteHome.queries} prepareParams={getAnonymousDashboardParams} />
                        <Route path="properties/:city" component={Dashboard} queries={RouteHome.queries} prepareParams={getAnonymousParams} />
                        <Route path="property/:reference" component={PropertyDetails} queries={RouteHome.queries} prepareParams={getAnonymousParams} />
                    </Route>
                    <Route path="/admin" component={AuthenticatedApp} queries={RouteHome.queries} prepareParams={getParams} >
                        <IndexRoute component={Dashboard} queries={RouteHome.queries} prepareParams={getParams} onEnter={requireAuth} />
                        <Route path="newowner" component={NewOwner} queries={RouteHome.queries} prepareParams={getParams} onEnter={requireAuth} />
                        <Route path="newproperty" component={NewProperty} queries={RouteHome.queries} prepareParams={getParams} onEnter={requireAuth} />
                        <Route path="property/:reference" component={PropertyDetails} queries={RouteHome.queries} prepareParams={getParams} onEnter={requireAuth} />
                        <Route path="property/:reference/edit" component={PropertyDetailsEdit} queries={RouteHome.queries} prepareParams={getParams} onEnter={requireAuth} />
                        <Route path="owner/:search" component={OwnerDetails} queries={RouteHome.queries} prepareParams={getParams} onEnter={requireAuth} />
                        <Route path="owner/:search/edit" component={OwnerEdit} queries={RouteHome.queries} prepareParams={getParams} onEnter={requireAuth} />

                    </Route>
                    <Route path="login" component={Login}  />
                </Route>