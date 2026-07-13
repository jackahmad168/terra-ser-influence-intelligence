CREATE TABLE influencers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  niche VARCHAR(50),
  followers INT,
  engagement_rate FLOAT
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE campaigns (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255),
  niche VARCHAR(50),
  budget DECIMAL(10, 2),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO influencers (name, niche, followers, engagement_rate)
VALUES ('FoodieKL', 'F&B', 120000, 8.2),
       ('BeautyGlow', 'Beauty', 95000, 10.1);

-- Demo user: email=demo@test.com, password=demo123 (hashed)
INSERT INTO users (email, password, name)
VALUES ('demo@test.com', '$2a$10$X.X.X.X.X.X.X.X.X.X.X.XGkLPqQqQqQqQqQqQqQqQ', 'Demo User');
