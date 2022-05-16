
module.exports = {
  rules: [
    {
      test: /\.(png|jpg|gif)$/i,
      use: [
          {
              loader: 'url-loader',
              options: {
                  limit: 10000,
              },
          },
      ],
    },
    {
      test: /\.svg$/,
      use: [
        {
          loader: 'svg-url-loader',
          options: {
            limit: 10000,
          },
        },
      ],
    }
  ],
  resolve: {
    alias: {
    },
  },
  watchOptions: {
    aggregateTimeout: 500,
    poll: 1500
  },
}
