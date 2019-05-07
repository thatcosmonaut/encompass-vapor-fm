import { StringHelper } from "./string";

interface IIcecastSongData {
  artistName: string;
  songName: string;
}
interface IIcecastResponse {
  icestats: { source: { title: string } };
}

export class IcecastHelper {
  public static getSongData(successCallback: (data: IIcecastSongData) => any) {
    const xhr = new XMLHttpRequest();
    xhr.timeout = 2000;
    xhr.open("GET", "https://vapor.fm:8000/status-json.xsl");
    xhr.onload = () => {
      if (xhr.status === 200) {
        const songData = (JSON.parse(xhr.response) as IIcecastResponse).icestats
          .source.title;
        successCallback(IcecastHelper.parseSongData(songData));
      } else {
        console.log("Icecast request failed. Returned status: " + xhr.status);
      }
    };
    xhr.send();
  }

  public static parseSongData(songData: string): IIcecastSongData {
    let artistName = "";
    let songName = "";

    if (StringHelper.countOccurrences(songData, " - ") < 1) {
      artistName = "you are tuned in";
      songName = "to vapor fm";
    } else if (StringHelper.countOccurrences(songData, " - ") === 1) {
      artistName = songData.split(" - ")[0];
      songName = songData.split(" - ")[1];
    } else {
      const artistSubStringLocation = StringHelper.nthOccurrence(
        songData,
        " - ",
        1
      );
      const songSubStringLocation = StringHelper.nthOccurrence(
        songData,
        " - ",
        2
      );
      artistName = songData.substring(
        artistSubStringLocation + 3,
        songSubStringLocation
      );
      songName = songData.substring(songSubStringLocation + 3, songData.length);
    }

    return { artistName, songName };
  }
}
