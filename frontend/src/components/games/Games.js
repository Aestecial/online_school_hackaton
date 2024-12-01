import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import './games.css'

const Games = () => {
  const { gameName } = useParams();
  const [url, setUrl] = useState(null);

  useEffect(() => {
    switch (gameName) {
      case 'flexfroggy':
        setUrl("http://flexboxfroggy.com/#ru");
        break;
      case "flexbox-defence":
        setUrl("http://www.flexboxdefense.com");
        break;
      case "untrusted":
        setUrl("https://untrustedgame.com");
        break;
      case "grid-garden":
        setUrl("https://cssgridgarden.com/#ru");
        break;
      case "crunchzilla":
        setUrl("https://www.crunchzilla.com/");
        break;
      case "return-true-to-win":
        setUrl("https://returntrue.win");
        break;
      case "python-challenge":
        setUrl("http://www.pythonchallenge.com/pc/def/0.html");
        break;
      case "elevator-saga":
        setUrl("http://play.elevatorsaga.com");
        break;
      case "bitburner":
        setUrl("https://bitburner-official.github.io");
        break;
      case "snake-game":
        setUrl("https://devayin.ru/games/snake");
        break;
        default:
            console.log(gameName)
            console.log(url)
        setUrl(null);
    }
  }, [gameName]);

    if (url == null) {
      console.log(url)
    return <div>not found</div>;
    } 

  return (
    <div className='ide_section'>
            <div className='ide_content'>
                <iframe
                    src={url}
                    title="game"
                    width="100%"
                    height="100%"
                    style={{ border: "none" }}
                />
            </div>
    </div>
  );
};

export default Games;