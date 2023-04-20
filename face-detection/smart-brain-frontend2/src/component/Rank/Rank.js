import React, {Component} from 'react';
//import './Rank.css';

const Rank =({name, entries})=>{
	return(
	<div>
		<div className='white f3'>
			{`${name}, Your Current Entry Count is...`}
		</div>
		<div className='white f1'> 
		{entries}
		</div>
	</div>
		);
}

export default Rank;