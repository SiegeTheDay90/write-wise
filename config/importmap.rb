# frozen_string_literal: true

# Pin npm packages by running ./bin/importmap

pin 'application', preload: true
pin 'resume-builder'
pin 'gsap'
pin 'letterToDocx'
pin 'trix', to: 'https://ga.jspm.io/npm:trix@2.0.7/dist/trix.esm.min.js'
pin '@rails/actiontext', to: 'actiontext.js'
pin 'react', to: 'https://ga.jspm.io/npm:react@18.2.0/index.js'
pin 'react-dom', to: 'https://ga.jspm.io/npm:react-dom@18.2.0/index.js'
pin 'scheduler', to: 'https://ga.jspm.io/npm:scheduler@0.23.0/index.js'
pin 'splashcounter', to: 'SplashCounter.js'
pin 'resumecounter', to: 'ResumeCounter.js'
