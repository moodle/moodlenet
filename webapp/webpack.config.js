const path = require('path');

module.exports = {
  rules: [
    {
      test: /\.ts$/,
      exclude: /(node_modules)/,
      include: [
        path.resolve(__dirname, '../backend')
      ],
      loader: 'babel-loader',
      //   use: {
      //   loader: 'babel-loader',
      //   options: {
      //     //  presets: ['@babel/preset-env']
      //   }
      // }
    }
  ],
  resolve: {
    alias: {
      "mn-sys": path.resolve(__dirname, '../backend'),
    }
  }
};