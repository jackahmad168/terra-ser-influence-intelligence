import pandas as pd
from sklearn.linear_model import LinearRegression

data = {
    'followers': [50000, 100000, 150000],
    'engagement': [5.2, 7.8, 9.1],
    'views': [200000, 500000, 800000]
}
df = pd.DataFrame(data)

X = df[['followers', 'engagement']]
y = df['views']

model = LinearRegression()
model.fit(X, y)

new_influencer = [[120000, 8.5]]
predicted_views = model.predict(new_influencer)
print(f"Predicted campaign reach: {int(predicted_views[0])} views")
