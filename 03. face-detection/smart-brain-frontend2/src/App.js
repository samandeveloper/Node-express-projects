import React, {Component} from 'react';
import './App.css';
import Navigation from './component/Navigation/Navigation';
import Logo from './component/Logo/Logo';
import ImageLinkForm from './component/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './component/FaceRecognition/FaceRecognition';
import Rank from './component/Rank/Rank';
import Particles from 'react-particles-js';
import Signin from './component/Signin/Signin';
import Register from './component/Register/Register';
import Clarifai from 'clarifai';

  const particlesOptions={
    particles:{
    number: {
    value: 30,
    density:{
      enable: true,
      value_area:200

        }
              } 
          }
            
  } 

const initialState={
      input:'',
      imageUrl:'',
      box:{},
      route:'signin',
      isSignedIn: false,
      user:{
        id:'',
        name:'',
        email:'',
        entries:0,
        joined:''
      }
  }

class App extends Component{
  constructor(){
    super();
    this.state=initialState;
     
  }

  loadUser=(data)=>{
    this.setState({user:{
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }
  })
  }

  calculateFaceLocation =(data)=>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return{
      leftCol:clarifaiFace.left_col*width,
      topRow: clarifaiFace.top_row*height,
      rightCol: width-(clarifaiFace.right_col*width),
      buttomRow: height-(clarifaiFace.bottom_row*height)
    }
  }

  displayFaceBox=(box)=>{
    this.setState({box:box})
  }

  onInputChange=(event)=>{
    this.setState({input:event.target.value});
  }


  onButtonSubmit=()=>{
    this.setState({imageUrl:this.state.input});
     fetch('https://smart-brain-backend2.onrender.com/imageurl',{
            method: 'post',
            headers: {'Content-Type':'application/json'},
            body:JSON.stringify({
              input: this.state.input,
            })
          })
 
      .then(response=>response.json())
      .then(response=> {
        if(response){
          fetch('https://smart-brain-backend2.onrender.com/image',{
            method: 'put',
            headers: {'Content-Type':'application/json'},
            body:JSON.stringify({
              id: this.state.user.id
            })
          })

          .then (response=>response.json())
          .then (count=>{
            this.setState(Object.assign(this.state.user,{entries:count}))
          })
          .catch(console.log);
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err=>console.log(err));
  }

    onRouteChange = (route) => {
      if(route==='signout'){
        this.setState(initialState);
      }
      else if(route==='home'){
        this.setState({isSignedIn:true})
      }
        this.setState({route: route});
  }

  render(){
    return(
      <div className='App'>
        <Particles className='particles' params={particlesOptions}/>
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>

        {this.state.route==='home'

        ?<div>
          <Logo/>
          <Rank 
          name={this.state.user.name}
          entries={this.state.user.entries}/>
          <ImageLinkForm 
          onInputChange={this.onInputChange} 
          onButtonSubmit={this.onButtonSubmit}/>
          <FaceRecognition 
          imageUrl={this.state.imageUrl} 
          box={this.state.box}/>
         </div>


         :(this.state.route==='signin'
          ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          )
           }
      
         </div>
      
      );
}
 
}
export default App;
