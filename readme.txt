npm init --yes

brew services start mongodb-community@4.4
brew services stop mongodb-community@4.4

export vidly_jwtPrivateKey=secure
NODE_ENV=test nodemon index.js

cd Documents/CollegeStuff/Classes/NodeTutorial/vidly/

package.json jest flag = --coverage