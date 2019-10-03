const Sequelize = require('sequelize');
const conn = new Sequelize('postgres://localhost/my_new_db');

const Parent = conn.define('parent',{
  id: {
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
    type: Sequelize.UUID
  },
  name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  }
})

const Page = conn.define('page',{
  title: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  }
})

Page.findHomePage = function(){

  return this.findOne({where:{title:'Home Page'}});
};

const mapAndSave = (pages) => Promise.all(pages.map( page => Page.create(page)));

const syncAndSeed = async() => {
  await conn.sync( {force: true});
  const joe = await Page.create({title: 'Joe is cool'});
  const moe = await Page.create({title: 'Moe is copying'});
  const boe = await Page.create({title: 'Boe has a hat'});
  const home = await Page.create({ title: 'Home Page'});

  let pages = [
    {title: 'About', parentId: home.id},
    {title: 'Contact', parentId: home.id}
  ];
  const [about, contact] = await mapAndSave(pages);

};

syncAndSeed().then(async() =>{
  const home = await Page.findHomePage();

  console.log("**************");
  console.log(home.title);
  console.log("**************");


} );
