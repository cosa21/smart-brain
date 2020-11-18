import React, { Component } from 'react';
import Particles from 'react-particles-js';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';


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

  constructor(){
    super();
    this.state={
      input:'',
      imageUrl:''
    }
  }

  onButtonSubmit=()=>{
    console.log('klik');
    this.setState({input:this.state.imageUrl})
  }

  onInputChange=(event)=>{
    this.setState({imageUrl:event.target.value})
  }

  render() {
    return (
      <div className="App">
        <Particles
          className='particles'
          params={{ particlesOptions }}
        />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onButtonSubmit={this.onButtonSubmit} onInputChange={this.onInputChange}/>
        <FaceRecognition imageUrl={this.state.input}/>
      </div>
    );
  }
}

export default App;
