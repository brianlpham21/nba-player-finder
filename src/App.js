import axios from 'axios';
import React, { useState } from 'react';
import './App.css';
import Cards from './Cards';
import ReactPlayer from 'react-player';
import Modal from 'react-modal';


export default function App() {

  const [dataPlayer, setDataPlayer] = useState([]);
  const [dataPic, setDataPic] = useState([]);
  const [search, setSearch] = useState([]);
  const [dropdown, setDropdown] = useState(false)
  const [video, setVideo] = useState([]);
  const [modalOpen, setModalOpen] = useState(false)


  // const handleSubmit = (e) => {

  //   e.preventDefault();
  //   fetchData();

  // }

  const handleChange = (e) => {

    const { value } = e.target

    axios.get(`https://www.balldontlie.io/api/v1/players?search=${value}`)
      .then(async res => {
        if (value.length >= 2) {
          setSearch(res.data.data)
          setDropdown(true)
        }
      })
  }


  const handleClick = (e) => {
    e.preventDefault();
    const value = e.target.innerText
    let clicked = null
    for (let i = 0; i < search.length; i++) {
      clicked = search[i].first_name + " " + search[i].last_name;
      console.log(value, clicked)
      if (value === clicked) {
        setDataPlayer(search[i])
        let playerMod = value.split(' ').reverse().join('/')
        fetchData(playerMod)
      }

    }
    setDropdown(false)
    fetchYouTube(clicked);
  }
  // console.log(dataPlayer)
  // const handleChange = (e) => {
  //   let replace = e.target.value.split(" ").join("_")

  //   setPlayerName(replace)
  //   if (replace.length > 0) {
  //     setPlayerName(replace);
  //     console.log(playerName)
  //   }
  //   else {
  //     alert("please type player name")
  //   }
  //   let playerMod = e.target.value.split(' ').reverse().join('/')
  //   setPlayerPic(playerMod)
  // }

  const fetchData = (pic) => {

    axios.get(`https://nba-players.herokuapp.com/players/${pic}`)
      .then(async res => {
        if (res.data === "Sorry, that player was not found. Please check the spelling.") {
          setDataPic("images/kobe-logo-sq.jpg")
        } else {
          setDataPic(res.config.url)
        }
      }).catch(err => {
        console.log(err);
      })

    // const playerAPI = `https://www.balldontlie.io/api/v1/players?search=${playerName}`;
    // const playerPicAPI = `https://nba-players.herokuapp.com/players/${playerPic}`;
    // const getPlayer = axios.get(playerAPI);
    // const getPic = axios.get(playerPicAPI);


    // axios.all([getPlayer, getPic]).then(
    //   axios.spread((...allData) => {

    // if (allData[0].data.data[0] === undefined) {
    //   alert("player injured")
    // }
    // else if (allData[0].data.data.length > 1) {
    //   alert("specify name more")
    //   allData[0].data.data = null;
    // }
    // getStats(allData[0].data.data[0].id)

    // const allDataPlayer = allData[0].data.data[0]
    // const getNBAPlayerPic = allData[1].config.url

    // setDataPlayer(allDataPlayer);
    // setDataPic(getNBAPlayerPic)

    // })
    // )

  }
  const fetchYouTube = (name) => {
    axios.get(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${name}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}&maxResults=1`)
      .then(async res => {
        // console.log("metainfo", res.data.items, "selectedVideo",res.data.items[0].id.videoId)
        setVideo(res.data.items[0])
      }).catch(err => {
        console.log(err)
      })
  }
  console.log(video)
  const { id = {}, snippet = {} } = video;

  const { title, thumbnails = {} } = snippet;
  // console.log("snippet", snippet)
  const { medium = {} } = thumbnails;
  return (
    <div>
      <header>
        <div className="d-flex">
          <img src="images/kobe-logo-sq.jpg" className="logo" />
          {/* <form onSubmit={handleSubmit}> */}
          <form>
            <div className="has-search">
              <span className="fa fa-search form-control-feedback"></span>
              <input type="text"
                className="form-control"
                placeholder="Search Player"
                onChange={handleChange} />
              {dropdown && search?.length > 0 &&
                <div className="dropdown-list p-2">
                  {search?.map((el, i) =>
                    <div key={i} className="fa fa-search d-flex p-1">
                      <div className="ml-1 name-list" onClick={handleClick} value={el.first_name}>
                        {el.first_name} {el.last_name}
                      </div>
                    </div>
                  )}
                </div>}
              {/* <input type="text"
                className="form-control"
                placeholder="Search Player"
                onChange={handleChange} /> */}
            </div>
          </form>
        </div>
      </header>
      <div className="App">
        <Modal isOpen={modalOpen}
          onRequestClose={() => { setModalOpen(false) }}
          style={
            {

              content: {
                top:'100px',
                left: '10px',
                right: '10px',
                bottom:'100px',
                padding: '8px'
              }
            }
          }>
          <div className="d-flex p-2"><h5>{title}</h5>
            <i class="fas fa-times" onClick={() => { setModalOpen(false) }}></i></div>
          <div className="p-2">
            <ReactPlayer width='320px' height='440px' controls url={`https://www.youtube.com/watch?v=${id.videoId}`} />
          </div>

        </Modal>
        <div>
          <Cards dataPlayer={dataPlayer}
            dataPic={dataPic}
          />
        </div>
        <div className="tv-container">
          <img className="tv" src="images/nba-tv.png" alt="tv" />
        </div>
        <div className="video"> {
          video.length === 0 ? <img src="images/youtube-logo.png" alt="tube-log" /> :
            <div onClick={() => {
              setModalOpen(true)
            }}>
              <img src={medium.url} alt="video-thumbnail" />
              <h3 className="video-title">{title}</h3>
            </div>
          // <a href={`https://www.youtube.com/watch?v=${id.videoId}`}>
          // <img src={medium.url} alt="video-thumbnail"/>
          //   <div className="">
          // <h3 className="video-title">{title}</h3>
          // </div>
          //   </a>
        }
        </div>
      </div>
    </div>
  );
}


