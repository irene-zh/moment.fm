"""
Takes in a CSV of genre and cleans them to list the first artist and artist
id only.
"""
import pandas as pd

path = 'artists.csv'
data = pd.read_csv(path)

df = pd.DataFrame(data)
first_genres= []


for x in df['genres']:
    if len(x) < 3:
        first_genres.append('null')
    else:
        first_genres.append(x[2:len(x)-2].split('\', \'')[0])

df['first_genres'] = first_genres

df.to_csv("artists_modified.csv")
