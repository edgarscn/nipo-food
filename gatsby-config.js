module.exports = {
  siteMetadata: {
    title: `Nipo Lavanderia - Agendamento das Máquinas de Lavar`,
    description: `Sistema inteligente de agendamento e confirmação das máquinas de lavar da república.`,
    author: `@edgar`,
    siteUrl: `https://aesthetic-daffodil-24b59a.netlify.app`,
  },
  plugins: [
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Nipo Lavanderia - Máquinas de Lavar`,
        short_name: `Nipo Lavanderia`,
        start_url: `/`,
        background_color: `#0B132B`,
        theme_color: `#00B4D8`,
        display: `standalone`,
        icon: `static/icon.jpg`,
      },
    },
  ],
}