/*
export default function App() {

  const [playerName, setPlayerName] = useState("");
  const [playerPic, setPlayerPic] = useState([]);
  const [playerStats, setPlayerStats ] = useState({});
  const [data, setData] = useState([]);
  const [picName, setPicName] = useState([]);


  const handleSubmit = (e) => {

    e.preventDefault();
    fetchData();
    getStats();
  }

  const handleChange = (e) => {
    let replace = e.target.value.split(" ").join("_")

    setPlayerName(replace)
    if (replace.length > 0) {
      setPlayerName(replace);
      // console.log(playerName)
    }
    else {
      alert("please type player name")
    }
     let playerMod = e.target.value.split(' ').reverse().join('/')

    setPicName(playerMod)
  }

  const team = playerName && playerName.team ? playerName.team.full_name : null;

  console.log(picName)
  const fetchData = () => {

    console.log(picName)
    // const playerAPI = `https://www.balldontlie.io/api/v1/players?per_page=10`;
    const playerAPI = `https://www.balldontlie.io/api/v1/players?search=${playerName}`;
    const playerPicAPI = `https://nba-players.herokuapp.com/players/${picName}`;


    const getPlayer = axios.get(playerAPI);
    const getPic = axios.get(playerPicAPI);



    axios.all([getPlayer, getPic]).then(
      axios.spread((...allData) => {

      if(allData[0].data.data[0] === undefined) {
        alert("player injured")
      }
      else if(allData[0].data.data.length > 1) {
         alert("specify name more")
         allData[0].data.data = null;
       }
     getStats(allData[0].data.data[0].id)
      //  await getStats()
       const allDataPlayer = allData[0].data.data
      //  /*const allDataPlayer = allData[0].data.data[0]*/
//       const getNBAPlayerPic = allData[1].config.url

//       setData(allDataPlayer);
//       setPlayerPic(getNBAPlayerPic)


//     })
//   ).catch(err => {
//     console.log(err);
//   })
// }

// const getStats = ( playerId) => {
//   axios.get(`https://www.balldontlie.io/api/v1/season_averages?season=2018&player_ids[]=${playerId}`)
//   .then(async res => {

