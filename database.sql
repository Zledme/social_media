--CREATE DATABASE socialmedia;


CREATE TABLE users(
    user_id UUID DEFAULT uuid_generate_v4(),
    email varchar(32) NOT NULL,
    pass varchar(32) NOT NULL,
    user_name varchar(32) NOT NULL,
    followers integer,
    following integer,
    PRIMARY KEY (user_id)
);

CREATE TABLE follows(
    follower_id UUID PRIMARY KEY,
    following_id UUID,
    FOREIGN KEY (follower_id)
    REFERENCES users(user_id)
);

CREATE TABLE posts(
    post_id SERIAL,
    user_id UUID, 
    title varchar(25),
    description varchar(1000),
    created_at timestamp,
    likes integer,
    PRIMARY KEY (post_id),
    FOREIGN KEY (user_id)
    REFERENCES users(user_id)
);

CREATE TABLE comments(
    comment_id SERIAL,
    post_id integer,
    comment varchar(1000),
    PRIMARY KEY (comment_id),
    FOREIGN KEY (post_id)
    REFERENCES posts(post_id)
);


INSERT INTO users (email, pass, user_name,followers, following) VALUES ('helloauth@gmail.com', 'heyauth','user1', 0, 0);
INSERT INTO users (email, pass, user_name,followers, following) VALUES ('helloauthe@gmail.com', 'heyauthe','user2' ,0, 0);
