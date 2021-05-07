import spotipy
import sys
from spotipy.oauth2 import SpotifyClientCredentials
import pandas as pd
from bs4 import BeautifulSoup
import requests

#connect to URL
#https://medium.com/swlh/how-to-leverage-spotify-api-genius-lyrics-for-data-science-tasks-in-python-c36cdfb55cf3

cid = "67f61ec9b74f4051bd316ce2c391e199"
secret = ""

client_cred_manager = SpotifyClientCredentials(client_id=cid, client_secret=secret)
sp = spotipy.Spotify(client_credentials_manager=client_cred_manager)

path = 'tracks_modified.csv'
data = pd.read_csv(path)

tracks = pd.DataFrame(data)

#function to scrape lyrics from genius
def scrape_lyrics(artistname, songname):
    artistname2 = str(artistname.replace(' ','-')) if ' ' in artistname else str(artistname)
    songname2 = str(songname.replace(' ','-')) if ' ' in songname else str(songname)
    page = requests.get('https://genius.com/'+ artistname2 + '-' + songname2 + '-' + 'lyrics')
    html = BeautifulSoup(page.text, 'html.parser')
    lyrics1 = html.find("div", class_="lyrics")
    lyrics2 = html.find("div", class_="Lyrics__Container-sc-1ynbvzw-2 jgQsqn")
    print(artistname2)
    if lyrics1:
        lyrics = lyrics1.get_text()
    elif lyrics2:
        lyrics = lyrics2.get_text()
    elif lyrics1 == lyrics2 == None:
        lyrics = None
    return lyrics

def lyrics_df(df1):
    lyrics = []
    for id,artist in df1.itertuples(index=False):
        temp = scrape_lyrics(artist,id)
        lyrics.append(temp)
        print(id, temp)
    return df1

tracks_df['lyrics'] = lyrics_df(tracks_df)
tracks_df.to_csv('tracks_with_lyrics')
