var SessionStore = require('../stores/session')

module.exports = function(flows, store, options) {
  options = options || {};

  return function proceedState(req, res, next) {

    if (!req.state) {
      // No current state, nothing to proceed. `next` middleware is expected to
      // implement default behavior for responding to the request.
      return next();
    }

    store.update(req, req.state.handle, req.state, function(err) {
      if (err) { return next(err); }

      var name = req.state.name;
      if (!name) { return next(new Error("Cannot proceed unnamed flow")); }

      try {
        flows._proceed(name, null, req, res, next);
      } catch(ex) {
        return next(ex);
      }
    });
  };
}
