"""
Takes in a CSV of tracks and cleans artist to list the first artist and artist
id only.
"""
import pandas as pd

path = 'tracks.csv'
data = pd.read_csv(path)

df = pd.DataFrame(data)
first_artist_arr = []
first_artist_id_arr = []


for x in df['artists']:
    first_artist_arr.append(x[2:len(x)-2].split('\', \'')[0])
for y in df['id_artists']:
    first_artist_id_arr.append(y[2:len(y)-2].split('\', \'')[0])

df['first_artists'] = first_artist_arr
df['first_artist_ids'] = first_artist_id_arr

df.to_csv("tracks_modified.csv")
