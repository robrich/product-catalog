const path = require('path');

module.exports = async ({ config }) => {
  config.resolve.alias['~storybook'] = path.resolve(__dirname);
  
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    exclude: path.resolve(__dirname, '../node_modules/'),
    use: [
      {
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/],
          transpileOnly: true
        }
      }
    ]
  });

  config.module.rules.push({
    resourceQuery: /blockType=story/,
    loader: 'vue-storybook',
  });

  config.module.rules.push({
    test: /\.s(a|c)ss$/,
    use: ['style-loader', 'css-loader', 'sass-loader'],
    include: path.resolve(__dirname, '../'),
  });
  
  config.resolve.extensions.push('.ts', '.tsx');

  return config;
};
