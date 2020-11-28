import React, { Component } from 'react';
import Particles from 'react-particles-js';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register'
import Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: '1434605cbc474fa9ac94736e7dc25b4b'
});

const particlesOptions = {
  particles: {
    number: {
      value: 300,
      density: {
        enable: true,
        value_area: 8000
      }
    }
  }
}

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signIn',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {

  constructor() {
    super();
    this.state = initialState;
  }

  calculateFacePosition = (data) => {
    console.log(data.outputs[0].data.regions[0].region_info.bounding_box);
    const faceDots = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('imageUrl');
    const height = Number(image.height);
    const width = Number(image.width);
    return {
      leftCol: faceDots.left_col * width,
      topRow: faceDots.top_row * height,
      rightCol: width - (faceDots.right_col * width),
      bottomRow: height - (faceDots.bottom_row * height)
    }
  }

  onButtonSubmit = () => {
    console.log('klik');
    this.setState({ imageUrl: this.state.input })
    //FACE_DETECT_MODEL: '53e1df302c079b3db8a0a36033ed2d15'
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response => {
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count }))
            })
            .catch(console.log)

        }
        this.displayFace(this.calculateFacePosition(response))

      })
      .catch(err => console.log('greska ', err))
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value })
  }

  displayFace = (box) => {
    this.setState({ box: box });
  }

  onRouteChange = (route) => {
    if (route === 'signOut') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({ isSignedIn: true })
    }
    this.setState({ route: route })
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }

    })
  }

  render() {
    const { isSignedIn, route, box, imageUrl } = this.state;
    return (
      <div className="App">
        <Particles
          className='particles'
          params={{ particlesOptions }}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {
          route === 'home' ?
            <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries} />
              <ImageLinkForm onButtonSubmit={this.onButtonSubmit} onInputChange={this.onInputChange} />
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>
            :
            (route === 'signIn' ?
              <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
              :
              <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />)
        }
      </div>
    );
  }
}

export default App;
