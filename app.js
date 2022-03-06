require('dotenv').config()
const express = require('express');
const res = require('express/lib/response');
const jwt = require('jsonwebtoken')
const cors = require('cors')

const pool = require('./db')
const PORT = process.env.PORT || 5000;


const app = express();



app.use(express.json());
app.use(cors());


//for authentication
function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization'];
    const token = authHeader;

    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403);
        req.user = user;
        next();
    });
   
};

//perform user authentication and return a JWT token.
app.post('/api/authenticate',async (req, res) =>{
    const {email, pass} = req.body;
    console.log("hello")
    const user = await pool.query("SELECT * FROM users WHERE email = $1",
    [email]
    );
    console.log("its here")
    res.send("hello")

    if (user.rows.length === 0 || pass != user.rows[0].pass) {
         return res.status(401).json("Password or Email is incorrect");
    }


    const Token = jwt.sign(JSON.stringify(user) , process.env.ACCESS_TOKEN_SECRET);
    res.json({ Token: Token });

});



// authenticated user would follow user with id
app.post('/api/follow/:id',authenticateToken, async (req, res)=>{
    const { id } = req.params;
    const follows = await pool.query("INSERT INTO follows VALUES ($1,$2)",
    [req.user.rows[0].user_id,id]
    );
    const incfollow = await pool.query("UPDATE users SET followers = followers + 1 WHERE user_id = $1",[id]);
    const incfollowing = await pool.query("UPDATE users SET following = following + 1 WHERE user_id = $1",[req.user.rows[0].user_id]);
    res.send();
});


// authenticated user would unfollow a user with id
app.post('/api/unfollow/:id',authenticateToken,async (req, res)=>{
    const { id } = req.params;
    const follows = pool.query("DELETE FROM follows VALUES WHERE follower_id = $1 AND following_id = $2",
    [req.user.rows[0].user_id,id]
    );
    const decfollow = pool.query("UPDATE users SET followers = followers - 1 WHERE user_id = $1",[id]);
    const decfollowing = pool.query("UPDATE users SET following = following - 1 WHERE user_id = $1",[req.user.rows[0].user_id]);
    res.send();
});





// authenticate the request and return the respective user profile
app.get('/api/user', authenticateToken,async (req,res)=>{
    res.json({user_name: req.user.rows[0].user_name,followers:req.user.rows[0].followers,following: req.user.rows[0].following});
});




//add a new post created by the authenticated user
app.post('/api/posts',authenticateToken,async (req,res)=>{
    const {title,description} = req.body;
    const posts = await pool.query("INSERT INTO posts(user_id, title, description,created_at,likes) VALUES($1,$2,$3,(now() at time zone 'utc'),0) RETURNING post_id, title, description, created_at",
    [req.user.rows[0].user_id,title,description]
    );
    res.json(posts.rows[0])
});



//delete post with id created by the authenticated user
app.delete('/api/posts/:id' , authenticateToken, async (req,res)=>{
    const {id} = req.params;
    const postremove = await pool.query("DELETE FROM posts WHERE post_id = $1",[id])
    res.send();
})






//like the post with id by the authenticated user
app.post('/api/like/:id',authenticateToken,async (req,res)=>{
    const {id} = req.params;
    const likes = await pool.query("UPDATE posts SET likes = likes + 1 WHERE post_id = $1",[id]);
    res.send();
});

//unlike the post with id by the authenticated user
app.post('/api/unlike/:id',authenticateToken,async (req,res)=>{
    const {id} = req.params;
    const unlikes = await pool.query("UPDATE posts SET likes = likes - 1 WHERE post_id = $1" ,[id]);
    res.end();
});






//add comment for post with id by the authenticated user
app.post('/api/comment/:id',authenticateToken,async (req, res)=>{
    const {id} = req.params;
    const {comment} = req.body;
    const comments = await pool.query("INSERT INTO comments (post_id,comment) VALUES($1,$2) RETURNING comment_id",
    [id,comment]
    ); 

    res.json(comments.rows[0]);
});


//return a single post with {id} populated with its number of likes and comments
app.get('/api/posts/:id',async (req,res)=>{
    const {id} = req.params;
    const post = await pool.query("SELECT * FROM posts WHERE post_id = $1",[id]);
    const comments = await pool.query("SELECT comment FROM comments WHERE post_id = $1",[id]);
    res.json({post: post.rows[0], comments:comments.rows})
});

//return all posts created by authenticated user sorted by post time

app.get('/api/all_posts',authenticateToken,async (req,res)=>{
    const posts = await pool.query("SELECT posts.post_id, posts.title,posts.description, posts.created_at, array_agg(comments.comment) as comments,posts.likes FROM posts INNER JOIN comments on posts.post_id = comments.post_id WHERE user_id = $1 GROUP BY posts.post_id;",[req.user.rows[0].user_id]);

    res.send(posts.rows[0]);
})

app.get("*", (req,res) => {
    res.status(400);
})

app.listen(PORT, () => {
    console.log("server is starting on port");
});