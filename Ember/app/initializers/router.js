export function initialize( application) {
  // application.inject('route', 'foo', 'service:foo');
  //Allow compoenents to route to new pages by exposing the router in the component
  application.inject('route', 'router', 'router:main')
  application.inject('component', 'router', 'router:main')
}

export default {
  name: 'router',
  initialize
};
