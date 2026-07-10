CREATE TABLE influencers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  niche VARCHAR(50),
  followers INT,
  engagement_rate FLOAT
);

INSERT INTO influencers (name, niche, followers, engagement_rate)
VALUES ('FoodieKL', 'F&B', 120000, 8.2),
       ('BeautyGlow', 'Beauty', 95000, 10.1);
