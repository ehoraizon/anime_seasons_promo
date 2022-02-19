exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
    if (stage === "build-html" || stage === "develop-html") {
      actions.setWebpackConfig({
        module: {
          rules: [
            {
              test: /axios|material-icons-react|webfontloader/,
              use: loaders.null(),
            }
          ],
        },
      })
    }
  }