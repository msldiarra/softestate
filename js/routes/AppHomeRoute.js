import Relay from 'react-relay';
import React from 'react';
import IndexRoute from 'react-router/lib/IndexRoute';
import Route from 'react-router/lib/Route';
import AuthenticatedApp from '../components/user/AuthenticatedApp';
import AnonymousApp from '../components/AnonymousApp';
import Dashboard from '../components/common/Dashboard';
import CustomerDashboard from '../components/user/CustomerDashboard';
import Login from '../components/user/Login';
import NewOwner from '../components/user/NewOwner';
import NewProperty from '../components/user/NewProperty';
import PropertyDetails from '../components/common/PropertyDetails';
import PropertyDetailsEdit from '../components/user/PropertyDetailsEdit';
import OwnerDetails from '../components/user/OwnerDetails';
import OwnerEdit from '../components/user/OwnerEdit';

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
        viewerId: ''
    }
}

// ToDo : refactor all this
function getAnonymousDashboardParams(params, route){

    return {
        ...params,
        reference:'',
        city: 'Bamako',
        viewerId: ''
    }
}

export default  <Route>
                    <Route path="/" component={AnonymousApp} queries={RouteHome.queries} prepareParams={getAnonymousParams} >
                        <IndexRoute component={Dashboard} queries={RouteHome.queries} prepareParams={getAnonymousDashboardParams} />
                        <Route path="properties/:city" component={Dashboard} queries={RouteHome.queries} prepareParams={getAnonymousParams} />
                        <Route path="property/:reference" component={PropertyDetails} queries={RouteHome.queries} prepareParams={getAnonymousParams} />
                    </Route>
                    <Route path="/admin" component={AuthenticatedApp} queries={RouteHome.queries} prepareParams={getParams} >
                        <IndexRoute component={CustomerDashboard} queries={RouteHome.queries} prepareParams={getParams} onEnter={requireAuth} />
                        <Route path="newowner" component={NewOwner} queries={RouteHome.queries} prepareParams={getParams} onEnter={requireAuth} />
                        <Route path="newproperty" component={NewProperty} queries={RouteHome.queries} prepareParams={getParams} onEnter={requireAuth} />
                        <Route path="property/:reference" component={PropertyDetails} queries={RouteHome.queries} prepareParams={getParams} onEnter={requireAuth} />
                        <Route path="property/:reference/edit" component={PropertyDetailsEdit} queries={RouteHome.queries} prepareParams={getParams} onEnter={requireAuth} />
                        <Route path="owner/:search" component={OwnerDetails} queries={RouteHome.queries} prepareParams={getParams} onEnter={requireAuth} />
                        <Route path="owner/:search/edit" component={OwnerEdit} queries={RouteHome.queries} prepareParams={getParams} onEnter={requireAuth} />
                    </Route>
                    <Route path="login" component={Login}  />
                </Route>