"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var getNextId = function getNextId() {
  return Number(_lodash["default"].uniqueId());
};

var buildState = function buildState(defaultState) {
  var generalChannelId = getNextId();
  var randomChannelId = getNextId();
  var state = {
    channels: [{
      id: generalChannelId,
      name: 'general',
      removable: false
    }, {
      id: randomChannelId,
      name: 'random',
      removable: false
    }],
    messages: [],
    currentChannelId: generalChannelId
  };

  if (defaultState.messages) {
    var _state$messages;

    (_state$messages = state.messages).push.apply(_state$messages, _toConsumableArray(defaultState.messages));
  }

  if (defaultState.channels) {
    var _state$channels;

    (_state$channels = state.channels).push.apply(_state$channels, _toConsumableArray(defaultState.channels));
  }

  if (defaultState.currentChannelId) {
    state.currentChannelId = defaultState.currentChannelId;
  }

  return state;
};

var _default = function _default(app, io) {
  var defaultState = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var state = buildState(defaultState);
  app.get('/', function (_req, reply) {
    reply.view('index.pug', {
      gon: state
    });
  }).get('/api/v1/channels', function (_req, reply) {
    var resources = state.channels.map(function (c) {
      return {
        type: 'channels',
        id: c.id,
        attributes: c
      };
    });
    var response = {
      data: resources
    };
    reply.send(response);
  }).post('/api/v1/channels', function (req, reply) {
    var name = req.body.data.attributes.name;
    var channel = {
      name: name,
      removable: true,
      id: getNextId()
    };
    state.channels.push(channel);
    reply.code(201);
    var data = {
      data: {
        type: 'channels',
        id: channel.id,
        attributes: channel
      }
    };
    reply.send(data);
    io.emit('newChannel', data);
  })["delete"]('/api/v1/channels/:id', function (req, reply) {
    var channelId = Number(req.params.id);
    state.channels = state.channels.filter(function (c) {
      return c.id !== channelId;
    });
    state.messages = state.messages.filter(function (m) {
      return m.channelId !== channelId;
    });
    reply.code(204);
    var data = {
      data: {
        type: 'channels',
        id: channelId
      }
    };
    reply.send(data);
    io.emit('removeChannel', data);
  }).patch('/api/v1/channels/:id', function (req, reply) {
    var channelId = Number(req.params.id);
    var channel = state.channels.find(function (c) {
      return c.id === channelId;
    });
    var attributes = req.body.data.attributes;
    channel.name = attributes.name;
    var data = {
      data: {
        type: 'channels',
        id: channelId,
        attributes: channel
      }
    };
    reply.send(data);
    io.emit('renameChannel', data);
  }).get('/api/v1/channels/:channelId/messages', function (req, reply) {
    var messages = state.messages.filter(function (m) {
      return m.channelId === Number(req.params.channelId);
    });
    var resources = messages.map(function (m) {
      return {
        type: 'messages',
        id: m.id,
        attributes: m
      };
    });
    var response = {
      data: resources
    };
    reply.send(response);
  }).post('/api/v1/channels/:channelId/messages', function (req, reply) {
    console.log('body', req.body);
    var attributes = req.body.data.attributes;

    var message = _objectSpread(_objectSpread({}, attributes), {}, {
      channelId: Number(req.params.channelId),
      id: getNextId()
    });

    state.messages.push(message);
    reply.code(201);
    var data = {
      data: {
        type: 'messages',
        id: message.id,
        attributes: message
      }
    };
    reply.send(data);
    io.emit('newMessage', data);
  });
};

exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NlcnZlci9yb3V0ZXMuanMiXSwibmFtZXMiOlsiZ2V0TmV4dElkIiwiTnVtYmVyIiwiXyIsInVuaXF1ZUlkIiwiYnVpbGRTdGF0ZSIsImRlZmF1bHRTdGF0ZSIsImdlbmVyYWxDaGFubmVsSWQiLCJyYW5kb21DaGFubmVsSWQiLCJzdGF0ZSIsImNoYW5uZWxzIiwiaWQiLCJuYW1lIiwicmVtb3ZhYmxlIiwibWVzc2FnZXMiLCJjdXJyZW50Q2hhbm5lbElkIiwicHVzaCIsImFwcCIsImlvIiwiZ2V0IiwiX3JlcSIsInJlcGx5IiwidmlldyIsImdvbiIsInJlc291cmNlcyIsIm1hcCIsImMiLCJ0eXBlIiwiYXR0cmlidXRlcyIsInJlc3BvbnNlIiwiZGF0YSIsInNlbmQiLCJwb3N0IiwicmVxIiwiYm9keSIsImNoYW5uZWwiLCJjb2RlIiwiZW1pdCIsImNoYW5uZWxJZCIsInBhcmFtcyIsImZpbHRlciIsIm0iLCJwYXRjaCIsImZpbmQiLCJjb25zb2xlIiwibG9nIiwibWVzc2FnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsU0FBUyxHQUFHLFNBQVpBLFNBQVk7QUFBQSxTQUFNQyxNQUFNLENBQUNDLG1CQUFFQyxRQUFGLEVBQUQsQ0FBWjtBQUFBLENBQWxCOztBQUVBLElBQU1DLFVBQVUsR0FBRyxTQUFiQSxVQUFhLENBQUNDLFlBQUQsRUFBa0I7QUFDbkMsTUFBTUMsZ0JBQWdCLEdBQUdOLFNBQVMsRUFBbEM7QUFDQSxNQUFNTyxlQUFlLEdBQUdQLFNBQVMsRUFBakM7QUFDQSxNQUFNUSxLQUFLLEdBQUc7QUFDWkMsSUFBQUEsUUFBUSxFQUFFLENBQ1I7QUFBRUMsTUFBQUEsRUFBRSxFQUFFSixnQkFBTjtBQUF3QkssTUFBQUEsSUFBSSxFQUFFLFNBQTlCO0FBQXlDQyxNQUFBQSxTQUFTLEVBQUU7QUFBcEQsS0FEUSxFQUVSO0FBQUVGLE1BQUFBLEVBQUUsRUFBRUgsZUFBTjtBQUF1Qkks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Q0MsSUFBeEI7QUFENEQsUUFFNUNOLFVBRjRDLEdBRTNCSyxHQUFHLENBQUNDLElBRnVCLENBRXBESixJQUZvRCxDQUU1Q0YsVUFGNEM7O0FBRzVELFFBQU1rQixPQUFPLG1DQUNSbEIsVUFEUTtBQUVYVSxNQUFBQSxTQUFTLEVBQUVwQyxNQUFNLENBQUMrQixHQUFHLENBQUNNLE1BQUosQ0FBV0QsU0FBWixDQUZOO0FBR1gzQixNQUFBQSxFQUFFLEVBQUVWLFNBQVM7QUFIRixNQUFiOztBQUtBUSxJQUFBQSxLQUFLLENBQUNLLFFBQU4sQ0FBZUUsSUFBZixDQUFvQjhCLE9BQXBCO0FBQ0F6QixJQUFBQSxLQUFLLENBQUNlLElBQU4sQ0FBVyxHQUFYO0FBQ0EsUUFBTU4sSUFBSSxHQUFHO0FBQ1hBLE1BQUFBLElBQUksRUFBRTtBQUNKSCxRQUFBQSxJQUFJLEVBQUUsVUFERjtBQUVKaEIsUUFBQUEsRUFBRSxFQUFFbUMsT0FBTyxDQUFDbkMsRUFGUjtBQUdKaUIsUUFBQUEsVUFBVSxFQUFFa0I7QUFIUjtBQURLLEtBQWI7QUFPQXpCLElBQUFBLEtBQUssQ0FBQ1UsSUFBTixDQUFXRCxJQUFYO0FBQ0FaLElBQUFBLEVBQUUsQ0FBQ21CLElBQUgsQ0FBUSxZQUFSLEVBQXNCUCxJQUF0QjtBQUNELEdBbEdIO0FBbUdELEMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAdHMtY2hlY2tcblxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcblxuY29uc3QgZ2V0TmV4dElkID0gKCkgPT4gTnVtYmVyKF8udW5pcXVlSWQoKSk7XG5cbmNvbnN0IGJ1aWxkU3RhdGUgPSAoZGVmYXVsdFN0YXRlKSA9PiB7XG4gIGNvbnN0IGdlbmVyYWxDaGFubmVsSWQgPSBnZXROZXh0SWQoKTtcbiAgY29uc3QgcmFuZG9tQ2hhbm5lbElkID0gZ2V0TmV4dElkKCk7XG4gIGNvbnN0IHN0YXRlID0ge1xuICAgIGNoYW5uZWxzOiBbXG4gICAgICB7IGlkOiBnZW5lcmFsQ2hhbm5lbElkLCBuYW1lOiAnZ2VuZXJhbCcsIHJlbW92YWJsZTogZmFsc2UgfSxcbiAgICAgIHsgaWQ6IHJhbmRvbUNoYW5uZWxJZCwgbmFtZTogJ3JhbmRvbScsIHJlbW92YWJsZTogZmFsc2UgfSxcbiAgICBdLFxuICAgIG1lc3NhZ2VzOiBbXSxcbiAgICBjdXJyZW50Q2hhbm5lbElkOiBnZW5lcmFsQ2hhbm5lbElkLFxuICB9O1xuXG4gIGlmIChkZWZhdWx0U3RhdGUubWVzc2FnZXMpIHtcbiAgICBzdGF0ZS5tZXNzYWdlcy5wdXNoKC4uLmRlZmF1bHRTdGF0ZS5tZXNzYWdlcyk7XG4gIH1cbiAgaWYgKGRlZmF1bHRTdGF0ZS5jaGFubmVscykge1xuICAgIHN0YXRlLmNoYW5uZWxzLnB1c2goLi4uZGVmYXVsdFN0YXRlLmNoYW5uZWxzKTtcbiAgfVxuICBpZiAoZGVmYXVsdFN0YXRlLmN1cnJlbnRDaGFubmVsSWQpIHtcbiAgICBzdGF0ZS5jdXJyZW50Q2hhbm5lbElkID0gZGVmYXVsdFN0YXRlLmN1cnJlbnRDaGFubmVsSWQ7XG4gIH1cblxuICByZXR1cm4gc3RhdGU7XG59O1xuXG5leHBvcnQgZGVmYXVsdCAoYXBwLCBpbywgZGVmYXVsdFN0YXRlID0ge30pID0+IHtcbiAgY29uc3Qgc3RhdGUgPSBidWlsZFN0YXRlKGRlZmF1bHRTdGF0ZSk7XG5cbiAgYXBwXG4gICAgLmdldCgnLycsIChfcmVxLCByZXBseSkgPT4ge1xuICAgICAgcmVwbHkudmlldygnaW5kZXgucHVnJywgeyBnb246IHN0YXRlIH0pO1xuICAgIH0pXG4gICAgLmdldCgnL2FwaS92MS9jaGFubmVscycsIChfcmVxLCByZXBseSkgPT4ge1xuICAgICAgY29uc3QgcmVzb3VyY2VzID0gc3RhdGUuY2hhbm5lbHMubWFwKChjKSA9PiAoe1xuICAgICAgICB0eXBlOiAnY2hhbm5lbHMnLFxuICAgICAgICBpZDogYy5pZCxcbiAgICAgICAgYXR0cmlidXRlczogYyxcbiAgICAgIH0pKTtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0ge1xuICAgICAgICBkYXRhOiByZXNvdXJjZXMsXG4gICAgICB9O1xuICAgICAgcmVwbHkuc2VuZChyZXNwb25zZSk7XG4gICAgfSlcbiAgICAucG9zdCgnL2FwaS92MS9jaGFubmVscycsIChyZXEsIHJlcGx5KSA9PiB7XG4gICAgICBjb25zdCB7IGRhdGE6IHsgYXR0cmlidXRlczogeyBuYW1lIH0gfSB9ID0gcmVxLmJvZHk7XG4gICAgICBjb25zdCBjaGFubmVsID0ge1xuICAgICAgICBuYW1lLFxuICAgICAgICByZW1vdmFibGU6IHRydWUsXG4gICAgICAgIGlkOiBnZXROZXh0SWQoKSxcbiAgICAgIH07XG4gICAgICBzdGF0ZS5jaGFubmVscy5wdXNoKGNoYW5uZWwpO1xuICAgICAgcmVwbHkuY29kZSgyMDEpO1xuICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHR5cGU6ICdjaGFubmVscycsXG4gICAgICAgICAgaWQ6IGNoYW5uZWwuaWQsXG4gICAgICAgICAgYXR0cmlidXRlczogY2hhbm5lbCxcbiAgICAgICAgfSxcbiAgICAgIH07XG5cbiAgICAgIHJlcGx5LnNlbmQoZGF0YSk7XG4gICAgICBpby5lbWl0KCduZXdDaGFubmVsJywgZGF0YSk7XG4gICAgfSlcbiAgICAuZGVsZXRlKCcvYXBpL3YxL2NoYW5uZWxzLzppZCcsIChyZXEsIHJlcGx5KSA9PiB7XG4gICAgICBjb25zdCBjaGFubmVsSWQgPSBOdW1iZXIocmVxLnBhcmFtcy5pZCk7XG4gICAgICBzdGF0ZS5jaGFubmVscyA9IHN0YXRlLmNoYW5uZWxzLmZpbHRlcigoYykgPT4gYy5pZCAhPT0gY2hhbm5lbElkKTtcbiAgICAgIHN0YXRlLm1lc3NhZ2VzID0gc3RhdGUubWVzc2FnZXMuZmlsdGVyKChtKSA9PiBtLmNoYW5uZWxJZCAhPT0gY2hhbm5lbElkKTtcbiAgICAgIHJlcGx5LmNvZGUoMjA0KTtcbiAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICB0eXBlOiAnY2hhbm5lbHMnLFxuICAgICAgICAgIGlkOiBjaGFubmVsSWQsXG4gICAgICAgIH0sXG4gICAgICB9O1xuXG4gICAgICByZXBseS5zZW5kKGRhdGEpO1xuICAgICAgaW8uZW1pdCgncmVtb3ZlQ2hhbm5lbCcsIGRhdGEpO1xuICAgIH0pXG4gICAgLnBhdGNoKCcvYXBpL3YxL2NoYW5uZWxzLzppZCcsIChyZXEsIHJlcGx5KSA9PiB7XG4gICAgICBjb25zdCBjaGFubmVsSWQgPSBOdW1iZXIocmVxLnBhcmFtcy5pZCk7XG4gICAgICBjb25zdCBjaGFubmVsID0gc3RhdGUuY2hhbm5lbHMuZmluZCgoYykgPT4gYy5pZCA9PT0gY2hhbm5lbElkKTtcblxuICAgICAgY29uc3QgeyBkYXRhOiB7IGF0dHJpYnV0ZXMgfSB9ID0gcmVxLmJvZHk7XG4gICAgICBjaGFubmVsLm5hbWUgPSBhdHRyaWJ1dGVzLm5hbWU7XG5cbiAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICB0eXBlOiAnY2hhbm5lbHMnLFxuICAgICAgICAgIGlkOiBjaGFubmVsSWQsXG4gICAgICAgICAgYXR0cmlidXRlczogY2hhbm5lbCxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgICByZXBseS5zZW5kKGRhdGEpO1xuICAgICAgaW8uZW1pdCgncmVuYW1lQ2hhbm5lbCcsIGRhdGEpO1xuICAgIH0pXG4gICAgLmdldCgnL2FwaS92MS9jaGFubmVscy86Y2hhbm5lbElkL21lc3NhZ2VzJywgKHJlcSwgcmVwbHkpID0+IHtcbiAgICAgIGNvbnN0IG1lc3NhZ2VzID0gc3RhdGUubWVzc2FnZXMuZmlsdGVyKChtKSA9PiBtLmNoYW5uZWxJZCA9PT0gTnVtYmVyKHJlcS5wYXJhbXMuY2hhbm5lbElkKSk7XG4gICAgICBjb25zdCByZXNvdXJjZXMgPSBtZXNzYWdlcy5tYXAoKG0pID0+ICh7XG4gICAgICAgIHR5cGU6ICdtZXNzYWdlcycsXG4gICAgICAgIGlkOiBtLmlkLFxuICAgICAgICBhdHRyaWJ1dGVzOiBtLFxuICAgICAgfSkpO1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSB7XG4gICAgICAgIGRhdGE6IHJlc291cmNlcyxcbiAgICAgIH07XG4gICAgICByZXBseS5zZW5kKHJlc3BvbnNlKTtcbiAgICB9KVxuICAgIC5wb3N0KCcvYXBpL3YxL2NoYW5uZWxzLzpjaGFubmVsSWQvbWVzc2FnZXMnLCAocmVxLCByZXBseSkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ2JvZHknLCByZXEuYm9keSlcbiAgICAgIGNvbnN0IHsgZGF0YTogeyBhdHRyaWJ1dGVzIH0gfSA9IHJlcS5ib2R5O1xuICAgICAgY29uc3QgbWVzc2FnZSA9IHtcbiAgICAgICAgLi4uYXR0cmlidXRlcyxcbiAgICAgICAgY2hhbm5lbElkOiBOdW1iZXIocmVxLnBhcmFtcy5jaGFubmVsSWQpLFxuICAgICAgICBpZDogZ2V0TmV4dElkKCksXG4gICAgICB9O1xuICAgICAgc3RhdGUubWVzc2FnZXMucHVzaChtZXNzYWdlKTtcbiAgICAgIHJlcGx5LmNvZGUoMjAxKTtcbiAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICB0eXBlOiAnbWVzc2FnZXMnLFxuICAgICAgICAgIGlkOiBtZXNzYWdlLmlkLFxuICAgICAgICAgIGF0dHJpYnV0ZXM6IG1lc3NhZ2UsXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgICAgcmVwbHkuc2VuZChkYXRhKTtcbiAgICAgIGlvLmVtaXQoJ25ld01lc3NhZ2UnLCBkYXRhKTtcbiAgICB9KTtcbn07XG4iXX0=