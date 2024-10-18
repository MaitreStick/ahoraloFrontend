// api.cache(false)
// module.exports = {
//   presets: ['module:@react-native/babel-preset'],
//   plugins: [
//     ['module:react-native-dotenv']
//   ]
// };
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: true,
        verbose: false,
        // Agrega esta línea:
        // envName: 'APP_ENV',
      },
    ],
    ['@babel/plugin-transform-class-properties', { loose: true }],
    ['@babel/plugin-transform-private-methods', { loose: true }],
    ['@babel/plugin-transform-private-property-in-object', { loose: true }],
  ],
};