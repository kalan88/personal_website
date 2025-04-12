const path = require('path');

module.exports = {
  entry: './src/index.js',  // The entry point to your app (change as necessary)
  output: {
    filename: 'bundle.js',   // Output file after the build
    path: path.resolve(__dirname, 'dist'),  // Folder where the bundled files will go
  },
  module: {
    rules: [
      {
        test: /\.css$/,  // Look for all CSS files
        use: [
          'style-loader',  // Injects CSS into the DOM
          'css-loader',    // Resolves CSS imports
          'postcss-loader' // Processes the CSS through PostCSS (including TailwindCSS)
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css'],  // Resolves JS, JSX, and CSS files
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),  // Folder to serve the built files
    compress: true,
    port: 3000,  // Development server port
  },
};