//     setPlayerStats(res.data.data[0])
//   }).catch(err => {
//     console.log(err)
//   })
// }

// const handleInput = () => {
//   console.log(data.first_name)
// }


// useEffect(() => {
//   fetchData()
// }, [])


// console.log(playerName)
//   // const team = playerName && playerName.team ? playerName.team.full_name : null;

// console.log(data[0])
// console.log(playerPic)
//   return (
//     <div>
//       <header>
//         <div className="d-flex">
//           <img src="images/kobe-logo-sq.jpg" className="logo" />
//           <form>
//           {/* <form onSubmit={handleSubmit}> */}
//             <div className="has-search">
//               <span className="fa fa-search form-control-feedback"></span>
//               <input type="text" className="form-control" placeholder="Search Player..." onChange={handleChange} />
//               <div className="search-list pl-3">
//                 {data.filter((val) => {
//                   if(playerName === "") {
//                     return val;
//                   } else if(val.first_name.toLowerCase().includes(playerName.toLowerCase())) {
//                     return val
//                     console.log(val)
//                   }
//                 }).map((val, key) => {
//                   return <div className="fa fa-search d-flex pt-1"
//                               key={key}
//                               onClick={()=> {setPlayerName(val.first_name)}}>

//                     <p className="player-list pl-1">{val.first_name} {val.last_name}</p></div>
//                 })}
//               </div>

//             </div>
//           </form>
//          </div>
//       </header>
//       <div className="App">
//         <div className="maincontainer m-auto pt-3">
//           <div className="thecard">
//             <div className="thefront py-3">
//               <Card className="m-auto" style={{ width: '18rem' }}>
//                 <Card.Img variant="top" src={playerPic} />
//                 <Card.Body>
//                   <Card.Title>{}</Card.Title>
//                   <Card.Text>
//                     {team}
//                     <i className="fas fa-basketball-ball p-1"></i>

//                     {playerName["position"]}
//                     <br />
//                     {playerName["height_feet"]}'{playerName["height_inches"]}
//                     <i className="fas fa-basketball-ball p-1"></i>
//                     {playerName["weight_pounds"]}lbs
//                   </Card.Text>
//                 </Card.Body>
//               </Card>
//             </div>
//             <div className="theback">
//               <div className="mt-2">
//                 <input />
//               </div>

//               <div className="text-center card mt-5">
//                 season: {playerStats.season}
//                 <br/>
//                 games played : {playerStats.games_played}
//                 <br />
//                 PPG : {playerStats.pts}
//                 <br />
//                 AST : {playerStats.ast}
//                 <br />
//                 REB : {playerStats.reb}

//               </div>

//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }





{/* <form onSubmit={handleSubmit}>
        <label>
    Player Name
          <input
          type ="text"
          // value={playerName}
          onChange={e => handleChange(e)}
           placeholder="enter player name"
          />
        </label>
        <br/>
        <label>
    season
        <input
        type="text"

        placeholder="enter year"
        />
        </label>
        <input
        type="submit"
        value="Submit"/>
      </form>

        season : {playerStats["season"]}
        <br/>
        games played : {playerStats["games_played"]}
        <br/>
      PPG : {playerStats["pts"]} */}


        // const getPlayerId = () => {
  //   axios.get(`https://www.balldontlie.io/api/v1/players?search=lebron`)
  //   .then(async res => {
  //     console.log(res.data.data)
  //     if(res.data.data[0] === undefined) {
  //       alert("Player is injured")
  //     } else if(res.data.data.length > 1) {
  //       alert("Specify name more")
  //     }
  //   else {

  //       await getStats(res.data.data[0].id)
  //     }

  //   }).catch(err => {
  //     console.log(err)
  //   })
  // }

  // const getStats = ( playerId) => {
  //   axios.get(`https://www.balldontlie.io/api/v1/season_averages?seasons[]=2018&seasons[]=2015&player_ids[]=${playerId}`)
  //   .then(async res => {
  //     console.log(res.data.data)
  //     setPlayerStats(res.data.data[0])
  //   }).catch(err => {
  //     console.log(err)
  //   })
  // }

  // useEffect(() => {
  //   getPlayerId();

  // })
