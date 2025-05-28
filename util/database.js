import Database from "better-sqlite3";

const db = new Database('./data/database.sqlite')

db.prepare(`CREATE TABLE IF NOT EXISTS blogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    szerzo STRING,
    cim STRING,
    kategoria STRING,
    content STRING,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
    )`).run()

export const getAllBlog = () => db.prepare(`SELECT * FROM blogs`).all()
export const getBlogById = (id) => db.prepare(`SELECT * FROM blogs WHERE id = ?`).get(id)
export const createBlog = (szerzo, cim, kategoria, content) => {
    const now = new Date().toISOString();
    return db.prepare(`INSERT INTO blogs (szerzo, cim, kategoria, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`).run(szerzo, cim, kategoria, content, now, now)
}
export const updateBlog = (id, szerzo, cim, kategoria, content) => {
    const now = new Date().toISOString();
    db.prepare(`UPDATE blogs SET szerzo = ?, cim = ?, kategoria = ?, content = ?, updated_at = ? WHERE id = ?`).run(szerzo, cim, kategoria, content, now, id);
}
export const deleteBlog = (id) => db.prepare(`DELETE FROM blogs WHERE id = ?`).run(id)

const blogs = [
    {szerzo: 'Aby Gord', cim: 'How to make a fried egg', kategoria: 'Food', content: 'Ez Ann első technológiai bejegyzése.' },
    {szerzo: 'Aby Gord', cim: 'What is my favorite silverwear', kategoria: 'Food', content: 'Ez Ann életéről szóló második bejegyzése.' },
    {szerzo: 'Brick Bob', cim: 'A legmagasabb lego szett', kategoria: 'Toys', content: 'Bob kedvenc játékairól szóló posztja.' },
    {szerzo: 'Brick Bob', cim: 'Egy elfeledett lego szett kategória', kategoria: 'Toys', content: 'Bob tapasztalatai a programozásban.' },
    {szerzo: 'Cleo Cloe', cim: 'Első alkalmam Párizsban', kategoria: 'Travel', content: 'Cloe utazási élményei Európából.' },
    {szerzo: 'Cleo Cloe', cim: 'Ezt vidd mindig magaddal, ha utazol', kategoria: 'Travel', content: 'Cloe kedvenc receptjei és ételei.' }
];

const insertBlogs = db.prepare(`
  INSERT INTO blogs (szerzo, cim, kategoria, content, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?)
`);

// const existingBlogs = db.prepare('SELECT COUNT(*) AS count FROM blogs').get().count;
// if (existingBlogs === 0) {
//   const now = new Date().toISOString();
//   blogs.forEach(blog => insertBlogs.run(
//     blog.szerzo,
//     blog.cim,
//     blog.kategoria,
//     blog.content,
//     now,
//     now
//   ));
// }

//for (const blog of blogs) createBlog(blog.szerzo, blog.cim, blog.kategoria, blog.content)