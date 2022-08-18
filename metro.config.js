/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

 const path = require('path');
 
 module.exports = {
   projectRoot: __dirname,
   watchFolders: [__dirname],
   transformer: {
     getTransformOptions: async () => ({
       transform: {
         experimentalImportSupport: false,
         inlineRequires: true,
       },
     }),
   },
 };
 