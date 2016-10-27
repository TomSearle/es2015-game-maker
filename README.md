es2015 game maker
-----------------

In 2015 I made a game creation tool for my Final Year Project. The aims were to
create a physics based game creation tool aimed at younger audiences while also
showing off Game Engine patterns in JS. The result of this project can be found
on [my websites project page](https://tomsearle.com/project).

This project is the result of converting this engine over to es2015 format to
test speed differences and stretch my modern js muscles.

Note: This project is not currently in a working state.

building
--------
The project is powered by webpack, so firstly install the node modules:

	npm install

Then run the webpack-dev-server

	./node_modules/.bin/webpack-dev-server --content-base bin/
