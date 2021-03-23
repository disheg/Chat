"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("regenerator-runtime/runtime");

var _path = _interopRequireDefault(require("path"));

var _pug = _interopRequireDefault(require("pug"));

var _socket = _interopRequireDefault(require("socket.io"));

var _fastify = _interopRequireDefault(require("fastify"));

var _pointOfView = _interopRequireDefault(require("point-of-view"));

var _fastifyStatic = _interopRequireDefault(require("fastify-static"));

var _routes = _interopRequireDefault(require("./routes.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// @ts-check
var isProduction = process.env.NODE_ENV === 'production';

var setUpViews = function setUpViews(app) {
  var domain = isProduction ? '' : 'http://localhost:8080';
  app.register(_pointOfView["default"], {
    engine: {
      pug: _pug["default"]
    },
    defaultContext: {
      assetPath: function assetPath(filename) {
        return "".concat(domain, "/assets/").concat(filename);
      }
    },
    templates: _path["default"].join(__dirname, 'views')
  });
};

var setUpStaticAssets = function setUpStaticAssets(app) {
  var pathPublic = isProduction ? _path["default"].join(__dirname, 'public') : _path["default"].join(__dirname, '..', 'dist', 'public');
  app.register(_fastifyStatic["default"], {
    root: pathPublic,
    prefix: '/assets/'
  });
};

var _default = function _default() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var app = (0, _fastify["default"])({
    logger: true,
    prettyPrint: true
  });
  setUpViews(app);
  setUpStaticAssets(app);
  var io = (0, _socket["default"])(app.server);
  (0, _routes["default"])(app, io, options.state || {});
  return app;
};

exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NlcnZlci9pbmRleC5qcyJdLCJuYW1lcyI6WyJpc1Byb2R1Y3Rpb24iLCJwcm9jZXNzIiwiZW52IiwiTk9ERV9FTlYiLCJzZXRVcFZpZXdzIiwiYXBwIiwiZG9tYWluIiwicmVnaXN0ZXIiLCJwb2ludE9mVmlldyIsImVuZ2luZSIsInB1ZyIsIlB1ZyIsImRlZmF1bHRDb250ZXh0IiwiYXNzZXRQYXRoIiwiZmlsZW5hbWUiLCJ0ZW1wbGF0ZXMiLCJwYXRoIiwiam9pbiIsIl9fZGlybmFtZSIsInNldFVwU3RhdGljQXNzZXRzIiwicGF0aFB1YmxpYyIsImZhc3RpZnlTdGF0aWMiLCJyb290IiwicHJlZml4Iiwib3B0aW9ucyIsImxvZ2dlciIsInByZXR0eVByaW50IiwiaW8iLCJzZXJ2ZXIiLCJzdGF0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBVEE7QUFXQSxJQUFNQSxZQUFZLEdBQUdDLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyxRQUFaLEtBQXlCLFlBQTlDOztBQUVBLElBQU1DLFVBQVUsR0FBRyxTQUFiQSxVQUFhLENBQUNDLEdBQUQsRUFBUztBQUMxQixNQUFNQyxNQUFNLEdBQUdOLFlBQVksR0FBRyxFQUFILEdBQVEsdUJBQW5DO0FBQ0FLLEVBQUFBLEdBQUcsQ0FBQ0UsUUFBSixDQUFhQyx1QkFBYixFQUEwQjtBQUN4QkMsSUFBQUEsTUFBTSxFQUFFO0FBQ05DLE1BQUFBLEdBQUcsRUFBRUM7QUFEQyxLQURnQjtBQUl4QkMsSUFBQUEsY0FBYyxFQUFFO0FBQ2RDLE1BQUFBLFNBQVMsRUFBRSxtQkFBQ0MsUUFBRDtBQUFBLHlCQUFpQlIsTUFBakIscUJBQWtDUSxRQUFsQztBQUFBO0FBREcsS0FKUTtBQU94QkMsSUFBQUEsU0FBUyxFQUFFQyxpQkFBS0MsSUFBTCxDQUFVQyxTQUFWLEVBQXFCLE9BQXJCO0FBUGEsR0FBMUI7QUFTRCxDQVhEOztBQWFBLElBQU1DLGlCQUFpQixHQUFHLFNBQXBCQSxpQkFBb0IsQ0FBQ2QsR0FBRCxFQUFTO0FBQ2pDLE1BQU1lLFVBQVUsR0FBR3BCLFlBQVksR0FDM0JnQixpQkFBS0MsSUFBTCxDQUFVQyxTQUFWLEVBQXFCLFFBQXJCLENBRDJCLEdBRTNCRixpQkFBS0MsSUFBTCxDQUFVQyxTQUFWLEVBQXFCLElBQXJCLEVBQTJCLE1BQTNCLEVBQW1DLFFBQW5DLENBRko7QUFHQWIsRUFBQUEsR0FBRyxDQUFDRSxRQUFKLENBQWFjLHlCQUFiLEVBQTRCO0FBQzFCQyxJQUFBQSxJQUFJLEVBQUVGLFVBRG9CO0FBRTFCRyxJQUFBQSxNQUFNLEVBQUU7QUFGa0IsR0FBNUI7QUFJRCxDQVJEOztlQVVlLG9CQUFrQjtBQUFBLE1BQWpCQyxPQUFpQix1RUFBUCxFQUFPO0FBQy9CLE1BQU1uQixHQUFHLEdBQUcseUJBQVE7QUFBRW9CLElBQUFBLE1BQU0sRUFBRSxJQUFWO0FBQWdCQyxJQUFBQSxXQUFXLEVBQUU7QUFBN0IsR0FBUixDQUFaO0FBRUF0QixFQUFBQSxVQUFVLENBQUNDLEdBQUQsQ0FBVjtBQUNBYyxFQUFBQSxpQkFBaUIsQ0FBQ2QsR0FBRCxDQUFqQjtBQUVBLE1BQU1zQixFQUFFLEdBQUcsd0JBQU90QixHQUFHLENBQUN1QixNQUFYLENBQVg7QUFFQSwwQkFBVXZCLEdBQVYsRUFBZXNCLEVBQWYsRUFBbUJILE9BQU8sQ0FBQ0ssS0FBUixJQUFpQixFQUFwQztBQUVBLFNBQU94QixHQUFQO0FBQ0QsQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEB0cy1jaGVja1xuXG5pbXBvcnQgJ3JlZ2VuZXJhdG9yLXJ1bnRpbWUvcnVudGltZSc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBQdWcgZnJvbSAncHVnJztcbmltcG9ydCBzb2NrZXQgZnJvbSAnc29ja2V0LmlvJztcbmltcG9ydCBmYXN0aWZ5IGZyb20gJ2Zhc3RpZnknO1xuaW1wb3J0IHBvaW50T2ZWaWV3IGZyb20gJ3BvaW50LW9mLXZpZXcnO1xuaW1wb3J0IGZhc3RpZnlTdGF0aWMgZnJvbSAnZmFzdGlmeS1zdGF0aWMnO1xuaW1wb3J0IGFkZFJvdXRlcyBmcm9tICcuL3JvdXRlcy5qcyc7XG5cbmNvbnN0IGlzUHJvZHVjdGlvbiA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbic7XG5cbmNvbnN0IHNldFVwVmlld3MgPSAoYXBwKSA9PiB7XG4gIGNvbnN0IGRvbWFpbiA9IGlzUHJvZHVjdGlvbiA/ICcnIDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MCc7XG4gIGFwcC5yZWdpc3Rlcihwb2ludE9mVmlldywge1xuICAgIGVuZ2luZToge1xuICAgICAgcHVnOiBQdWcsXG4gICAgfSxcbiAgICBkZWZhdWx0Q29udGV4dDoge1xuICAgICAgYXNzZXRQYXRoOiAoZmlsZW5hbWUpID0+IGAke2RvbWFpbn0vYXNzZXRzLyR7ZmlsZW5hbWV9YCxcbiAgICB9LFxuICAgIHRlbXBsYXRlczogcGF0aC5qb2luKF9fZGlybmFtZSwgJ3ZpZXdzJyksXG4gIH0pO1xufTtcblxuY29uc3Qgc2V0VXBTdGF0aWNBc3NldHMgPSAoYXBwKSA9PiB7XG4gIGNvbnN0IHBhdGhQdWJsaWMgPSBpc1Byb2R1Y3Rpb25cbiAgICA/IHBhdGguam9pbihfX2Rpcm5hbWUsICdwdWJsaWMnKVxuICAgIDogcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJ2Rpc3QnLCAncHVibGljJyk7XG4gIGFwcC5yZWdpc3RlcihmYXN0aWZ5U3RhdGljLCB7XG4gICAgcm9vdDogcGF0aFB1YmxpYyxcbiAgICBwcmVmaXg6ICcvYXNzZXRzLycsXG4gIH0pO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgKG9wdGlvbnMgPSB7fSkgPT4ge1xuICBjb25zdCBhcHAgPSBmYXN0aWZ5KHsgbG9nZ2VyOiB0cnVlLCBwcmV0dHlQcmludDogdHJ1ZSB9KTtcblxuICBzZXRVcFZpZXdzKGFwcCk7XG4gIHNldFVwU3RhdGljQXNzZXRzKGFwcCk7XG5cbiAgY29uc3QgaW8gPSBzb2NrZXQoYXBwLnNlcnZlcik7XG5cbiAgYWRkUm91dGVzKGFwcCwgaW8sIG9wdGlvbnMuc3RhdGUgfHwge30pO1xuXG4gIHJldHVybiBhcHA7XG59O1xuIl19