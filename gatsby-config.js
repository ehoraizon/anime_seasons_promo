module.exports = {
  pathPrefix: "/anime_seasons_promo",
  siteMetadata: {
      title: `Anime Seasons Promo`,
    siteUrl: `https://ehoraizon.github.io/anime_seasons_promo/`
  },
  plugins: ["gatsby-plugin-sass", 
    {
      resolve: "gatsby-plugin-typescript",
      options: {
        isTSX: true,
        jsxPragma: "jsx",
        allExtensions: true,
      },
    },
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /\.svg$/
        }
      }
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        icon: './src/images/main_icon.svg',
        name: 'Anime Seasons Promo',
        short_name: 'Anime Seasons',
        display: 'standalone',
        start_url: 'https://ehoraizon.github.io/anime_seasons_promo/'
      }
    }
  ]
};