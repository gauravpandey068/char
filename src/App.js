import React, { useState, useRef } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import {useAuthState} from 'react-firebase-hooks/auth'
import {useCollectionData} from 'react-firebase-hooks/firestore'

firebase.initializeApp({
    apiKey: "AIzaSyCTU3ksVGty6WT5b5QLw3HsVSf7pN3BmGk",
    authDomain: "chat-172bc.firebaseapp.com",
    projectId: "chat-172bc",
    storageBucket: "chat-172bc.appspot.com",
    messagingSenderId: "1045860406198",
    appId: "1:1045860406198:web:a8575984d142bf9a60e717",
    measurementId: "G-GHWQFHS4P4"

})
const auth = firebase.auth()
const firestore = firebase.firestore()


function App() {

  const [user] = useAuthState(auth)

  return (
    <div className="App">
      <header>
        <h1>Chat</h1>
        <SignOut/>
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn/>}
      </section>
    </div>
  )
}

function SignIn() {

  const signInWithGoogle = () =>{
    const provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider)
  }

  return(
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}
function SignOut(){
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom(){

  const dummy = useRef()

  const messagesRef = firestore.collection('messages')
  const query = messagesRef.orderBy('createdAt').limit(25)
  const [messages] = useCollectionData(query, {idField : 'id'})

  const [formValue, setFormValue] = useState('')

  const sendMessage = async (e) =>{


    e.preventDefault()
    const {uid, photoURL } = auth.currentUser

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('')
    dummy.current.scrollIntoView({
      behavior:'smooth'
    })

  }

  return(
    <>
      <main>
        {messages && 
          messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
      <div ref={dummy}></div>
      </main>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange=
          { (e) => setFormValue(e.target.value)} />
        <button type="submit">Send</button>
      </form>
    </>
  )
}

function ChatMessage(props){

  const {text, photoURL ,uid} = props.message
  const messageClass = uid === auth.currentUser.uid ? 'sent': 'received'

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt="profile pic" />
      <p>{text}</p>
    </div>
  )

}

export default App

