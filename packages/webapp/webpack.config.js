
module.exports = {
  rules: [
    {
      test: /\.(png|jpg|gif|svg)$/i,
      use: [
          {
              loader: 'url-loader',
              options: {
                  limit: 10000,
              },
          },
      ],
    },
  ],
  resolve: {
    alias: {
    },
  },
  watchOptions: {
    aggregateTimeout: 500,
    poll: 1500
  }
}
