/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

 const path = require('path');
 const rnProjectRoot =  path.join(__dirname, '/');
 const nodeModulesRoot =  path.join(__dirname, '/node_modules');
 
 module.exports = {
   projectRoot: rnProjectRoot,
   watchFolders: [rnProjectRoot, nodeModulesRoot, __dirname],
   transformer: {
     getTransformOptions: async () => ({
       transform: {
         experimentalImportSupport: false,
         inlineRequires: true,
       },
     }),
   },
 };
 