import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import io from 'socket.io-client';
import { useState, useEffect } from 'react';
function App() {
  //connection to server
  const socket = io.connect("http://localhost:3001");
  //states
  const [receivedMessage, setReceivedMessage] = useState("");
  const [message, setMessage] = useState("");
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);

  //event handlers
  const handleFrom = (e) => {
    setFrom(e.target.value);
  }
  const handleTo = (e) => {
    setTo(e.target.value);
  }
  const sendMessage = (e) => {
    e.preventDefault();
    console.log("sending")
    socket.emit("send_message", {
      room: to,
      message
    })
  }
  const handleMessage = (e) => {
    setMessage(e.target.value);
  }

  //effects
  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log("receiving");
      setReceivedMessage(data);
    });
  }, [socket]);

  useEffect(() => {
    console.log("join",from)
    socket.emit("join_room", from)
  }, [from]);

  return (
    <div className="d-flex justify-content-evenly align-items-center flex-column">
      <div className="row w-50">
        <div className="col-6">
          <h3>From {from}</h3>
          {
            [...Array(3).keys()].map(i => {
              return (
                <div key={i}>
                  <input className="form-check-input" type="radio" name="from" id="flexRadioDefault1" value={i + 1} onClick={handleFrom} />
                  <label className="form-check-label" htmlFor="flexRadioDefault1" >
                    {i + 1}
                  </label>
                </div>
              )
            })
          }
        </div>
        <div className="col-6">
          <h3>To {to}</h3>
          {
            [...Array(3).keys()].map(i => {
              return (
                <div key={i}>
                  <input className="form-check-input" type="radio" name="to" id="flexRadioDefault1" value={i + 1} onClick={handleTo} />
                  <label className="form-check-label" htmlFor="flexRadioDefault1" >
                    {i + 1}
                  </label>
                </div>
              )
            })
          }
        </div>
      </div>
      <div className="input-group my-5 w-50">
        <input type="text" className="form-control" placeholder="message" onChange={handleMessage} value={message} />
        <button className="btn btn-outline-success fs-5" type="button" onClick={sendMessage}><i className="bi bi-send"></i></button>
      </div>
      <div>
        {receivedMessage}
      </div>
    </div>
  );
}

export default App;
