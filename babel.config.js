// api.cache(false)
// module.exports = {
//   presets: ['module:@react-native/babel-preset'],
//   plugins: [
//     ['module:react-native-dotenv']
//   ]
// };
module.exports = function (api) {
  api.cache(false); // Desactiva el cache de Babel
  return {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
      ['module:react-native-dotenv']
    ]
  };
};
