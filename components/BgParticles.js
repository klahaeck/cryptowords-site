import Particles from 'react-tsparticles';

const BgParticles = () => {
  return (
    <Particles
      id="tsparticles"
      className="position-absolute"
      // init={particlesInit}
      // loaded={particlesLoaded}
      options={{
        "background": {
          // "color": {
          //   "value": "#043564"
          // },
          // "image": "url('http://vincentgarreau.com/particles.js/assets/img/kbLd9vb_new.gif')",
          // "position": "0 50%",
          // "repeat": "no-repeat",
          // "size": "60%"
        },
        "fullScreen": {
          "zIndex": 1
        },
        "interactivity": {
          "events": {
            "onClick": {
              "enable": true,
              "mode": "repulse"
            },
            "onHover": {
              "enable": true,
              "mode": "grab"
            }
          },
          "modes": {
            "bubble": {
              "distance": 400,
              "duration": 2,
              "opacity": 8,
              "size": 40
            },
            "grab": {
              "distance": 200
            }
          }
        },
        "particles": {
          "color": {
            "value": "rgb(90, 224, 41)"
          },
          "links": {
            "color": {
              "value": "#cccccc"
            },
            "distance": 150,
            "opacity": 0.4
          },
          "move": {
            "attract": {
              "rotate": {
                "x": 600,
                "y": 1200
              }
            },
            "direction": "left",
            "enable": true,
            "outModes": {
              "bottom": "out",
              "left": "out",
              "right": "out",
              "top": "out"
            },
            "speed": 1,
            "straight": true
          },
          "opacity": {
            "value": 1,
            "animation": {
              "speed": 1,
              "minimumValue": 0.1
            }
          },
          "shape": {
            // "options": {
            //   "star": {
            //     "sides": 5
            //   }
            // },
            "type": "square"
          },
          "size": {
            "random": {
              "enable": true
            },
            "value": {
              "min": 15,
              "max": 20
            },
            "animation": {
              "speed": 20,
              "minimumValue": 0.1
            }
          },
          "number": {
            "density": {
              "enable": true,
              "area": 800,
              "factor": 2000
            },
            "value": 10
          }
        }
      }}
    />
  );
};

export default BgParticles;