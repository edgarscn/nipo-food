module.exports = {
  siteMetadata: {
    title: `Nipo Food - Cardápio & Marmitas da República`,
    description: `Gerenciamento simplificado de refeições presenciais e marmitas para os moradores da república.`,
    author: `@edgar`,
    siteUrl: `https://nipo-food.netlify.app`,
  },
  plugins: [
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Nipo Food - Refeições & Marmitas`,
        short_name: `Nipo Food`,
        start_url: `/`,
        background_color: `#0F172A`,
        theme_color: `#6B4C85`,
        display: `standalone`,
        icon: `static/icon.jpg`,
        icons: [
          {
            src: `static/icon.jpg`,
            sizes: `192x192 512x512`,
            type: `image/jpeg`,
            purpose: `any maskable`
          }
        ]
      },
    },
    `gatsby-plugin-offline`,
  ],
}
