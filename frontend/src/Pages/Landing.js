import React from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import Land from '../constants/pictures/landing.gif';

function Landing() {
  return (
    <div className='min-h-[70vh] flex flex-col items-center justify-center gap-7 p-4 mt-24 '>
      
      <section className="flex flex-col lg:flex-row items-center justify-stretch py-20 md:px-12 rounded-lg gap-15 border-solid ">
        <div className="text-center md:text-left max-w-2xl">
          <h1 className="text-6xl md:text-8xl font-bold text-blue-900 hover:animate-bounce line transition ease-in-out delay-150">CODEBYTE.</h1>
          <p className="mt-4 text-xl text-gray-600">Your journey starts here.</p>
          <a href={'/home'}><button className="mt-8 bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 hover:scale-110 transition duration-300 landing-button">
            Get Started
          </button></a>
        </div>
        <div className="my-10"></div> {/* Added spacing between sections */}
        <div className="mt-10 md:mt-0 md:ml-10 bg-black p-4 rounded-lg">
          <img
            src={Land} // Use the imported image
            alt="Hero"
            className="w-[60vw] h-[100vh] max-w-lg rounded-lg shadow-lg" // Increased size
          />
        </div>
      </section>

      <section className="bg-blue-700 py-20 w-[90vw] rounded-lg border-4 border-blue-700">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white">Ready to Get Started?</h2>
          <p className="mt-4 text-xl text-blue-100 p-2 border-b-2">Your Ultimate Coding Companion.</p>
          <br/><br/>
          <a href={"/home"}><Button variant='contained' sx={{color: '#2b6cb0', backgroundColor: 'white', ":hover":{scale: 1.1}}} className='landing-button'
          >
            <span className='font-extrabold hover:scale-102'>Get Started</span>
          </Button></a>
        </div>
      </section>
      <div className='flex flex-col items-center justify-center gap-7 h-70'>
        <br/>
      </div> 
    </div>
  );
}

export default Landing;