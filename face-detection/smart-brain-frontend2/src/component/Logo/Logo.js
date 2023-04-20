import React, {Component} from 'react';
import Tilt from 'react-tilt';
import './Logo.css';
import brain from './brain.png'

const Logo =()=>{
	return(
		<div style={{marginTop:'-60px'}}>
			<Tilt className="Tilt" options={{ max : 55 }} style={{ height: 135, width: 150 }} >
			<div className="Tilt-inner pa3"> <img style={{paddingTop:'2px'}} alt='logo' src={brain} /> </div>
			</Tilt>
		</div>
		);
}

export default Logo;