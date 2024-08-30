const { override, addPostcssPlugins, addWebpackPlugin } = require('customize-cra');
const Dotenv = require('dotenv-webpack'); // Import dotenv-webpack to manage environment variables

// Override the entry points for the Chrome extension
const overrideEntry = (config) => {
  config.entry = {
    main: './src/popup', // The extension UI
    background: './src/background',
    content: './src/content',
  };

  return config;
};

// Override the output filenames for the Chrome extension
const overrideOutput = (config) => {
  config.output = {
    ...config.output,
    filename: 'static/js/[name].js',
    chunkFilename: 'static/js/[name].js',
  };

  return config;
};

// Combine all overrides and add the dotenv-webpack plugin
module.exports = {
  webpack: override(
    overrideEntry,
    overrideOutput,
    addWebpackPlugin(
      new Dotenv({
        path: './.env', // Path to your .env file
        systemvars: true, // Load system environment variables as well
      })
    ),
    addPostcssPlugins([
      require('tailwindcss'), // Add Tailwind CSS
      require('autoprefixer'), // Add Autoprefixer
    ])
  ),
};
