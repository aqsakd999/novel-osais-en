const CracoAlias = require('craco-alias')

module.exports = {
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: 'tsconfig',
        baseUrl: '.',
        tsConfigPath: './tsconfig.paths.json',
      },
    },
  ],
  eslint: null,
  devServer: {
    client: {
      overlay: false,  // disable full screen overlay

      // You can configure more specifically:
      // overlay: {
      //  errors: true,
      //  warnings: false,
      //  runtimeErrors: true,
      //}
    }  
   }

}
