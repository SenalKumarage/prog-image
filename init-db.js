db.auth('admin', 'password');
db = db.getSiblingDB('progimgdb');
db.createUser({
  user: 'progimg',
  pwd: 'admin',
  roles: [
    {
      role: 'readWrite',
      db: 'progimgdb',
    },
  ],
});
