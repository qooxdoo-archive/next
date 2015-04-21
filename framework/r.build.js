{
  appDir: 'source/class',
  baseUrl: '.',
  paths: {
    app: '.'
  },
  dir: 'build-module',
  modules: [

    {
      name: 'qx/module/Core',
      include: ['qx/module/Core']
    },
    {
      name: 'qx/module/Animation',
      include: ['qx/module/Animation'],
      exclude: ['qx/module/Core']
    }
  // {
  //   name: 'qxWeb',
  //   include: ['qxWeb']
  // },
  //
  // {
  //   name: 'qx/module/Css',
  //   include: ['qx/module/Css'],
  //   exclude: ['qxWeb']
  // },
  //
  // {
  //   name: 'qx/module/Attribute',
  //   include: ['qx/module/Attribute'],
  //   exclude: ['qxWeb']
  // },
  //
  // {
  //   name: 'qx/module/Io',
  //   include: ['qx/module/Io'],
  //   exclude: ['qxWeb', 'qx/module/Event']
  // },
  //
  // {
  //   name: 'qx/module/Event',
  //   include: ['qx/module/Event'],
  //   exclude: ['qxWeb']
  // },
  //
  // {
  //   name: 'qx/module/Dataset',
  //   include: ['qx/module/Dataset'],
  //   exclude: ['qxWeb']
  // }
  ]
}
