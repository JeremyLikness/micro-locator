/**
 * @license
 * Copyright Jeremy Likness. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT license that can be
 * found in the LICENSE file at https://github.com/jeremylikness/micro-locator/LICENSE.md 
 */

var ws = require('nodejs-websocket');

// simple echo server
ws.createServer(function (conn) {
  conn.on('text', function (str) {
    conn.sendText(str.toString());
  });
}).listen(8001);