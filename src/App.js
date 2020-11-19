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

class App extends Component {

  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signIn',
      isSignedIn: false
    }
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
      .then(response => this.displayFace(this.calculateFacePosition(response)))
      .catch(err => console.log('greska ', err))
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value })
  }

  displayFace = (box) => {
    this.setState({ box: box });
  }

  onRouteChange = (route) => {
    if(route==='signOut'){
      this.setState({isSignedIn:false})
    }else if(route==='home'){
      this.setState({isSignedIn:true})
    }
    this.setState({ route: route })
  }

  render() {
    const {isSignedIn,route,box, imageUrl}=this.state;
    return (
      <div className="App">
        <Particles
          className='particles'
          params={{ particlesOptions }}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        {
          route === 'home' ?
            <div>
              <Logo />
              <Rank />
              <ImageLinkForm onButtonSubmit={this.onButtonSubmit} onInputChange={this.onInputChange} />
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>
            :
            (route==='signIn' ?
            <SignIn onRouteChange={this.onRouteChange}/>
            :
            <Register onRouteChange={this.onRouteChange}/>)
        }
      </div>
    );
  }
}

export default App;
