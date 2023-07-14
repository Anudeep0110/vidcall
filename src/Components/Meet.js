import React ,{useState,useRef,useEffect} from 'react'
import Peer from 'simple-peer'
import io from 'socket.io-client'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {FiVideoOff} from 'react-icons/fi'
import {BsMicMute , BsRecordCircle} from 'react-icons/bs'
import {FcEndCall} from 'react-icons/fc'
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
} from 'mdb-react-ui-kit';


const socket = io.connect('http://localhost:5000');

const Meet = () => {

  const [ me, setMe ] = useState("Meet ID")
	const [ stream, setStream ] = useState()
	const [ receivingCall, setReceivingCall ] = useState(false)
	const [ caller, setCaller ] = useState("")
	const [ callerSignal, setCallerSignal ] = useState()
	const [ callAccepted, setCallAccepted ] = useState(false)
	const [ idToCall, setIdToCall ] = useState("")
	const [ callEnded, setCallEnded] = useState(false)
	const [ name, setName ] = useState("Anudeep")
	const myVideo = useRef(null)
	const userVideo = useRef(null)
	const connectionRef = useRef(null)

  useEffect(() => {
		navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      setStream(stream);
      if (myVideo.current) {
        myVideo.current.srcObject = stream;
      }
    });

	socket.on("me", (id) => {
			setMe(id)
		})

		socket.on("callUser", (data) => {
			setReceivingCall(true)
			setCaller(data.from)
			setName(data.name)
			setCallerSignal(data.signal)
		})
	}, [])

	const callUser = (e,id) => {
		const peer = new Peer({
			initiator: true,
			trickle: false,
			stream: stream
		})
		peer.on("signal", (data) => {
			socket.emit("callUser", {
				userToCall: id,
				signalData: data,
				from: me,
				name: name
			})
		})
		peer.on("stream", (stream) => {
			
				userVideo.current.srcObject = stream
			
		})
		socket.on("callAccepted", (signal) => {
			setCallAccepted(true)
			peer.signal(signal)
		})

		connectionRef.current = peer
	}

	// const answerCall =() =>  {
	// 	setCallAccepted(true)
  //   setCentredModal(false)
	// 	const peer = new Peer({
	// 		initiator: false,
	// 		trickle: false,
	// 		stream: stream
	// 	})
	// 	peer.on("signal", (data) => {
	// 		socket.emit("answerCall", { signal: data, to: caller })
	// 	})
	// 	peer.on("stream", (stream) => {
	// 		userVideo.current.srcObject = stream
	// 	})

	// 	peer.signal(callerSignal)
	// 	connectionRef.current = peer
	// }

  const answerCall = () => {
    setCallAccepted(true);
    setCentredModal(false);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });
    peer.on("stream", (stream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    });
  
    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

	const leaveCall = () => {
		setCallEnded(true)
		connectionRef.current.destroy()
	}

  const [centredModal, setCentredModal] = React.useState(false);
  const toggleShow = () => setCentredModal(!centredModal);


  return (
    <>
        <div className='meet'>
            <div className='videos-outer'>
              <div className='meet-details'>
                <p className='meet-id'>Meet-ID : 
                <CopyToClipboard text={me} style={{ marginBottom: "2rem" }}>
                  <p>{me}</p>
                </CopyToClipboard>
                </p>
                <form onSubmit={(e) => callUser(e,idToCall)}>
                  <div className='calling-form'>
                      <input type='text' className='calling-input' placeholder='caller-id' onChange={e => setIdToCall(e.target.value)}></input>
                      <button className='btn btn-success' onClick={(e) => callUser(e,idToCall)}>Call</button>
                  </div>
                </form>
              </div>
              <div className='videos'>
                <div className="video ">
                  {stream &&  <video playsInline muted ref={myVideo} autoPlay style={{ width: "100%" }} />}
                </div>
                <div className="video ">
                  {callAccepted && !callEnded ?
                  <video playsInline ref={userVideo} autoPlay style={{ width: "100%"}} />:
                  null}
                </div>
              </div>
              <div className='video-footer'>
                    <button className='icon-div'><FiVideoOff className='text-dark'/></button>
                    <button className='icon-div'><BsMicMute className='text-dark'/></button>
                    <button className='icon-div'><BsRecordCircle className='text-dark'/></button>
                    <button className='icon-div' onClick={leaveCall}><FcEndCall className='text-light'/></button>
              </div>
            </div>
        </div>
        {
          <MDBModal tabIndex='-1' show={receivingCall && centredModal} setShow={setReceivingCall}>
            <MDBModalDialog centered>
              <MDBModalContent>
                <MDBModalHeader>
                  <MDBModalTitle>Caller Info</MDBModalTitle>
                  <MDBBtn className='btn-close' color='none' onClick={toggleShow}></MDBBtn>
                </MDBModalHeader>
                <MDBModalBody>
                    <p className='instant-meet'>{name} is Calling...</p>
                    <div className='line'></div>
                    <div className='w-100 text-center p-4' onClick={answerCall}><button className='btn btn-success'>Answer</button></div>
                </MDBModalBody>
              </MDBModalContent>
            </MDBModalDialog>
          </MDBModal>
        }
    </>
  )
}

export default Meet