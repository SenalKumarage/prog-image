db.createUser({
  user: 'progImgAdmin',
  pwd: 'admin',
  roles: [
    {
      role: 'read',
      db: 'progimgdb',
    },
    {
      role: 'dbAdmin',
      db: 'progimgdb',
    },
  ],
});
