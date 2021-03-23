#! /usr/bin/env node
"use strict";

var _index = _interopRequireDefault(require("../index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var port = process.env.PORT || 5000;
var address = '0.0.0.0';
(0, _index["default"])().listen(port, address, function () {
  console.log("Server has been started on ".concat(port));
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NlcnZlci9iaW4vc2xhY2suanMiXSwibmFtZXMiOlsicG9ydCIsInByb2Nlc3MiLCJlbnYiLCJQT1JUIiwiYWRkcmVzcyIsImxpc3RlbiIsImNvbnNvbGUiLCJsb2ciXSwibWFwcGluZ3MiOiJBQUFBOzs7QUFFQTs7OztBQUVBLElBQU1BLElBQUksR0FBR0MsT0FBTyxDQUFDQyxHQUFSLENBQVlDLElBQVosSUFBb0IsSUFBakM7QUFDQSxJQUFNQyxPQUFPLEdBQUcsU0FBaEI7QUFFQSx5QkFBU0MsTUFBVCxDQUFnQkwsSUFBaEIsRUFBc0JJLE9BQXRCLEVBQStCLFlBQU07QUFDbkNFLEVBQUFBLE9BQU8sQ0FBQ0MsR0FBUixzQ0FBMENQLElBQTFDO0FBQ0QsQ0FGRCIsInNvdXJjZXNDb250ZW50IjpbIiMhIC91c3IvYmluL2VudiBub2RlXG5cbmltcG9ydCBnZXRBcHAgZnJvbSAnLi4vaW5kZXguanMnO1xuXG5jb25zdCBwb3J0ID0gcHJvY2Vzcy5lbnYuUE9SVCB8fCA1MDAwO1xuY29uc3QgYWRkcmVzcyA9ICcwLjAuMC4wJztcblxuZ2V0QXBwKCkubGlzdGVuKHBvcnQsIGFkZHJlc3MsICgpID0+IHtcbiAgY29uc29sZS5sb2coYFNlcnZlciBoYXMgYmVlbiBzdGFydGVkIG9uICR7cG9ydH1gKTtcbn0pO1xuIl19